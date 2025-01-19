const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');

class MailerService {
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendConfirmationEmail(email, token) {
    try {
      await this.transporter.sendMail({
        from: emailConfig.auth.user,
        to: email,
        subject: 'Confirm Your Hacker News Newsletter Subscription',
        html: this.generateConfirmationEmailHTML(token)
      });
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  async sendNewsletterToSubscriber(subscriber, stories, type = 'weekly') {
    try {
      const html = type === 'weekly' ? 
        this.generateWeeklyNewsletterHTML(stories) : 
        this.generateDailyNewsletterHTML(stories);
      
      await this.transporter.sendMail({
        from: emailConfig.auth.user,
        to: subscriber.email,
        subject: type === 'weekly' ? 
          'Your Weekly Hacker News Top Stories' : 
          'Your Daily Hacker News Updates',
        html: html
      });
      return true;
    } catch (error) {
      console.error('Error sending newsletter to', subscriber.email, ':', error);
      return false;
    }
  }

  generateConfirmationEmailHTML(token) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Confirm Your Subscription</h1>
        <p>Click the link below to confirm your subscription to the Hacker News newsletter:</p>
        <a href="http://localhost:3000/confirm?token=${token}" 
           style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">
          Confirm Subscription
        </a>
      </div>
    `;
  }

  generateWeeklyNewsletterHTML(stories) {
    // ... HTML generation code for weekly newsletter
  }

  generateDailyNewsletterHTML(stories) {
    // ... HTML generation code for daily newsletter
  }
}

module.exports = new MailerService();
