const axios = require('axios');
const cheerio = require('cheerio');

class ScraperService {
  async scrapeHackerNews() {
    try {
      const response = await axios.get('https://news.ycombinator.com/');
      const $ = cheerio.load(response.data);
      const stories = [];

      $('.athing').each((i, element) => {
        const id = parseInt($(element).attr('id'));
        const title = $(element).find('.titleline > a').text();
        const url = $(element).find('.titleline > a').attr('href');
        const subtext = $(element).next();
        const points = parseInt(subtext.find('.score').text()) || 0;
        const author = subtext.find('.hnuser').text();

        stories.push({ id, title, url, points, author });
      });

      return stories;
    } catch (error) {
      console.error('Scraping error:', error);
      return [];
    }
  }
}

module.exports = new ScraperService();