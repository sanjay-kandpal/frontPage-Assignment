const db = require('../services/database');
const mailer = require('../services/mailer');

let lastCheckTime = new Date();

class NewsletterController {
  async getNewStoriesSinceLastCheck() {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.execute(`
        SELECT * FROM stories 
        WHERE created_at > ?
        ORDER BY created_at DESC
      `, [lastCheckTime]);
      connection.release();
      return rows;
    } catch (error) {
      console.error('Error getting new stories:', error);
      return [];
    }
  }

  async sendDailyUpdates() {
    try {
      const connection = await db.getConnection();
      const [subscribers] = await connection.execute(
        'SELECT * FROM subscribers WHERE confirmed = TRUE'
      );
      connection.release();

      if (subscribers.length === 0) {
        console.log('No confirmed subscribers found for daily update');
        return;
      }

      const newStories = await this.getNewStoriesSinceLastCheck();
      
      if (newStories.length === 0) {
        console.log('No new stories found for daily update');
        return;
      }

      console.log(`Sending daily update (${newStories.length} new stories) to ${subscribers.length} subscribers`);
      
      for (const subscriber of subscribers) {
        await mailer.sendNewsletterToSubscriber(subscriber, newStories, 'daily');
      }
      
      lastCheckTime = new Date();
      console.log('Daily updates sent successfully');
    } catch (error) {
      console.error('Error sending daily updates:', error);
    }
  }
  async sendWeeklyNewsletter() {
    try {
      const connection = await db.getConnection();
      const [subscribers] = await connection.execute(
        'SELECT * FROM subscribers WHERE confirmed = TRUE'
      );
      connection.release();

      if (subscribers.length === 0) {
        console.log('No confirmed subscribers found');
        return;
      }

      const topStories = await this.getWeeklyTopStories();
      
      if (topStories.length === 0) {
        console.log('No stories found for weekly newsletter');
        return;
      }

      console.log(`Sending weekly newsletter to ${subscribers.length} subscribers`);
      
      for (const subscriber of subscribers) {
        await mailer.sendNewsletterToSubscriber(subscriber, topStories, 'weekly');
      }
      
      console.log('Weekly newsletter sent successfully');
    } catch (error) {
      console.error('Error sending weekly newsletter:', error);
    }
  }

  async getWeeklyTopStories() {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.execute(`
        SELECT * FROM stories 
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        ORDER BY points DESC 
        LIMIT 5
      `);
      connection.release();
      return rows;
    } catch (error) {
      console.error('Error getting weekly top stories:', error);
      return [];
    }
  }
}

module.exports = new NewsletterController();