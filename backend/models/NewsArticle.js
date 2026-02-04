const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  content: {
    type: String
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  urlToImage: {
    type: String
  },
  publishedAt: {
    type: Date,
    required: true
  },
  source: {
    name: String,
    id: String
  },
  author: {
    type: String
  },
  // ESG-related fields (will be populated by AI in later features)
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral', null],
    default: null
  },
  esgCategory: [{
    type: String,
    enum: ['Environmental', 'Social', 'Governance', null]
  }],
  aiSummary: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient querying
newsArticleSchema.index({ company: 1, publishedAt: -1 });
newsArticleSchema.index({ esgCategory: 1 });
newsArticleSchema.index({ sentiment: 1 });

module.exports = mongoose.model('NewsArticle', newsArticleSchema);
