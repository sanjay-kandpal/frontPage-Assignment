const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

class DatabaseService {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  async getConnection() {
    return await this.pool.getConnection();
  }

  async initializeTables() {
    try {
      const connection = await this.getConnection();
      
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS stories (
          id INT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          url VARCHAR(255),
          points INT,
          author VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          last_sent TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          confirmed BOOLEAN DEFAULT FALSE,
          confirm_token VARCHAR(64),
          INDEX (email)
        )
      `);

      connection.release();
      console.log('Database initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService();