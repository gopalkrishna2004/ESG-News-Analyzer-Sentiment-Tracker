import React, { useState } from 'react';
import axios from 'axios';
import './UnifiedAnalyzer.css';

function UnifiedAnalyzer({ company, onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!company) {
      setError('No company selected');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Run both analyses in parallel
      const [sentimentResponse, esgResponse] = await Promise.all([
        axios.post(`/api/sentiment/analyze-company/${encodeURIComponent(company)}`),
        axios.post(`/api/esg/categorize-company/${encodeURIComponent(company)}`)
      ]);

      if (sentimentResponse.data.success && esgResponse.data.success) {
        setMessage(`✅ Analyzed ${sentimentResponse.data.analyzed} articles successfully!`);
        
        if (onAnalysisComplete) {
          onAnalysisComplete({
            sentiment: sentimentResponse.data,
            esg: esgResponse.data
          });
        }
      } else {
        const errors = [];
        if (!sentimentResponse.data.success) errors.push('Sentiment analysis failed');
        if (!esgResponse.data.success) errors.push('ESG categorization failed');
        setError(errors.join('. '));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unified-analyzer">
      <button
        onClick={handleAnalyze}
        disabled={loading || !company}
        className="analyze-button"
      >
        {loading ? '🔄 Analyzing...' : '🚀 Analyze'}
      </button>
      
      {message && <p className="analyzer-message success">{message}</p>}
      {error && <p className="analyzer-message error">⚠️ {error}</p>}
    </div>
  );
}

export default UnifiedAnalyzer;
