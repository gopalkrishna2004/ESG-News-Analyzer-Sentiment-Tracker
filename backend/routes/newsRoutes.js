const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const NewsArticle = require('../models/NewsArticle');

/**
 * @route   POST /api/news/search
 * @desc    Search for ESG news for a company
 * @access  Public
 */
router.post('/search', async (req, res) => {
  try {
    const { companyName, pageSize } = req.body;

    if (!companyName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Company name is required' 
      });
    }

    // Fetch news from API and save to database
    const articles = await newsService.searchCompanyNews(companyName, pageSize);

    res.json({
      success: true,
      count: articles.length,
      company: companyName,
      articles: articles
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search news'
    });
  }
});

/**
 * @route   GET /api/news/company/:companyName
 * @desc    Get stored news articles for a company
 * @access  Public
 */
router.get('/company/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const { sentiment, esgCategory, limit } = req.query;

    const filters = {};
    if (sentiment) filters.sentiment = sentiment;
    if (esgCategory) filters.esgCategory = esgCategory;
    if (limit) filters.limit = parseInt(limit);

    const articles = await newsService.getStoredNews(companyName, filters);

    res.json({
      success: true,
      count: articles.length,
      company: companyName,
      articles: articles
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch news'
    });
  }
});

/**
 * @route   GET /api/news/companies
 * @desc    Get all companies with stored news
 * @access  Public
 */
router.get('/companies', async (req, res) => {
  try {
    const companies = await newsService.getAllCompanies();

    res.json({
      success: true,
      count: companies.length,
      companies: companies
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch companies'
    });
  }
});

/**
 * @route   GET /api/news/stats/:companyName
 * @desc    Get statistics for a company's news
 * @access  Public
 */
router.get('/stats/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;

    const totalArticles = await NewsArticle.countDocuments({ company: companyName });
    
    const sentimentStats = await NewsArticle.aggregate([
      { $match: { company: companyName, sentiment: { $ne: null } } },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    const esgStats = await NewsArticle.aggregate([
      { $match: { company: companyName } },
      { $unwind: '$esgCategory' },
      { $group: { _id: '$esgCategory', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      company: companyName,
      stats: {
        totalArticles,
        sentimentDistribution: sentimentStats,
        esgDistribution: esgStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
