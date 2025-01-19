const http = require('http');
const cron = require('node-cron');
const serverConfig = require('./config/server');
const db = require('./services/database');
const router = require('./routes');
const newsletterController = require('./controllers/newsletter');
const scraperService = require('./services/scraper');
const wsService = require('./services/websocket');

class Application {
  constructor() {
    this.server = http.createServer(router.handleRequest.bind(router));
  }

  async start() {
    try {
      await db.initializeTables();
      
      // Schedule weekly newsletter (Sunday at 8:00 AM)
      cron.schedule('0 8 * * 0', () => newsletterController.sendWeeklyNewsletter());
      
      // Schedule daily updates (every day at 6:00 PM)
      cron.schedule('0 18 * * *', () => newsletterController.sendDailyUpdates());
      
      // Schedule scraping (every 5 minutes)
      setInterval(async () => {
        const stories = await scraperService.scrapeHackerNews();
        if (stories.length > 0) {
          // Save stories and broadcast update
          // Add story saving logic here
          wsService.broadcast({ type: 'update', stories });
        }
      }, 5 * 60 * 1000);

      this.server.listen(serverConfig.port, () => {
        console.log(`Server running on port ${serverConfig.port}`);
        console.log(`WebSocket server running on port ${serverConfig.wsPort}`);
      });
    } catch (error) {
      console.error('Failed to start application:', error);
      process.exit(1);
    }
  }
}

const app = new Application();
app.start().catch(console.error);