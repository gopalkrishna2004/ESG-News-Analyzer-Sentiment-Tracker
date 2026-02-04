/**
 * ESG Categorization Service using Google Gemini API
 * Categorizes news articles into Environmental, Social, or Governance categories
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
    
    console.log(`✅ Gemini AI initialized with model: ${modelName}`);
  }
  return model;
}

/**
 * Categorize article into ESG categories
 * @param {string} title - Article title
 * @param {string} description - Article description
 * @param {string} content - Article content (optional)
 * @returns {Promise<Object>} ESG categorization result
 */
async function categorizeESG(title, description, content = '') {
  try {
    const geminiModel = initializeGemini();

    // Prepare the text to analyze
    const textToAnalyze = `${title}. ${description || ''} ${content ? content.substring(0, 500) : ''}`.trim();

    if (!textToAnalyze || textToAnalyze.length < 10) {
      return {
        categories: ['Social'], // Default fallback
        explanation: 'Insufficient text for categorization'
      };
    }

    // Create the prompt for ESG categorization
    const prompt = `You are an ESG (Environmental, Social, Governance) analyst. Analyze the following news article and categorize it into one or more ESG categories.

ESG Categories:
- Environmental (E): Climate change, carbon emissions, pollution, waste management, renewable energy, water conservation, biodiversity
- Social (S): Labor practices, diversity & inclusion, employee welfare, human rights, community relations, product safety, health & safety
- Governance (G): Board diversity, executive compensation, corruption, transparency, shareholder rights, business ethics, compliance

Article:
"${textToAnalyze}"

Instructions:
1. Identify which ESG category or categories this article belongs to (can be multiple)
2. Return ONLY a JSON object in this exact format:
{
  "categories": ["Environmental", "Social", "Governance"],
  "primary": "Environmental",
  "explanation": "Brief explanation of why"
}

Important:
- "categories" should be an array with one or more of: "Environmental", "Social", "Governance"
- "primary" should be the most relevant single category
- Keep explanation under 50 words
- Return ONLY valid JSON, no other text`;

    // Generate content using Gemini
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    let parsedResult;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Fallback: Try to extract categories from text
      const categories = [];
      if (text.toLowerCase().includes('environmental')) categories.push('Environmental');
      if (text.toLowerCase().includes('social')) categories.push('Social');
      if (text.toLowerCase().includes('governance')) categories.push('Governance');
      
      parsedResult = {
        categories: categories.length > 0 ? categories : ['Social'],
        primary: categories[0] || 'Social',
        explanation: 'Categorized based on keyword analysis'
      };
    }

    // Validate and sanitize the result
    const validCategories = ['Environmental', 'Social', 'Governance'];
    const sanitizedCategories = parsedResult.categories
      .filter(cat => validCategories.includes(cat))
      .slice(0, 3); // Max 3 categories

    if (sanitizedCategories.length === 0) {
      sanitizedCategories.push('Social'); // Default fallback
    }

    return {
      categories: sanitizedCategories,
      primary: parsedResult.primary || sanitizedCategories[0],
      explanation: parsedResult.explanation || 'ESG categorization complete'
    };

  } catch (error) {
    console.error('Error in ESG categorization:', error.message);
    
    // Fallback: Return default category
    return {
      categories: ['Social'],
      primary: 'Social',
      explanation: 'Failed to categorize, using default',
      error: error.message
    };
  }
}

/**
 * Batch categorize multiple articles
 * @param {Array} articles - Array of articles with title and description
 * @returns {Promise<Array>} Array of categorization results
 */
async function batchCategorizeESG(articles) {
  const results = [];
  
  for (const article of articles) {
    try {
      const result = await categorizeESG(
        article.title,
        article.description,
        article.content
      );
      results.push({
        articleId: article._id,
        ...result
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error categorizing article:', error.message);
      results.push({
        articleId: article._id,
        categories: ['Social'],
        primary: 'Social',
        explanation: 'Categorization failed',
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Simple keyword-based categorization (fallback)
 * @param {string} text - Text to analyze
 * @returns {Array} Array of ESG categories
 */
function keywordBasedCategorization(text) {
  const lowerText = text.toLowerCase();
  const categories = [];

  // Environmental keywords
  const envKeywords = ['climate', 'carbon', 'emission', 'pollution', 'renewable', 'energy', 'environmental', 'waste', 'water', 'biodiversity', 'sustainability'];
  if (envKeywords.some(keyword => lowerText.includes(keyword))) {
    categories.push('Environmental');
  }

  // Social keywords
  const socialKeywords = ['labor', 'employee', 'diversity', 'inclusion', 'human rights', 'safety', 'community', 'welfare', 'discrimination', 'workplace'];
  if (socialKeywords.some(keyword => lowerText.includes(keyword))) {
    categories.push('Social');
  }

  // Governance keywords
  const govKeywords = ['governance', 'board', 'executive', 'corruption', 'transparency', 'compliance', 'ethics', 'shareholder', 'regulation'];
  if (govKeywords.some(keyword => lowerText.includes(keyword))) {
    categories.push('Governance');
  }

  // If no categories found, default to Social
  return categories.length > 0 ? categories : ['Social'];
}

module.exports = {
  categorizeESG,
  batchCategorizeESG,
  keywordBasedCategorization,
  initializeGemini
};
