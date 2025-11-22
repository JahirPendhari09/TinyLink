import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Health from './pages/Health';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <h1 className="logo">🔗 TinyLink</h1>
            <nav className="nav">
              <a href="/">Dashboard</a>
              <a href="/healthz">Health</a>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/code/:code" element={<Stats />} />
            <Route path="/healthz" element={<Health />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 TinyLink - URL Shortener</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;