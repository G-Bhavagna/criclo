import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { COLORS, ACTIVITY_TYPES } from "../config/constants";
import { userAPI, activityAPI } from "../services/api";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myActivities, setMyActivities] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    interests: user?.interests || [],
  });

  useEffect(() => {
    fetchMyActivities();
  }, []);

  const fetchMyActivities = async () => {
    try {
      const activities = await activityAPI.getMyActivities();
      setMyActivities(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await userAPI.updateProfile({
        name: formData.name,
        bio: formData.bio,
      });

      // Update interests separately if needed
      if (
        JSON.stringify(formData.interests) !== JSON.stringify(user?.interests)
      ) {
        await userAPI.updateInterests(formData.interests);
      }

      updateUser({
        ...user,
        ...formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info">
          <div className="profile-avatar-large">{user?.name?.[0]}</div>
          <div>
            {isEditing ? (
              <input
                type="text"
                className="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
            ) : (
              <h1>{user?.name}</h1>
            )}
            <p className="profile-email">{user?.email}</p>
          </div>
          <button
            className="btn-edit"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "💾 Save" : "✏️ Edit"}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About</h2>
          {isEditing ? (
            <textarea
              className="edit-bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell others about yourself..."
              rows={4}
            />
          ) : (
            <p>{user?.bio || "No bio added yet"}</p>
          )}
        </div>

        <div className="profile-section">
          <h2>Interests</h2>
          <div className="interests-grid">
            {ACTIVITY_TYPES.map((type) => {
              const isSelected = formData.interests.includes(type.label);
              return (
                <button
                  key={type.value}
                  className={`interest-chip ${isSelected ? "selected" : ""} ${
                    !isEditing ? "readonly" : ""
                  }`}
                  style={{
                    backgroundColor: isSelected ? type.color : "white",
                    borderColor: isSelected ? type.color : "#E8EAED",
                    color: isSelected ? "white" : "#2C3E50",
                    cursor: isEditing ? "pointer" : "default",
                  }}
                  onClick={() => isEditing && toggleInterest(type.label)}
                  disabled={!isEditing}
                >
                  {type.icon} {type.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="profile-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{myActivities.length}</div>
              <div className="stat-label">Activities Created</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formData.interests.length}</div>
              <div className="stat-label">Interests</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {myActivities.reduce((sum, a) => sum + a.currentMembers, 0)}
              </div>
              <div className="stat-label">Total Members</div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Settings</h2>
          <div className="settings-list">
            <button
              className="setting-item"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      try {
                        await userAPI.updateLocation(
                          position.coords.latitude,
                          position.coords.longitude
                        );
                        alert("Location updated successfully!");
                      } catch (error) {
                        console.error("Error updating location:", error);
                        alert("Failed to update location");
                      }
                    },
                    (error) => {
                      console.error("Error getting location:", error);
                      alert("Could not get your location");
                    }
                  );
                } else {
                  alert("Geolocation is not supported by your browser");
                }
              }}
            >
              <span>📍 Update My Location</span>
              <span>›</span>
            </button>
            <button className="setting-item">
              <span>🔔 Notifications</span>
              <span>›</span>
            </button>
            <button className="setting-item">
              <span>🔒 Privacy</span>
              <span>›</span>
            </button>
            <button className="setting-item danger" onClick={logout}>
              <span>🚪 Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
