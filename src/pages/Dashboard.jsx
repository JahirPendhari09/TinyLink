import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ shortCode: '', targetUrl: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await api.getLinks();
      setLinks(data);
      setError('');
    } catch (err) {
      setError('Failed to load links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate inputs
    if (!formData.shortCode || !formData.targetUrl) {
      setFormError('Both fields are required');
      return;
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(formData.shortCode)) {
      setFormError('Short code must be 6-8 alphanumeric characters');
      return;
    }

    try {
      new URL(formData.targetUrl);
    } catch {
      setFormError('Please enter a valid URL');
      return;
    }

    try {
      setFormLoading(true);
      await api.createLink(formData);
      setFormData({ shortCode: '', targetUrl: '' });
      setShowForm(false);
      fetchLinks();
    } catch (err) {
      if (err.response?.status === 409) {
        setFormError('Short code already exists. Please choose another.');
      } else {
        setFormError(err.response?.data?.error || 'Failed to create link');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      await api.deleteLink(code);
      fetchLinks();
    } catch (err) {
      alert('Failed to delete link');
    }
  };

  const copyToClipboard = (code) => {
    const url = `${api.baseURL}/${code}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const filteredLinks = links
    .filter(link => 
      link.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'clicks') {
        aVal = a.clicks || 0;
        bVal = b.clicks || 0;
      } else if (sortBy === 'lastClicked') {
        aVal = a.lastClicked ? new Date(a.lastClicked).getTime() : 0;
        bVal = b.lastClicked ? new Date(b.lastClicked).getTime() : 0;
      } else if (sortBy === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const truncateUrl = (url, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Link'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Create New Short Link</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Short Code (6-8 characters)</label>
              <input
                type="text"
                value={formData.shortCode}
                onChange={(e) => setFormData({ ...formData, shortCode: e.target.value })}
                placeholder="e.g., docs123"
                maxLength="8"
                disabled={formLoading}
              />
            </div>
            <div className="form-group">
              <label>Target URL</label>
              <input
                type="url"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="https://example.com/very/long/url"
                disabled={formLoading}
              />
            </div>
            {formError && <div className="error-message">{formError}</div>}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? 'Creating...' : 'Create Link'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search by code or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Created Date</option>
            <option value="clicks">Clicks</option>
            <option value="lastClicked">Last Clicked</option>
          </select>
          <button 
            className="btn btn-secondary"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="empty-state">
          <p>No links found. Create your first short link!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="links-table">
            <thead>
              <tr>
                <th>Short Code</th>
                <th>Target URL</th>
                <th>Clicks</th>
                <th>Last Clicked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link._id}>
                  <td>
                    <code className="short-code">{link.shortCode}</code>
                  </td>
                  <td>
                    <a 
                      href={link.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={link.targetUrl}
                    >
                      {truncateUrl(link.targetUrl)}
                    </a>
                  </td>
                  <td>{link.clicks}</td>
                  <td>{formatDate(link.lastClicked)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => navigate(`/code/${link.shortCode}`)}
                        title="View Stats"
                      >
                        📊
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => copyToClipboard(link.shortCode)}
                        title="Copy Link"
                      >
                        📋
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(link.shortCode)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;