require('dotenv').config();
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'hnuser',
    password: process.env.DB_PASSWORD || 'pass',
    database: process.env.DB_NAME || 'hackernews'
  };
  
  module.exports = dbConfig;