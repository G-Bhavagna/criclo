import React, { useState, useEffect } from "react";
import { COLORS, ACTIVITY_TYPES } from "../config/constants";
import { activityAPI, joinRequestAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ActivityDetailModal from "../components/ActivityDetailModal";
import "./Activities.css";

const ActivityCard = ({ activity, onPress, onJoin }) => {
  const activityType = ACTIVITY_TYPES.find((t) => t.value === activity.type);
  const { user } = useAuth();
  const isOwner = user?.id === activity.ownerId;

  return (
    <div className="activity-card" onClick={() => onPress(activity)}>
      <div className="activity-card-header">
        <div className="activity-owner">
          <div className="avatar">{activity.ownerName?.[0] || "U"}</div>
          <div>
            <div className="owner-name">{activity.ownerName}</div>
            <div className="activity-time">
              {new Date(activity.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div
          className="activity-badge"
          style={{ backgroundColor: activityType?.color }}
        >
          {activityType?.icon} {activityType?.label}
        </div>
      </div>

      <div className="activity-body">
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <div className="activity-date">
          📅 {new Date(activity.scheduledDate).toLocaleString()}
        </div>
      </div>

      <div className="activity-footer">
        <span>
          👥 {activity.currentMembers}/{activity.maxMembers}
        </span>
        <span>📍 {activity.distance?.toFixed(1) || "0.0"}km away</span>
        {!isOwner && activity.status === "OPEN" && (
          <button
            className="btn-join"
            onClick={(e) => {
              e.stopPropagation();
              onJoin(activity);
            }}
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
};

const CreateActivityModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    date: "",
    time: "",
    maxMembers: 5,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Activity</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-activity-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="What do you want to do?"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              maxLength={60}
            />
          </div>

          <div className="form-group">
            <label>Activity Type</label>
            <div className="activity-type-grid">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`type-chip ${
                    formData.type === type.value ? "selected" : ""
                  }`}
                  style={{
                    borderColor:
                      formData.type === type.value ? type.color : "#E8EAED",
                    backgroundColor:
                      formData.type === type.value
                        ? type.color + "20"
                        : "white",
                  }}
                  onClick={() => setFormData({ ...formData, type: type.value })}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Add details about the activity..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              maxLength={200}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Max Members ({formData.maxMembers})</label>
            <input
              type="range"
              min="2"
              max="20"
              value={formData.maxMembers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxMembers: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Activities = () => {
  const [filter, setFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const { user } = useAuth();

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation.latitude && userLocation.longitude) {
      fetchNearbyActivities();
    }
  }, [filter, userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(newLocation);

          // Update location in backend
          try {
            await userAPI.updateLocation(
              newLocation.latitude,
              newLocation.longitude
            );
            console.log("Location updated in backend");
          } catch (error) {
            console.error("Error updating location:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          // Use default San Francisco coordinates
          setUserLocation({
            latitude: 37.7749,
            longitude: -122.4194,
          });
        }
      );
    }
  };

  const fetchNearbyActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityAPI.getNearby(
        userLocation.latitude,
        userLocation.longitude,
        5,
        filter === "all" ? null : filter
      );
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async (newActivity) => {
    try {
      const scheduledDate = `${newActivity.date}T${newActivity.time}:00`;

      const activityData = {
        title: newActivity.title,
        description: newActivity.description,
        type: newActivity.type,
        maxMembers: newActivity.maxMembers,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        scheduledDate: scheduledDate,
      };

      const created = await activityAPI.create(activityData);
      setActivities([created, ...activities]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error("Error creating activity:", err);
      alert("Failed to create activity. Please try again.");
    }
  };

  const handleJoinActivity = async (activity) => {
    try {
      await joinRequestAPI.create(
        activity.id,
        "I'd like to join this activity!"
      );
      alert("Join request sent successfully!");
      // Optionally refresh activities
      fetchNearbyActivities();
    } catch (err) {
      console.error("Error joining activity:", err);
      alert(
        err.response?.data?.message ||
          "Failed to join activity. Please try again."
      );
    }
  };

  const filteredActivities = activities;

  if (loading) {
    return (
      <div className="activities-page">
        <div className="loading-state">Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activities-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchNearbyActivities} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="activities-page">
      <div className="page-header">
        <h1>Discover Activities</h1>
        <p>Find things to do with your neighbors</p>
        <button
          className="btn-refresh"
          onClick={() => {
            getUserLocation();
            fetchNearbyActivities();
          }}
          style={{ marginTop: "10px" }}
        >
          🔄 Refresh Location
        </button>
      </div>

      <div className="filters-section">
        <div className="filters-scroll">
          <button
            className={`filter-chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {ACTIVITY_TYPES.map((type) => (
            <button
              key={type.value}
              className={`filter-chip ${filter === type.value ? "active" : ""}`}
              style={{
                backgroundColor: filter === type.value ? type.color : "white",
                borderColor: filter === type.value ? type.color : "#E8EAED",
                color: filter === type.value ? "white" : COLORS.text,
              }}
              onClick={() => setFilter(type.value)}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="activities-grid">
        {filteredActivities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={(activity) => {
              setSelectedActivity(activity);
              setIsDetailModalOpen(true);
            }}
            onJoin={handleJoinActivity}
          />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No activities found</h3>
          <p>Be the first to create one!</p>
        </div>
      )}

      <button
        className="fab"
        onClick={() => setIsCreateModalOpen(true)}
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #8B5FE3 100%)`,
        }}
      >
        +
      </button>

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateActivity}
      />

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdate={fetchNearbyActivities}
      />
    </div>
  );
};

export default Activities;
