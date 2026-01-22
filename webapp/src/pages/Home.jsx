import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { activityAPI, notificationAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { COLORS, ACTIVITY_TYPES } from "../config/constants";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myActivities: 0,
    joinedActivities: 0,
    unreadNotifications: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [myActivities, notifications] = await Promise.all([
        activityAPI.getMyActivities(),
        notificationAPI.getUnreadCount(),
      ]);

      setStats({
        myActivities: myActivities.length,
        joinedActivities: myActivities.filter((a) => a.ownerId !== user?.id)
          .length,
        unreadNotifications: notifications.count || 0,
      });

      setRecentActivities(myActivities.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <main className="main-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
          <p>Here's what's happening in your community</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate("/activities")}>
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.myActivities}</div>
              <div className="stat-label">My Activities</div>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate("/activities")}>
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{stats.joinedActivities}</div>
              <div className="stat-label">Joined</div>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate("/notifications")}>
            <div className="stat-icon">🔔</div>
            <div className="stat-content">
              <div className="stat-value">{stats.unreadNotifications}</div>
              <div className="stat-label">Notifications</div>
            </div>
            {stats.unreadNotifications > 0 && (
              <div className="notification-badge"></div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-section">Loading your activities...</div>
        ) : recentActivities.length > 0 ? (
          <div className="recent-activities-section">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              {recentActivities.map((activity) => {
                const activityType = ACTIVITY_TYPES.find(
                  (t) => t.value === activity.type
                );
                return (
                  <div
                    key={activity.id}
                    className="activity-item"
                    onClick={() => navigate("/activities")}
                  >
                    <div
                      className="activity-icon"
                      style={{ background: activityType?.color }}
                    >
                      {activityType?.icon}
                    </div>
                    <div className="activity-details">
                      <h4>{activity.title}</h4>
                      <p>
                        {new Date(activity.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`activity-status status-${activity.status?.toLowerCase()}`}
                    >
                      {activity.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-dashboard">
            <div className="empty-icon">🌟</div>
            <h3>Get Started!</h3>
            <p>Create or join an activity to connect with your neighbors</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/activities")}
            >
              Discover Activities
            </button>
          </div>
        )}

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button
              className="action-card"
              onClick={() => navigate("/activities")}
            >
              <span className="action-icon">➕</span>
              <span>Create Activity</span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/join-requests")}
            >
              <span className="action-icon">📥</span>
              <span>Join Requests</span>
            </button>

            <button className="action-card" onClick={() => navigate("/chat")}>
              <span className="action-icon">💬</span>
              <span>Messages</span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/profile")}
            >
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
