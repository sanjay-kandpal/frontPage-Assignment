const serverConfig = {
    port: process.env.SERVER_PORT || 3000,
    wsPort: process.env.WS_PORT || 8080
  };
  
  module.exports = serverConfig;