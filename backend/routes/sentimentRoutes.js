const express = require('express');
const router = express.Router();
const { analyzeSentiment, analyzeBatchSentiment } = require('../services/sentimentService');
const NewsArticle = require('../models/NewsArticle');

/**
 * @route   POST /api/sentiment/analyze
 * @desc    Analyze sentiment of a single text
 * @access  Public
 */
router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const result = await analyzeSentiment(text);

    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze sentiment'
    });
  }
});

/**
 * @route   POST /api/sentiment/analyze-article/:articleId
 * @desc    Analyze sentiment for a specific article by ID
 * @access  Public
 */
router.post('/analyze-article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;

    // Find the article
    const article = await NewsArticle.findById(articleId);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Combine title and description for sentiment analysis
    const textToAnalyze = `${article.title}. ${article.description || ''}`;

    // Analyze sentiment
    const sentimentResult = await analyzeSentiment(textToAnalyze);

    // Update article with sentiment data
    article.sentiment = sentimentResult.sentiment;
    await article.save();

    res.json({
      success: true,
      article: article,
      sentimentResult: sentimentResult
    });
  } catch (error) {
    console.error('Article sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze article sentiment'
    });
  }
});

/**
 * @route   POST /api/sentiment/analyze-company/:companyName
 * @desc    Analyze sentiment for all articles of a company
 * @access  Public
 */
router.post('/analyze-company/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const { limit = 10 } = req.body;

    // Find articles that haven't been analyzed yet (limit to 10)
    const articles = await NewsArticle.find({
      company: companyName,
      sentiment: null
    }).limit(limit);

    if (articles.length === 0) {
      return res.json({
        success: true,
        message: 'All articles already analyzed or no articles found',
        analyzed: 0
      });
    }

    console.log(`📊 Analyzing sentiment for ${articles.length} articles...`);

    let successCount = 0;
    let failCount = 0;

    // Analyze each article
    for (const article of articles) {
      try {
        const textToAnalyze = `${article.title}. ${article.description || ''}`;
        const sentimentResult = await analyzeSentiment(textToAnalyze);

        // Update article
        article.sentiment = sentimentResult.sentiment;
        await article.save();

        successCount++;

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to analyze article ${article._id}:`, error.message);
        failCount++;
      }
    }

    res.json({
      success: true,
      message: `Analyzed ${successCount} articles`,
      analyzed: successCount,
      failed: failCount,
      total: articles.length
    });
  } catch (error) {
    console.error('Batch sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze company articles'
    });
  }
});

/**
 * @route   POST /api/sentiment/analyze-all
 * @desc    Analyze sentiment for all unanalyzed articles
 * @access  Public
 */
router.post('/analyze-all', async (req, res) => {
  try {
    const { limit = 10 } = req.body;

    // Find articles without sentiment analysis
    const articles = await NewsArticle.find({
      sentiment: null
    }).limit(limit);

    if (articles.length === 0) {
      return res.json({
        success: true,
        message: 'All articles already analyzed',
        analyzed: 0
      });
    }

    console.log(`📊 Analyzing sentiment for ${articles.length} articles...`);

    let successCount = 0;
    let failCount = 0;

    for (const article of articles) {
      try {
        const textToAnalyze = `${article.title}. ${article.description || ''}`;
        const sentimentResult = await analyzeSentiment(textToAnalyze);

        article.sentiment = sentimentResult.sentiment;
        await article.save();

        successCount++;
        
        // Progress logging
        if (successCount % 5 === 0) {
          console.log(`✅ Analyzed ${successCount}/${articles.length} articles`);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to analyze article ${article._id}:`, error.message);
        failCount++;
      }
    }

    console.log(`🎉 Sentiment analysis complete: ${successCount} success, ${failCount} failed`);

    res.json({
      success: true,
      message: `Analyzed ${successCount} articles`,
      analyzed: successCount,
      failed: failCount,
      total: articles.length
    });
  } catch (error) {
    console.error('Batch sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze articles'
    });
  }
});

/**
 * @route   GET /api/sentiment/stats/:companyName
 * @desc    Get sentiment statistics for a company
 * @access  Public
 */
router.get('/stats/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;

    // Get sentiment distribution
    const sentimentStats = await NewsArticle.aggregate([
      { $match: { company: companyName, sentiment: { $ne: null } } },
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 }
        }
      }
    ]);

    // Total articles
    const totalAnalyzed = await NewsArticle.countDocuments({
      company: companyName,
      sentiment: { $ne: null }
    });

    const totalUnanalyzed = await NewsArticle.countDocuments({
      company: companyName,
      sentiment: null
    });

    res.json({
      success: true,
      company: companyName,
      stats: {
        totalAnalyzed,
        totalUnanalyzed,
        distribution: sentimentStats
      }
    });
  } catch (error) {
    console.error('Sentiment stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get sentiment stats'
    });
  }
});

module.exports = router;
