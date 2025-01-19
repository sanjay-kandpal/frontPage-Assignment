const WebSocket = require('ws');
const serverConfig = require('../config/server');

class WebSocketService {
  constructor() {
    this.clients = new Set();
    this.wss = new WebSocket.Server({ port: serverConfig.wsPort });
    this.initializeWebSocket();
  }

  initializeWebSocket() {
    this.wss.on('connection', this.handleConnection.bind(this));
  }

  async handleConnection(ws) {
    this.clients.add(ws);
    console.log('Client connected');

    ws.on('close', () => {
      this.clients.delete(ws);
      console.log('Client disconnected');
    });
  }

  broadcast(message) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}

module.exports = new WebSocketService();
