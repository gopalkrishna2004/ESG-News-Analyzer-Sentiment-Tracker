/**
 * Routes for AI Summary Generation
 */

const express = require('express');
const router = express.Router();
const NewsArticle = require('../models/NewsArticle');
const { generateESGSummary } = require('../services/summaryService');

/**
 * GET /api/summary/:company
 * Generate AI summary for a company's ESG news
 */
router.get('/:company', async (req, res) => {
  try {
    const company = req.params.company;

    // Fetch all articles for the company
    const articles = await NewsArticle.find({ 
      company: new RegExp(company, 'i') 
    })
    .sort({ publishedAt: -1 })
    .limit(50);

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No articles found for company: ${company}`
      });
    }

    // Generate AI summary
    const summaryResult = await generateESGSummary(articles, company);

    res.json(summaryResult);

  } catch (error) {
    console.error('Error in summary generation endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary',
      message: error.message
    });
  }
});

module.exports = router;
