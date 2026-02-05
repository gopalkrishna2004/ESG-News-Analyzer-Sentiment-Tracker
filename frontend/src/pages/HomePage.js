import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanySearch from '../components/CompanySearch';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleSearchSuccess = (data) => {
    navigate('/news', { state: { company: data.company, articles: data.articles } });
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>📊 ESG News Analyzer</h1>
        <p className="subtitle">Track Environmental, Social & Governance News</p>
      </div>

      <CompanySearch onSearchSuccess={handleSearchSuccess} />
    </div>
  );
}

export default HomePage;
