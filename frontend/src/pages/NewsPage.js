import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import './NewsPage.css';

function NewsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setCompany(location.state.company);
      setArticles(location.state.articles || []);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleAnalyze = async () => {
    if (!company) return;

    setLoading(true);
    try {
      await Promise.all([
        axios.post(`/api/sentiment/analyze-company/${encodeURIComponent(company)}`),
        axios.post(`/api/esg/categorize-company/${encodeURIComponent(company)}`)
      ]);
      
      // Refresh articles
      const response = await axios.get(`/api/news/company/${encodeURIComponent(company)}`);
      if (response.data.success) {
        setArticles(response.data.articles);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!company) {
    return <div className="news-page">Loading...</div>;
  }

  return (
    <div className="news-page">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <button onClick={() => navigate('/')} className="nav-btn back-btn">
          ← Home
        </button>
        <h1 className="company-title">{company}</h1>
        <div className="nav-actions">
          <button onClick={handleAnalyze} disabled={loading} className="nav-btn analyze-btn">
            {loading ? '🔄 Analyzing...' : '🚀 Analyze'}
          </button>
          <button onClick={() => navigate('/dashboard', { state: { company } })} className="nav-btn dashboard-btn">
            📊 Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="news-content">
        <div className="content-header">
          <p className="article-count">{articles.length} ESG News Articles</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Refreshing articles...</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article, index) => (
              <NewsCard key={article._id || article.url || index} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsPage;
