import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import './NewsPage.css';

function NewsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.company) {
      const companyName = location.state.company;
      setCompany(companyName);
      
      // If articles are provided in state, use them
      if (location.state.articles && location.state.articles.length > 0) {
        setArticles(location.state.articles);
      } else {
        // Otherwise, fetch articles from the database
        fetchArticles(companyName);
      }
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const fetchArticles = async (companyName) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/news/company/${encodeURIComponent(companyName)}`);
      if (response.data.success) {
        setArticles(response.data.articles);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <Sidebar company={company} />

      {/* Main Content */}
      <div className="news-content">
        <div className="page-header">
          <h1 className="page-title">{company}</h1>
          <div className="page-actions">
            <button onClick={handleAnalyze} disabled={loading} className="action-btn analyze-btn">
              {loading ? '🔄 Analyzing...' : '🚀 Analyze'}
            </button>
          </div>
        </div>
        <p className="article-count">{articles.length} ESG News Articles</p>

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
