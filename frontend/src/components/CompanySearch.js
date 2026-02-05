import React, { useState } from 'react';
import axios from 'axios';
import './CompanySearch.css';

// Sample companies for quick selection
const SAMPLE_COMPANIES = [
  'Tesla', 'Amazon', 'Microsoft', 'BP', 'Unilever',
  'Patagonia', 'Nike', 'Nestlé', 'Google', 'Walmart'
];

function CompanySearch({ onSearchSuccess }) {
  const [companyName, setCompanyName] = useState('');
  const [searchType, setSearchType] = useState('new'); // 'new' or 'stored'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      setError('Please enter a company name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      
      if (searchType === 'new') {
        // Fetch new articles from NewsAPI (10 articles)
        response = await axios.post('/api/news/search', {
          companyName: companyName.trim(),
          pageSize: 10
        });
      } else {
        // Fetch stored articles from database
        response = await axios.get(`/api/news/company/${encodeURIComponent(companyName.trim())}`);
      }

      if (response.data.success) {
        if (response.data.articles.length === 0) {
          setError(`No ${searchType === 'new' ? 'new' : 'stored'} ESG news found for ${companyName}`);
        } else {
          onSearchSuccess({
            articles: response.data.articles,
            company: companyName.trim()
          });
        }
      } else {
        setError(response.data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Search error:', error);
      
      if (error.response?.status === 429) {
        setError('News API rate limit reached. Try viewing stored articles instead.');
      } else {
        setError(error.response?.data?.message || 'Failed to search. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (company) => {
    setCompanyName(company);
  };

  return (
    <div className="company-search">
      <div className="search-card">
        <h2>Search Company ESG News</h2>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name (e.g., Tesla, Amazon)"
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="search-options">
            <button
              type="button"
              className={`option-btn ${searchType === 'new' ? 'active' : ''}`}
              onClick={() => setSearchType('new')}
              disabled={loading}
            >
              Fetch New Articles
            </button>
            <button
              type="button"
              className={`option-btn ${searchType === 'stored' ? 'active' : ''}`}
              onClick={() => setSearchType('stored')}
              disabled={loading}
            >
              View Stored Articles
            </button>
          </div>
        </form>

        {error && (
          <div className="search-error">
            {error}
          </div>
        )}

        <div className="quick-search">
          <p className="quick-search-label">Quick Search:</p>
          <div className="company-chips">
            {SAMPLE_COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() => handleQuickSearch(company)}
                className="company-chip"
                disabled={loading}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySearch;
