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

  const renderBadges = (sentiment, categories) => {
    const badges = [];

    // Add sentiment badge
    if (sentiment) {
      const sentimentBadges = {
        'Positive': { color: '#10b981', label: 'Positive' },
        'Negative': { color: '#ef4444', label: 'Negative' },
        'Neutral': { color: '#6b7280', label: 'Neutral' }
      };

      const badge = sentimentBadges[sentiment];
      if (badge) {
        badges.push(
          <span key="sentiment" className="badge sentiment-badge" style={{ backgroundColor: badge.color }}>
            {badge.label}
          </span>
        );
      }
    }

    // Add ESG badges
    if (categories && categories.length > 0) {
      const esgBadges = {
        'Environmental': { color: '#10b981', shortLabel: 'E', fullLabel: 'Environmental' },
        'Social': { color: '#3b82f6', shortLabel: 'S', fullLabel: 'Social' },
        'Governance': { color: '#8b5cf6', shortLabel: 'G', fullLabel: 'Governance' }
      };

      categories.forEach((category, index) => {
        const badge = esgBadges[category];
        if (badge) {
          badges.push(
            <span 
              key={`esg-${index}`}
              className="badge esg-badge" 
              style={{ backgroundColor: badge.color }}
              title={badge.fullLabel}
            >
              {badge.shortLabel}
            </span>
          );
        }
      });
    }

    return badges;
  };

  return (
    <div className="news-card">
      {article.urlToImage && (
        <div className="news-image">
          <img src={article.urlToImage} alt={article.title} />
        </div>
      )}
      
      <div className="card-content">
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
          {renderBadges(article.sentiment, article.esgCategory)}
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
