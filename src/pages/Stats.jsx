import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Stats.css';

const Stats = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const data = await api.getLink(code);
      setLink(data);
      setError('');
    } catch (err) {
      setError('Link not found or failed to load stats.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${api.baseURL}/${code}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading stats...</div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="container">
        <div className="error-card">
          <h2>❌ Link Not Found</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container stats-page">
      <button className="btn btn-secondary back-btn" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <div className="stats-card">
        <h2>📊 Link Statistics</h2>
        
        <div className="stat-group">
          <label>Short Code</label>
          <div className="stat-value">
            <code className="short-code-large">{link.shortCode}</code>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={copyToClipboard}
              title="Copy short URL"
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="stat-group">
          <label>Short URL</label>
          <div className="stat-value">
            <a 
              href={`${api.baseURL}/${link.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="short-url"
            >
              {api.baseURL}/{link.shortCode}
            </a>
          </div>
        </div>

        <div className="stat-group">
          <label>Target URL</label>
          <div className="stat-value">
            <a 
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="target-url"
            >
              {link.targetUrl}
            </a>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">👆</div>
            <div className="stat-number">{link.clicks}</div>
            <div className="stat-label">Total Clicks</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">🕐</div>
            <div className="stat-number">
              {link.lastClicked ? formatDate(link.lastClicked) : 'Never'}
            </div>
            <div className="stat-label">Last Clicked</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{formatDate(link.createdAt)}</div>
            <div className="stat-label">Created At</div>
          </div>
        </div>

        <div className="qr-placeholder">
          <p>💡 Tip: Share this link to track clicks in real-time!</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;