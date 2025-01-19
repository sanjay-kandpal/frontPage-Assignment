const crypto = require('crypto');
const db = require('../services/database');
const mailer = require('../services/mailer');

class SubscriptionController {
  async subscribeUser(email) {
    try {
      const confirmToken = crypto.randomBytes(32).toString('hex');
      const connection = await db.getConnection();
      
      await connection.execute(
        'INSERT INTO subscribers (email, confirm_token) VALUES (?, ?)',
        [email, confirmToken]
      );
      
      await mailer.sendConfirmationEmail(email, confirmToken);
      connection.release();
      return true;
    } catch (error) {
      console.error('Error subscribing user:', error);
      return false;
    }
  }

  async confirmSubscription(token) {
    try {
      const connection = await db.getConnection();
      const [result] = await connection.execute(
        'UPDATE subscribers SET confirmed = TRUE WHERE confirm_token = ?',
        [token]
      );
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error confirming subscription:', error);
      return false;
    }
  }
}

module.exports = new SubscriptionController();