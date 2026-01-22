import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notificationAPI } from "../services/api";
import { COLORS } from "../config/constants";
import "./Layout.css";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/activities", label: "Activities", icon: "🎯" },
    { path: "/join-requests", label: "Requests", icon: "📥" },
    { path: "/chat", label: "Chat", icon: "💬" },
    {
      path: "/notifications",
      label: "Notifications",
      icon: "🔔",
      badge: unreadCount,
    },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">📍</span>
            <span className="brand-name">Circlo</span>
          </Link>

          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? "active" : ""
                }`}
                style={{
                  color:
                    location.pathname === item.path
                      ? COLORS.primary
                      : "#7F8C8D",
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
