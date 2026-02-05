const express = require('express');
const router = express.Router();
const NewsArticle = require('../models/NewsArticle');

/**
 * @route   GET /api/analytics/sentiment-trends/:companyName
 * @desc    Get sentiment trends over time for a company
 * @access  Public
 */
router.get('/sentiment-trends/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    
    // Get articles with sentiment, grouped by date
    const articles = await NewsArticle.find({
      company: companyName,
      sentiment: { $ne: null }
    }).sort({ publishedAt: 1 });

    // Group by date and count sentiments
    const trendData = {};
    
    articles.forEach(article => {
      const date = new Date(article.publishedAt).toISOString().split('T')[0];
      
      if (!trendData[date]) {
        trendData[date] = {
          date,
          Positive: 0,
          Negative: 0,
          Neutral: 0,
          total: 0
        };
      }
      
      trendData[date][article.sentiment]++;
      trendData[date].total++;
    });

    // Convert to array and sort by date
    const trends = Object.values(trendData).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    res.json({
      success: true,
      company: companyName,
      trends
    });
  } catch (error) {
    console.error('Sentiment trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sentiment trends',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/esg-distribution/:companyName
 * @desc    Get ESG category distribution for a company
 * @access  Public
 */
router.get('/esg-distribution/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    
    // Get ESG distribution using aggregation
    const distribution = await NewsArticle.aggregate([
      { 
        $match: { 
          company: companyName,
          esgCategory: { $exists: true, $ne: null, $ne: [] }
        } 
      },
      { $unwind: '$esgCategory' },
      { 
        $group: { 
          _id: '$esgCategory', 
          count: { $sum: 1 } 
        } 
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$count'
        }
      }
    ]);

    // Calculate total
    const total = distribution.reduce((sum, item) => sum + item.value, 0);

    res.json({
      success: true,
      company: companyName,
      distribution,
      total
    });
  } catch (error) {
    console.error('ESG distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ESG distribution',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/timeline/:companyName
 * @desc    Get timeline of ESG events for a company
 * @access  Public
 */
router.get('/timeline/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const { limit = 50 } = req.query;
    
    // Get articles sorted by date
    const articles = await NewsArticle.find({
      company: companyName
    })
    .sort({ publishedAt: -1 })
    .limit(parseInt(limit))
    .select('title publishedAt sentiment esgCategory source');

    // Format for timeline
    const timeline = articles.map(article => ({
      date: article.publishedAt,
      title: article.title,
      sentiment: article.sentiment,
      esgCategory: article.esgCategory,
      source: article.source?.name || 'Unknown'
    }));

    res.json({
      success: true,
      company: companyName,
      timeline
    });
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/analytics/overview/:companyName
 * @desc    Get overview statistics for a company
 * @access  Public
 */
router.get('/overview/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    
    // Total articles
    const totalArticles = await NewsArticle.countDocuments({ company: companyName });
    
    // Sentiment counts
    const sentimentStats = await NewsArticle.aggregate([
      { $match: { company: companyName, sentiment: { $ne: null } } },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } }
    ]);

    // ESG category counts
    const esgStats = await NewsArticle.aggregate([
      { 
        $match: { 
          company: companyName,
          esgCategory: { $exists: true, $ne: null, $ne: [] }
        } 
      },
      { $unwind: '$esgCategory' },
      { $group: { _id: '$esgCategory', count: { $sum: 1 } } }
    ]);

    // Most recent article
    const latestArticle = await NewsArticle.findOne({ company: companyName })
      .sort({ publishedAt: -1 })
      .select('publishedAt');

    res.json({
      success: true,
      company: companyName,
      stats: {
        totalArticles,
        sentimentBreakdown: sentimentStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        esgBreakdown: esgStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        lastUpdated: latestArticle?.publishedAt || null
      }
    });
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview',
      error: error.message
    });
  }
});

module.exports = router;
