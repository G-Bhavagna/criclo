import React, { useState, useEffect } from "react";
import { notificationAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'unread'
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data =
        filter === "unread"
          ? await notificationAPI.getUnread()
          : await notificationAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "JOIN_REQUEST":
        return "🙋";
      case "REQUEST_APPROVED":
        return "✅";
      case "REQUEST_REJECTED":
        return "❌";
      case "ACTIVITY_CANCELLED":
        return "🚫";
      case "ACTIVITY_CLOSED":
        return "🔒";
      case "NEW_MESSAGE":
        return "💬";
      case "MEMBER_JOINED":
        return "👥";
      default:
        return "📢";
    }
  };

  const NotificationCard = ({ notification }) => (
    <div
      className={`notification-card ${notification.read ? "read" : "unread"}`}
      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
    >
      <div className="notification-icon">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        <div className="notification-message">{notification.message}</div>
        <div className="notification-time">
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
      {!notification.read && <div className="unread-dot"></div>}
    </div>
  );

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-state">Loading notifications...</div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated with your activities</p>
      </div>

      <div className="notifications-controls">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>
              {filter === "unread"
                ? "You're all caught up!"
                : "You'll see notifications here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
