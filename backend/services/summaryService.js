/**
 * AI Summary Generation Service using Google Gemini API
 * Generates concise summaries of key ESG issues for companies
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
let genAI = null;
let model = null;

/**
 * Initialize Gemini AI with API key
 */
function initializeGemini() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';
    model = genAI.getGenerativeModel({ model: modelName });
    
    console.log(`✅ Summary Service - Gemini AI initialized with model: ${modelName}`);
  }
  return model;
}

/**
 * Generate ESG summary for a company based on their articles
 * @param {Array} articles - Array of news articles
 * @param {string} companyName - Name of the company
 * @returns {Promise<Object>} Summary object with key insights
 */
async function generateESGSummary(articles, companyName) {
  try {
    if (!articles || articles.length === 0) {
      return {
        success: false,
        message: 'No articles available for summary generation'
      };
    }

    const geminiModel = initializeGemini();

    // Prepare article data for analysis
    const articlesData = articles.slice(0, 20).map(article => ({
      title: article.title,
      description: article.description || '',
      sentiment: article.sentiment || 'Unknown',
      esgCategory: article.esgCategory || []
    }));

    // Create comprehensive prompt for summary generation
    const prompt = `You are an ESG (Environmental, Social, Governance) analyst. Analyze the following news articles about ${companyName} and provide a comprehensive ESG summary.

Articles Data:
${articlesData.map((article, index) => 
  `${index + 1}. Title: ${article.title}
   Description: ${article.description}
   Sentiment: ${article.sentiment}
   ESG Category: ${article.esgCategory.join(', ') || 'Uncategorized'}`
).join('\n\n')}

Provide a JSON response with the following structure:
{
  "overallSummary": "A 2-3 sentence overview of ${companyName}'s current ESG standing based on the news",
  "keyConcerns": ["concern 1", "concern 2", "concern 3"],
  "positiveHighlights": ["highlight 1", "highlight 2", "highlight 3"],
  "trendingTopics": [
    {
      "topic": "topic name",
      "category": "Environmental|Social|Governance",
      "sentiment": "Positive|Negative|Neutral",
      "importance": "High|Medium|Low"
    }
  ],
  "recommendations": "Brief recommendations for stakeholders (1-2 sentences)"
}

Requirements:
- Keep all text concise and actionable
- Focus on the most significant ESG issues
- Identify 3-5 trending topics maximum
- Highlight both concerns and positive developments
- Base analysis strictly on the provided articles

Return ONLY valid JSON, no additional text.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean the response to extract JSON
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    const summary = JSON.parse(text);

    return {
      success: true,
      company: companyName,
      summary,
      analyzedArticles: articles.length,
      generatedAt: new Date()
    };

  } catch (error) {
    console.error('Error generating ESG summary:', error);
    
    // Fallback to basic summary if AI fails
    return generateBasicSummary(articles, companyName);
  }
}

/**
 * Generate a basic summary when AI fails
 * @param {Array} articles - Array of news articles
 * @param {string} companyName - Name of the company
 * @returns {Object} Basic summary object
 */
function generateBasicSummary(articles, companyName) {
  const sentimentCounts = {
    Positive: 0,
    Negative: 0,
    Neutral: 0
  };

  const categoryCounts = {
    Environmental: 0,
    Social: 0,
    Governance: 0
  };

  articles.forEach(article => {
    if (article.sentiment) {
      sentimentCounts[article.sentiment] = (sentimentCounts[article.sentiment] || 0) + 1;
    }
    if (article.esgCategory && Array.isArray(article.esgCategory)) {
      article.esgCategory.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    }
  });

  const dominantSentiment = Object.keys(sentimentCounts).reduce((a, b) => 
    sentimentCounts[a] > sentimentCounts[b] ? a : b
  );

  const dominantCategory = Object.keys(categoryCounts).reduce((a, b) => 
    categoryCounts[a] > categoryCounts[b] ? a : b
  );

  return {
    success: true,
    company: companyName,
    summary: {
      overallSummary: `Based on ${articles.length} articles, ${companyName} has a predominantly ${dominantSentiment.toLowerCase()} ESG coverage, with focus on ${dominantCategory} issues.`,
      keyConcerns: articles
        .filter(a => a.sentiment === 'Negative')
        .slice(0, 3)
        .map(a => a.title),
      positiveHighlights: articles
        .filter(a => a.sentiment === 'Positive')
        .slice(0, 3)
        .map(a => a.title),
      trendingTopics: Object.keys(categoryCounts)
        .filter(cat => categoryCounts[cat] > 0)
        .map(cat => ({
          topic: `${cat} initiatives`,
          category: cat,
          sentiment: dominantSentiment,
          importance: categoryCounts[cat] > 3 ? 'High' : 'Medium'
        })),
      recommendations: 'Continue monitoring ESG developments and stakeholder concerns.'
    },
    analyzedArticles: articles.length,
    generatedAt: new Date(),
    fallback: true
  };
}

module.exports = {
  generateESGSummary
};
