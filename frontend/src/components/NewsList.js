import React from 'react';
import NewsCard from './NewsCard';
import './NewsList.css';

function NewsList({ articles, company }) {
  return (
    <div className="news-list">
      <div className="news-header">
        <h2>📰 ESG News for {company}</h2>
        <p className="article-count">{articles.length} articles found</p>
      </div>

      <div className="news-grid">
        {articles.map((article, index) => (
          <NewsCard key={article._id || article.url || index} article={article} />
        ))}
      </div>
    </div>
  );
}

export default NewsList;
