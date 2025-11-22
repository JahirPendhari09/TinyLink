import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/Health.css';

const Health = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); 
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const data = await api.getHealth();
      setHealth(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch health status');
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
  };

  if (loading && !health) {
    return (
      <div className="container">
        <div className="loading">Checking health status...</div>
      </div>
    );
  }

  return (
    <div className="container health-page">
      <h2>🏥 System Health</h2>

      {error && <div className="error-message">{error}</div>}

      {health && (
        <div className="health-card">
          <div className="status-indicator">
            <div className={`status-dot ${health.ok ? 'status-ok' : 'status-error'}`}></div>
            <span className="status-text">
              {health.ok ? 'System Operational' : 'System Error'}
            </span>
          </div>

          <div className="health-details">
            <div className="health-item">
              <span className="health-label">Status:</span>
              <span className={`health-value ${health.ok ? 'text-success' : 'text-error'}`}>
                {health.ok ? '✅ Healthy' : '❌ Unhealthy'}
              </span>
            </div>

            <div className="health-item">
              <span className="health-label">Version:</span>
              <span className="health-value">{health.version || 'N/A'}</span>
            </div>

            {health.uptime !== undefined && (
              <div className="health-item">
                <span className="health-label">Uptime:</span>
                <span className="health-value">{formatUptime(health.uptime)}</span>
              </div>
            )}

            {health.timestamp && (
              <div className="health-item">
                <span className="health-label">Last Checked:</span>
                <span className="health-value">
                  {new Date(health.timestamp).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary refresh-btn"
            onClick={fetchHealth}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      )}

      <div className="info-card">
        <h3>📋 API Endpoints</h3>
        <ul className="endpoint-list">
          <li><code>GET /healthz</code> - Health check</li>
          <li><code>POST /api/links</code> - Create link</li>
          <li><code>GET /api/links</code> - List all links</li>
          <li><code>GET /api/links/:code</code> - Get link stats</li>
          <li><code>DELETE /api/links/:code</code> - Delete link</li>
          <li><code>GET /:code</code> - Redirect to target URL</li>
        </ul>
      </div>
    </div>
  );
};

export default Health;