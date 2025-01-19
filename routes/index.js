const http = require('http');
const subscriptionController = require('../controllers/subscription');

class Router {
  async handleRequest(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/subscribe') {
      await this.handleSubscribe(req, res);
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/confirm')) {
      await this.handleConfirm(req, res);
      return;
    }

    res.writeHead(404);
    res.end();
  }

  async handleSubscribe(req, res) {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { email } = JSON.parse(body);
        const success = await subscriptionController.subscribeUser(email);

        if (success) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Subscription successful' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Subscription failed' }));
        }
      } catch (error) {
        console.error('Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Server error' }));
      }
    });
  }

  async handleConfirm(req, res) {
    const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
    
    try {
      const success = await subscriptionController.confirmSubscription(token);
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(success ? this.getSuccessHTML() : this.getErrorHTML());
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>Server Error</h1>');
    }
  }

  getSuccessHTML() {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5;">
          <div style="text-align: center; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #166534;">Subscription Confirmed!</h1>
            <p>You'll now receive weekly updates of top Hacker News stories.</p>
          </div>
        </body>
      </html>
    `;
  }

  getErrorHTML() {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f2f5;">
          <div style="text-align: center; padding: 2rem; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #991b1b;">Invalid or Expired Link</h1>
            <p>Please try subscribing again.</p>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = new Router();