const NewsAPI = require('newsapi');
const NewsArticle = require('../models/NewsArticle');

// Lazy initialization of NewsAPI client
let newsapi = null;

const getNewsAPI = () => {
  if (!newsapi) {
    if (!process.env.NEWS_API_KEY) {
      throw new Error('NEWS_API_KEY is not set in environment variables');
    }
    newsapi = new NewsAPI(process.env.NEWS_API_KEY);
  }
  return newsapi;
};

// ESG-related keywords organized by category
const ESG_KEYWORDS = {
  // General ESG terms
  general: ['ESG', 'sustainability', 'sustainable development', 'corporate responsibility'],
  
  // Environmental (E): Climate change, carbon emissions, pollution, waste management, renewable energy, water conservation
  environmental: [
    'climate change', 'carbon emissions', 'pollution', 'waste management',
    'renewable energy', 'water conservation', 'environmental impact',
    'net zero', 'carbon footprint', 'green energy', 'clean energy'
  ],
  
  // Social (S): Labor practices, diversity & inclusion, employee welfare, human rights, community relations, product safety
  social: [
    'labor practices', 'diversity inclusion', 'employee welfare', 'human rights',
    'community relations', 'product safety', 'workplace safety',
    'gender equality', 'fair labor', 'worker rights'
  ],
  
  // Governance (G): Board diversity, executive compensation, corruption, transparency, shareholder rights, business ethics
  governance: [
    'board diversity', 'executive compensation', 'corruption', 'transparency',
    'shareholder rights', 'business ethics', 'corporate governance',
    'compliance', 'accountability', 'ethical practices'
  ]
};

class NewsService {
  /**
   * Search for ESG-related news for a specific company
   * @param {string} companyName - Name of the company to search
   * @param {number} pageSize - Number of articles to fetch (default 10)
   * @returns {Promise<Array>} Array of news articles
   */
  async searchCompanyNews(companyName, pageSize = 10) {
    try {
      // Build search query covering ALL ESG categories (E, S, G)
      // Select top keywords from each category to ensure balanced coverage
      const topKeywords = [
        // General
        ...ESG_KEYWORDS.general.slice(0, 2),
        // Environmental (E)
        ...ESG_KEYWORDS.environmental.slice(0, 4),
        // Social (S)
        ...ESG_KEYWORDS.social.slice(0, 4),
        // Governance (G)
        ...ESG_KEYWORDS.governance.slice(0, 4)
      ];
      
      const esgQuery = topKeywords.join(' OR ');
      const searchQuery = `"${companyName}" AND (${esgQuery})`;

      console.log(`Searching ESG news for: ${companyName}`);

      // Use everything endpoint for comprehensive search
      const response = await getNewsAPI().v2.everything({
        q: searchQuery,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: pageSize,
        // Get news from last 30 days
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      if (response.status === 'ok' && response.articles) {
        // Save articles to database
        const savedArticles = await this.saveArticles(companyName, response.articles);
        return savedArticles;
      }

      return [];
    } catch (error) {
      console.error('Error fetching news:', error.message);
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }

  /**
   * Save news articles to database (avoid duplicates)
   * @param {string} companyName - Company name
   * @param {Array} articles - Array of news articles from API
   * @returns {Promise<Array>} Saved articles
   */
  async saveArticles(companyName, articles) {
    const savedArticles = [];

    for (const article of articles) {
      try {
        // Check if article already exists (by URL)
        const existingArticle = await NewsArticle.findOne({ url: article.url });

        if (existingArticle) {
          savedArticles.push(existingArticle);
          continue;
        }

        // Create new article
        const newArticle = new NewsArticle({
          company: companyName,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source,
          author: article.author
        });

        const saved = await newArticle.save();
        savedArticles.push(saved);
      } catch (error) {
        // Skip duplicate errors
        if (error.code === 11000) {
          console.log(`Article already exists: ${article.url}`);
          const existingArticle = await NewsArticle.findOne({ url: article.url });
          if (existingArticle) savedArticles.push(existingArticle);
        } else {
          console.error('Error saving article:', error.message);
        }
      }
    }

    return savedArticles;
  }

  /**
   * Get stored news articles for a company from database
   * @param {string} companyName - Company name
   * @param {Object} filters - Optional filters (sentiment, esgCategory, limit)
   * @returns {Promise<Array>} Array of news articles
   */
  async getStoredNews(companyName, filters = {}) {
    try {
      const query = { company: companyName };

      // Apply filters if provided
      if (filters.sentiment) {
        query.sentiment = filters.sentiment;
      }
      if (filters.esgCategory) {
        query.esgCategory = filters.esgCategory;
      }

      const limit = filters.limit || 50;

      const articles = await NewsArticle.find(query)
        .sort({ publishedAt: -1 })
        .limit(limit);

      return articles;
    } catch (error) {
      console.error('Error fetching stored news:', error.message);
      throw new Error(`Failed to fetch stored news: ${error.message}`);
    }
  }

  /**
   * Get all companies that have news in the database
   * @returns {Promise<Array>} Array of company names
   */
  async getAllCompanies() {
    try {
      const companies = await NewsArticle.distinct('company');
      return companies;
    } catch (error) {
      console.error('Error fetching companies:', error.message);
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }
  }
}

module.exports = new NewsService();
