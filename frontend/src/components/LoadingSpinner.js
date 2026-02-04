import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Fetching ESG news articles...</p>
    </div>
  );
}

export default LoadingSpinner;
