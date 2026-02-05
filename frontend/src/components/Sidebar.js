import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ company }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navigateTo = (path, state = {}) => {
    navigate(path, { state });
    closeSidebar();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        <span className="hamburger-icon">
          {isOpen ? '✕' : '☰'}
        </span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">ESG Analyzer</h2>
          {company && <div className="sidebar-company">{company}</div>}
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => navigateTo('/')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </button>

          {company && (
            <>
              <button
                className={`sidebar-nav-item ${isActive('/news') ? 'active' : ''}`}
                onClick={() => navigateTo('/news', { company })}
              >
                <span className="nav-icon">📰</span>
                <span className="nav-text">News</span>
              </button>

              <button
                className={`sidebar-nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => navigateTo('/dashboard', { company })}
              >
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-info">
            <p className="info-label">ESG Categories</p>
            <div className="esg-badges">
              <span className="esg-badge environmental">E</span>
              <span className="esg-badge social">S</span>
              <span className="esg-badge governance">G</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
