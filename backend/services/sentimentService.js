/**
 * Sentiment Analysis Service using Hugging Face Transformers.js
 * Model: MarieAngeA13/Sentiment-Analysis-BERT (runs locally)
 * 
 * This service uses the singleton pattern to efficiently load and reuse
 * the sentiment analysis model across multiple requests.
 */

class SentimentAnalysisPipeline {
  static task = 'sentiment-analysis';
  static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'; // Works with Transformers.js
  static instance = null;
  static isLoading = false;

  static async getInstance(progress_callback = null) {
    if (this.instance === null && !this.isLoading) {
      this.isLoading = true;
      
      try {
        console.log('🤖 Loading sentiment analysis model...');
        
        // Dynamically import Transformers.js (ESM module)
        const { pipeline, env } = await import('@huggingface/transformers');

        // Optional: Set cache directory
        // env.cacheDir = './.cache';
        
        // Optional: Use local models only
        // env.allowRemoteModels = false;
        // env.localModelPath = '/path/to/models/';

        this.instance = await pipeline(this.task, this.model, { progress_callback });
        console.log('✅ Sentiment analysis model loaded successfully!');
      } catch (error) {
        console.error('❌ Failed to load sentiment model:', error);
        this.isLoading = false;
        throw error;
      }
      
      this.isLoading = false;
    }

    // Wait if model is currently loading
    while (this.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return this.instance;
  }
}

/**
 * Analyze sentiment of text using BERT model
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Sentiment analysis result
 */
async function analyzeSentiment(text) {
  try {
    if (!text || text.trim().length === 0) {
      return {
        sentiment: 'Neutral'
      };
    }

    // Truncate text to avoid model limits (BERT typically handles ~512 tokens)
    const truncatedText = text.substring(0, 500);

    // Get the sentiment classifier
    const classifier = await SentimentAnalysisPipeline.getInstance();
    
    // Run classification
    const result = await classifier(truncatedText);
    
    // Process result
    // Model returns: [{ label: 'POSITIVE' or 'NEGATIVE', score: confidence }]
    const prediction = Array.isArray(result) ? result[0] : result;
    
    // Map to our format (Positive, Negative, Neutral)
    const label = prediction.label.toLowerCase();
    const score = prediction.score;

    // Enhanced sentiment classification with neutral detection
    // If confidence is low (between 0.4 and 0.6), classify as Neutral
    let sentiment = 'Neutral';
    
    if (score >= 0.6) {
      // High confidence - use the model's prediction
      if (label === 'positive') {
        sentiment = 'Positive';
      } else if (label === 'negative') {
        sentiment = 'Negative';
      }
    } else if (score <= 0.4) {
      // Low confidence on the other side - opposite sentiment
      if (label === 'positive') {
        sentiment = 'Negative';  // Model says positive with low confidence = actually negative
      } else if (label === 'negative') {
        sentiment = 'Positive';   // Model says negative with low confidence = actually positive
      }
    } else {
      // Medium confidence (0.4-0.6) = Neutral
      sentiment = 'Neutral';
    }

    return {
      sentiment: sentiment           // Positive/Negative/Neutral
    };

  } catch (error) {
    console.error('Error in sentiment analysis:', error);
    return {
      sentiment: 'Neutral'
    };
  }
}

/**
 * Analyze sentiment for multiple texts in batch
 * @param {Array<string>} texts - Array of texts to analyze
 * @returns {Promise<Array<Object>>} Array of sentiment results
 */
async function analyzeBatchSentiment(texts) {
  const results = [];
  
  for (const text of texts) {
    try {
      const result = await analyzeSentiment(text);
      results.push(result);
      
      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (error) {
      console.error('Error analyzing text:', error.message);
      results.push({
        sentiment: 'Neutral'
      });
    }
  }
  
  return results;
}

/**
 * Pre-load the model (optional, for faster first request)
 */
async function preloadModel() {
  try {
    console.log('🔄 Pre-loading sentiment analysis model...');
    await SentimentAnalysisPipeline.getInstance();
    console.log('✅ Model pre-loaded successfully!');
  } catch (error) {
    console.error('❌ Failed to pre-load model:', error.message);
  }
}

module.exports = {
  analyzeSentiment,
  analyzeBatchSentiment,
  preloadModel,
  SentimentAnalysisPipeline
};
