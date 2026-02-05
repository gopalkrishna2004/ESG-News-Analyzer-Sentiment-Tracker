import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './DashboardPage.css';

const COLORS = {
  Environmental: '#10b981',
  Social: '#3b82f6',
  Governance: '#8b5cf6',
  Positive: '#10b981',
  Negative: '#ef4444',
  Neutral: '#6b7280'
};

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [sentimentTrends, setSentimentTrends] = useState([]);
  const [esgDistribution, setEsgDistribution] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    if (location.state?.company) {
      setCompany(location.state.company);
      fetchDashboardData(location.state.company);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const fetchDashboardData = async (companyName) => {
    setLoading(true);
    try {
      const [overviewRes, trendsRes, distributionRes, timelineRes] = await Promise.all([
        axios.get(`/api/analytics/overview/${encodeURIComponent(companyName)}`),
        axios.get(`/api/analytics/sentiment-trends/${encodeURIComponent(companyName)}`),
        axios.get(`/api/analytics/esg-distribution/${encodeURIComponent(companyName)}`),
        axios.get(`/api/analytics/timeline/${encodeURIComponent(companyName)}?limit=20`)
      ]);

      if (overviewRes.data.success) setOverview(overviewRes.data.stats);
      if (trendsRes.data.success) setSentimentTrends(trendsRes.data.trends);
      if (distributionRes.data.success) setEsgDistribution(distributionRes.data.distribution);
      if (timelineRes.data.success) setTimeline(timelineRes.data.timeline);
      
      // Fetch AI Summary separately to avoid blocking other data
      fetchAISummary(companyName);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAISummary = async (companyName) => {
    setSummaryLoading(true);
    try {
      const response = await axios.get(`/api/summary/${encodeURIComponent(companyName)}`);
      if (response.data.success) {
        setAiSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch AI summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'Positive') return '✅';
    if (sentiment === 'Negative') return '❌';
    return '➖';
  };

  const getESGIcon = (category) => {
    if (category === 'Environmental') return '🌍';
    if (category === 'Social') return '👥';
    if (category === 'Governance') return '⚖️';
    return '📰';
  };

  if (!company) {
    return <div className="dashboard-page">Loading...</div>;
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Top Navigation */}
      <nav className="top-nav">
        <button onClick={() => navigate('/')} className="nav-btn back-btn">
          ← Home
        </button>
        <h1 className="company-title">{company} Dashboard</h1>
      </nav>

      <div className="dashboard-content">
        {/* Overview Cards */}
        {overview && (
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{overview.totalArticles}</div>
              <div className="stat-label">Total Articles</div>
            </div>

            <div className="stat-box positive">
              <div className="stat-number">{overview.sentimentBreakdown?.Positive || 0}</div>
              <div className="stat-label">Positive</div>
            </div>

            <div className="stat-box negative">
              <div className="stat-number">{overview.sentimentBreakdown?.Negative || 0}</div>
              <div className="stat-label">Negative</div>
            </div>

            <div className="stat-box neutral">
              <div className="stat-number">{overview.sentimentBreakdown?.Neutral || 0}</div>
              <div className="stat-label">Neutral</div>
            </div>
          </div>
        )}

        {/* AI Summary Section */}
        {summaryLoading ? (
          <div className="summary-section">
            <div className="summary-header">
              <h3>AI-Generated ESG Summary</h3>
            </div>
            <div className="summary-loading">
              <div className="loading-spinner"></div>
              <p>Generating AI summary...</p>
            </div>
          </div>
        ) : aiSummary?.summary ? (
          <div className="summary-section">
            <div className="summary-header">
              <h3>AI-Generated ESG Summary</h3>
              <span className="summary-timestamp">
                Generated {new Date(aiSummary.generatedAt).toLocaleTimeString()}
              </span>
            </div>

            {/* Overall Summary */}
            <div className="summary-overview">
              <p>{aiSummary.summary.overallSummary}</p>
            </div>

            {/* Key Concerns and Highlights */}
            <div className="summary-grid">
              {/* Concerns */}
              {aiSummary.summary.keyConcerns && aiSummary.summary.keyConcerns.length > 0 && (
                <div className="summary-box concerns">
                  <h4>Key Concerns</h4>
                  <ul>
                    {aiSummary.summary.keyConcerns.map((concern, index) => (
                      <li key={index}>{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Positive Highlights */}
              {aiSummary.summary.positiveHighlights && aiSummary.summary.positiveHighlights.length > 0 && (
                <div className="summary-box highlights">
                  <h4>Positive Highlights</h4>
                  <ul>
                    {aiSummary.summary.positiveHighlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trending Topics */}
            {aiSummary.summary.trendingTopics && aiSummary.summary.trendingTopics.length > 0 && (
              <div className="trending-topics">
                <h4>Trending ESG Topics</h4>
                <div className="topics-grid">
                  {aiSummary.summary.trendingTopics.map((topic, index) => (
                    <div key={index} className={`topic-card ${topic.category.toLowerCase()}`}>
                      <div className="topic-header">
                        <span className="topic-name">{topic.topic}</span>
                        <span className={`topic-importance ${topic.importance.toLowerCase()}`}>
                          {topic.importance}
                        </span>
                      </div>
                      <div className="topic-meta">
                        <span className="topic-category">{topic.category}</span>
                        <span className={`topic-sentiment ${topic.sentiment.toLowerCase()}`}>
                          {topic.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {aiSummary.summary.recommendations && (
              <div className="summary-recommendations">
                <h4>Recommendations</h4>
                <p>{aiSummary.summary.recommendations}</p>
              </div>
            )}
          </div>
        ) : null}

        {/* Charts Section */}
        <div className="charts-section">
          {/* Sentiment Trends */}
          <div className="chart-box wide">
            <h3>Sentiment Trends Over Time</h3>
            {sentimentTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={sentimentTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#9ca3af"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '0.85rem' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Positive" 
                    stroke={COLORS.Positive} 
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Negative" 
                    stroke={COLORS.Negative} 
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Neutral" 
                    stroke={COLORS.Neutral} 
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No data yet. Analyze articles to see trends.</p>
              </div>
            )}
          </div>

          {/* ESG Distribution */}
          <div className="chart-box">
            <h3>ESG Distribution</h3>
            {esgDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={esgDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.charAt(0)} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {esgDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No ESG data yet. Categorize articles first.</p>
              </div>
            )}
          </div>

          {/* ESG Bar Chart */}
          <div className="chart-box">
            <h3>Category Comparison</h3>
            {esgDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={esgDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '0.85rem' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '0.85rem' }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {esgDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>No ESG data yet. Categorize articles first.</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-section">
          <h3>Timeline</h3>
          {timeline.length > 0 ? (
            <div className="timeline-list">
              {timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-line-marker"></div>
                  <div className="timeline-card">
                    <div className="timeline-header">
                      <span className="timeline-date">{formatFullDate(event.date)}</span>
                      <span className="timeline-source">{event.source}</span>
                    </div>
                    <h4 className="timeline-title">{event.title}</h4>
                    <div className="timeline-badges">
                      {event.sentiment && (
                        <span className={`badge sentiment-${event.sentiment.toLowerCase()}`}>
                          {event.sentiment}
                        </span>
                      )}
                      {event.esgCategory && event.esgCategory.map((cat, i) => (
                        <span key={i} className={`badge esg-${cat.toLowerCase()}`}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No timeline data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
