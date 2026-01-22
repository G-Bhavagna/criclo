import React, { useState, useEffect } from "react";
import { activityAPI, joinRequestAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ACTIVITY_TYPES } from "../config/constants";
import "./ActivityDetail.css";

const ActivityDetailModal = ({ activity, isOpen, onClose, onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isOwner = user?.id === activity?.ownerId;

  useEffect(() => {
    if (isOpen && activity) {
      fetchMembers();
    }
  }, [isOpen, activity]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await joinRequestAPI.getActivityMembers(activity.id);
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseActivity = async () => {
    if (
      !window.confirm(
        "Are you sure you want to close this activity? No new members can join."
      )
    ) {
      return;
    }

    try {
      await activityAPI.close(activity.id);
      alert("Activity closed successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error closing activity:", error);
      alert("Failed to close activity. Please try again.");
    }
  };

  const handleCancelActivity = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this activity? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await activityAPI.cancel(activity.id);
      alert("Activity cancelled successfully!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error cancelling activity:", error);
      alert("Failed to cancel activity. Please try again.");
    }
  };

  if (!isOpen || !activity) return null;

  const activityType = ACTIVITY_TYPES.find((t) => t.value === activity.type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content activity-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="modal-close">
          ×
        </button>

        <div className="activity-detail-header">
          <div
            className="activity-type-badge-large"
            style={{ backgroundColor: activityType?.color }}
          >
            {activityType?.icon} {activityType?.label}
          </div>
          <h2>{activity.title}</h2>
          <p className="activity-description">{activity.description}</p>
        </div>

        <div className="activity-detail-info">
          <div className="info-row">
            <span className="info-label">📅 Date & Time</span>
            <span className="info-value">
              {new Date(activity.scheduledDate).toLocaleString()}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">👥 Members</span>
            <span className="info-value">
              {activity.currentMembers}/{activity.maxMembers}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">📍 Distance</span>
            <span className="info-value">
              {activity.distance?.toFixed(1) || "0.0"} km away
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">📌 Status</span>
            <span
              className={`status-badge status-${activity.status?.toLowerCase()}`}
            >
              {activity.status}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">👤 Organized by</span>
            <span className="info-value">{activity.ownerName}</span>
          </div>
        </div>

        <div className="activity-members-section">
          <h3>Members ({members.length})</h3>
          {loading ? (
            <p className="loading-text">Loading members...</p>
          ) : members.length > 0 ? (
            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">{member.name?.[0] || "U"}</div>
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-role">
                      {member.id === activity.ownerId ? "Organizer" : "Member"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-members">No members yet</p>
          )}
        </div>

        {isOwner && activity.status === "OPEN" && (
          <div className="activity-owner-actions">
            <button
              className="btn-close-activity"
              onClick={handleCloseActivity}
            >
              🔒 Close Activity
            </button>
            <button
              className="btn-cancel-activity"
              onClick={handleCancelActivity}
            >
              🚫 Cancel Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailModal;
