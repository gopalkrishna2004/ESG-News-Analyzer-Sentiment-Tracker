import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewsList from '../components/NewsList';
import UnifiedAnalyzer from '../components/UnifiedAnalyzer';
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
      // No state, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  const handleAnalysisComplete = async () => {
    // Refresh articles to show updated sentiment and ESG categories
    if (company) {
      setLoading(true);
      try {
        const response = await axios.get(`/api/news/company/${encodeURIComponent(company)}`);
        if (response.data.success) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        console.error('Failed to refresh articles:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  if (!company) {
    return <div className="news-page">Loading...</div>;
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <button onClick={handleBackToSearch} className="back-button">
          ← Back to Search
        </button>
        <h2>📰 ESG News for {company}</h2>
        <UnifiedAnalyzer company={company} onAnalysisComplete={handleAnalysisComplete} />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Refreshing articles...</p>
        </div>
      ) : (
        <NewsList articles={articles} company={company} />
      )}
    </div>
  );
}

export default NewsPage;
