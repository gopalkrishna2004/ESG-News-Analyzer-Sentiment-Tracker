const express = require('express');
const router = express.Router();
const { categorizeESG, batchCategorizeESG } = require('../services/esgCategorizationService');
const NewsArticle = require('../models/NewsArticle');

/**
 * @route   POST /api/esg/categorize
 * @desc    Categorize a single text into ESG categories
 * @access  Public
 */
router.post('/categorize', async (req, res) => {
  try {
    const { text, title, description } = req.body;

    if (!text && !title) {
      return res.status(400).json({
        success: false,
        message: 'Text or title is required'
      });
    }

    const result = await categorizeESG(
      title || text,
      description || '',
      ''
    );

    res.json({
      success: true,
      result: result
    });
  } catch (error) {
    console.error('ESG categorization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to categorize'
    });
  }
});

/**
 * @route   POST /api/esg/categorize-article/:articleId
 * @desc    Categorize a specific article by ID
 * @access  Public
 */
router.post('/categorize-article/:articleId', async (req, res) => {
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

    // Categorize using Gemini
    const esgResult = await categorizeESG(
      article.title,
      article.description,
      article.content
    );

    // Update article with ESG categories
    article.esgCategory = esgResult.categories;
    await article.save();

    res.json({
      success: true,
      article: article,
      esgResult: esgResult
    });
  } catch (error) {
    console.error('Article ESG categorization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to categorize article'
    });
  }
});

/**
 * @route   POST /api/esg/categorize-company/:companyName
 * @desc    Categorize all articles of a company using Gemini
 * @access  Public
 */
router.post('/categorize-company/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const { limit = 10 } = req.body;

    // Find articles that haven't been categorized yet
    const articles = await NewsArticle.find({
      company: companyName,
      $or: [
        { esgCategory: null },
        { esgCategory: { $exists: false } },
        { esgCategory: { $size: 0 } }
      ]
    }).limit(limit);

    if (articles.length === 0) {
      return res.json({
        success: true,
        message: 'All articles already categorized or no articles found',
        categorized: 0
      });
    }

    console.log(`🏷️  Categorizing ${articles.length} articles using Gemini AI...`);

    let successCount = 0;
    let failCount = 0;

    // Categorize each article
    for (const article of articles) {
      try {
        const esgResult = await categorizeESG(
          article.title,
          article.description,
          article.content
        );

        // Update article
        article.esgCategory = esgResult.categories;
        await article.save();

        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to categorize article ${article._id}:`, error.message);
        failCount++;
      }
    }

    res.json({
      success: true,
      message: `Categorized ${successCount} articles`,
      categorized: successCount,
      failed: failCount,
      total: articles.length
    });
  } catch (error) {
    console.error('Batch ESG categorization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to categorize company articles'
    });
  }
});

/**
 * @route   GET /api/esg/filter/:companyName/:category
 * @desc    Get articles filtered by ESG category
 * @access  Public
 */
router.get('/filter/:companyName/:category', async (req, res) => {
  try {
    const { companyName, category } = req.params;
    const { limit = 50 } = req.query;

    // Validate category
    const validCategories = ['Environmental', 'Social', 'Governance'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be Environmental, Social, or Governance'
      });
    }

    // Find articles with this category
    const articles = await NewsArticle.find({
      company: companyName,
      esgCategory: category
    })
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: articles.length,
      company: companyName,
      category: category,
      articles: articles
    });
  } catch (error) {
    console.error('ESG filter error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to filter articles'
    });
  }
});

/**
 * @route   GET /api/esg/stats/:companyName
 * @desc    Get ESG category statistics for a company
 * @access  Public
 */
router.get('/stats/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;

    // Get ESG distribution
    const esgStats = await NewsArticle.aggregate([
      { $match: { company: companyName } },
      { $unwind: '$esgCategory' },
      { $group: { _id: '$esgCategory', count: { $sum: 1 } } }
    ]);

    // Total articles
    const totalCategorized = await NewsArticle.countDocuments({
      company: companyName,
      esgCategory: { $exists: true, $ne: null, $not: { $size: 0 } }
    });

    const totalUncategorized = await NewsArticle.countDocuments({
      company: companyName,
      $or: [
        { esgCategory: null },
        { esgCategory: { $exists: false } },
        { esgCategory: { $size: 0 } }
      ]
    });

    res.json({
      success: true,
      company: companyName,
      stats: {
        totalCategorized,
        totalUncategorized,
        distribution: esgStats
      }
    });
  } catch (error) {
    console.error('ESG stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get ESG statistics'
    });
  }
});

module.exports = router;
