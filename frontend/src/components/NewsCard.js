import React from 'react';
import './NewsCard.css';

function NewsCard({ article }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSentimentBadge = (sentiment) => {
    if (!sentiment) return null;
    
    const badges = {
      'Positive': { emoji: '✅', color: '#10b981', label: 'Positive' },
      'Negative': { emoji: '❌', color: '#ef4444', label: 'Negative' },
      'Neutral': { emoji: '➖', color: '#6b7280', label: 'Neutral' }
    };

    const badge = badges[sentiment];
    if (!badge) return null;

    return (
      <span className="sentiment-badge" style={{ backgroundColor: badge.color }}>
        {badge.emoji} {badge.label}
      </span>
    );
  };

  const getESGBadges = (categories) => {
    if (!categories || categories.length === 0) return null;

    const badges = {
      'Environmental': { emoji: '🌍', color: '#10b981' },
      'Social': { emoji: '👥', color: '#3b82f6' },
      'Governance': { emoji: '⚖️', color: '#8b5cf6' }
    };

    return (
      <div className="esg-badges">
        {categories.map((category, index) => {
          const badge = badges[category];
          if (!badge) return null;
          
          return (
            <span 
              key={index} 
              className="esg-badge" 
              style={{ backgroundColor: badge.color }}
            >
              {badge.emoji} {category}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="news-card">
      {article.urlToImage && (
        <div className="news-image">
          <img src={article.urlToImage} alt={article.title} />
        </div>
      )}
      
      <div className="news-content">
        <div className="news-meta">
          <span className="news-source">{article.source?.name || 'Unknown Source'}</span>
          <span className="news-date">{formatDate(article.publishedAt)}</span>
        </div>

        <h3 className="news-title">{article.title}</h3>
        
        {article.description && (
          <p className="news-description">{article.description}</p>
        )}

        {article.author && (
          <p className="news-author">By {article.author}</p>
        )}

        <div className="news-badges">
          {getSentimentBadge(article.sentiment)}
          {getESGBadges(article.esgCategory)}
        </div>

        {article.aiSummary && (
          <div className="ai-summary">
            <p className="ai-summary-label">🤖 AI Summary:</p>
            <p className="ai-summary-text">{article.aiSummary}</p>
          </div>
        )}

        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="read-more-btn"
        >
          Read Full Article →
        </a>
      </div>
    </div>
  );
}

export default NewsCard;
