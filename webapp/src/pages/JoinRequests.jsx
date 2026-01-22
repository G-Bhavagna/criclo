import React, { useState, useEffect } from "react";
import { joinRequestAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./JoinRequests.css";

const JoinRequests = () => {
  const [activeTab, setActiveTab] = useState("received"); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchRequests, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log("Fetching join requests...");
      const [received, sent] = await Promise.all([
        joinRequestAPI.getPendingForMyActivities(),
        joinRequestAPI.getMyRequests(),
      ]);
      console.log("Received requests:", received);
      console.log("Sent requests:", sent);
      setReceivedRequests(received || []);
      setSentRequests(sent || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      console.error("Error details:", error.response?.data);
      setReceivedRequests([]);
      setSentRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await joinRequestAPI.approve(requestId);
      // Refresh the lists to get updated data
      await fetchRequests();
      alert(
        "Request approved successfully! The user can now chat with the group."
      );
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request. Please try again.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await joinRequestAPI.reject(requestId);
      // Refresh the lists to get updated data
      await fetchRequests();
      alert("Request rejected.");
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const RequestCard = ({ request, type }) => (
    <div className="request-card">
      <div className="request-header">
        <div className="request-user">
          <div className="avatar-small">{request.userName?.[0] || "U"}</div>
          <div>
            <div className="request-user-name">{request.userName}</div>
            <div className="request-time">
              {new Date(request.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className={`status-badge status-${request.status?.toLowerCase()}`}>
          {request.status}
        </div>
      </div>

      <div className="request-activity">
        <h4>{request.activityTitle}</h4>
        {request.message && (
          <p className="request-message">"{request.message}"</p>
        )}
      </div>

      {type === "received" && request.status === "PENDING" && (
        <div className="request-actions">
          <button
            className="btn-reject"
            onClick={() => handleReject(request.id)}
          >
            Reject
          </button>
          <button
            className="btn-approve"
            onClick={() => handleApprove(request.id)}
          >
            Approve
          </button>
        </div>
      )}

      {type === "sent" && (
        <div className="request-info">
          <small>
            {request.status === "PENDING" && "⏳ Waiting for approval"}
            {request.status === "APPROVED" && "✅ Approved"}
            {request.status === "REJECTED" && "❌ Rejected"}
          </small>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="join-requests-page">
        <div className="loading-state">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="join-requests-page">
      <div className="page-header">
        <h1>Join Requests</h1>
        <p>Manage activity membership requests</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received ({receivedRequests.length})
        </button>
        <button
          className={`tab ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      <div className="requests-list">
        {activeTab === "received" ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map((request) => (
              <RequestCard key={request.id} request={request} type="received" />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📬</div>
              <h3>No pending requests</h3>
              <p>You'll see join requests for your activities here</p>
            </div>
          )
        ) : sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <RequestCard key={request.id} request={request} type="sent" />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📤</div>
            <h3>No sent requests</h3>
            <p>Join an activity to send a request</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRequests;
