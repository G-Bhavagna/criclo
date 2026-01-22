import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { chatAPI, activityAPI, joinRequestAPI } from "../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { COLORS } from "../config/constants";
import "./Chat.css";

const Chat = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const subscriptionsRef = useRef({});

  useEffect(() => {
    fetchChatGroups();
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.id);
      subscribeToGroup(selectedGroup.id);
    }
  }, [selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedGroup]);

  const connectWebSocket = () => {
    const token = localStorage.getItem("authToken");
    const socket = new SockJS("http://localhost:8082/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("WebSocket connected");
        // Resubscribe to selected group if any
        if (selectedGroup) {
          subscribeToGroup(selectedGroup.id);
        }
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const disconnectWebSocket = () => {
    Object.values(subscriptionsRef.current).forEach((sub) => sub.unsubscribe());
    subscriptionsRef.current = {};

    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  };

  const subscribeToGroup = (groupId) => {
    if (subscriptionsRef.current[groupId]) {
      return; // Already subscribed
    }

    if (stompClientRef.current?.connected) {
      const subscription = stompClientRef.current.subscribe(
        `/topic/chat/${groupId}`,
        (messageOutput) => {
          const msg = JSON.parse(messageOutput.body);
          const formattedMessage = {
            id: msg.id,
            senderId: msg.userId || msg.senderId,
            senderName: msg.userName || msg.senderName,
            text: msg.content,
            timestamp: new Date(msg.sentAt || msg.timestamp).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
              }
            ),
            isOwn: (msg.userId || msg.senderId) === user.id,
          };
          setMessages((prev) => ({
            ...prev,
            [groupId]: [...(prev[groupId] || []), formattedMessage],
          }));
        }
      );
      subscriptionsRef.current[groupId] = subscription;
    }
  };

  const fetchChatGroups = async () => {
    try {
      setLoading(true);

      // Get activities the user owns
      const myActivities = await activityAPI.getMyActivities();

      // Get join requests the user sent that were accepted
      const myRequests = await joinRequestAPI.getMyRequests();
      const acceptedRequests = myRequests.filter(
        (req) => req.status === "ACCEPTED"
      );

      // Get activities for accepted requests
      const joinedActivities = await Promise.all(
        acceptedRequests.map(async (req) => {
          try {
            return await activityAPI.getById(req.activityId);
          } catch (error) {
            console.error(`Error fetching activity ${req.activityId}:`, error);
            return null;
          }
        })
      );

      // Combine owned and joined activities
      const allActivities = [
        ...myActivities,
        ...joinedActivities.filter((a) => a !== null),
      ];

      const groupsData = await Promise.all(
        allActivities.map(async (activity) => {
          try {
            const chatGroup = await chatAPI.getActivityChatGroup(activity.id);
            return {
              id: chatGroup.id,
              name: activity.title,
              activity: activity.type,
              members: activity.currentMembers,
              activityId: activity.id,
              lastMessage: "Start chatting...",
              unread: 0,
            };
          } catch (error) {
            console.error(
              `Error fetching chat group for activity ${activity.id}:`,
              error
            );
            return null;
          }
        })
      );

      setGroups(groupsData.filter((g) => g !== null));
    } catch (error) {
      console.error("Error fetching chat groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (groupId) => {
    try {
      const messagesData = await chatAPI.getChatMessages(groupId);
      setMessages((prev) => ({
        ...prev,
        [groupId]: messagesData.map((msg) => ({
          id: msg.id,
          senderId: msg.userId || msg.senderId,
          senderName: msg.userName || msg.senderName,
          text: msg.content,
          timestamp: new Date(msg.sentAt || msg.timestamp).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
            }
          ),
          isOwn: (msg.userId || msg.senderId) === user.id,
        })),
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedGroup || !stompClientRef.current?.connected)
      return;

    const chatMessage = {
      content: message.trim(),
      type: "TEXT",
    };

    stompClientRef.current.publish({
      destination: `/app/chat/${selectedGroup.id}`,
      body: JSON.stringify(chatMessage),
    });

    setMessage("");
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-state">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <span className="badge">
            {groups.filter((g) => g.unread > 0).length}
          </span>
        </div>

        <div className="groups-list">
          {groups.length > 0 ? (
            groups.map((group) => (
              <div
                key={group.id}
                className={`group-item ${
                  selectedGroup?.id === group.id ? "active" : ""
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                <div className="group-avatar">{group.name[0]}</div>
                <div className="group-info">
                  <div className="group-header">
                    <h3>{group.name}</h3>
                    {group.unread > 0 && (
                      <span className="unread-badge">{group.unread}</span>
                    )}
                  </div>
                  <p className="group-activity">{group.activity}</p>
                  <p className="group-last-message">{group.lastMessage}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-groups">
              <p>No chat groups yet</p>
              <small>Join an activity to start chatting</small>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedGroup ? (
          <>
            <div className="chat-header">
              <div>
                <h2>{selectedGroup.name}</h2>
                <p>{selectedGroup.members} members</p>
              </div>
              <button
                className="btn-info"
                onClick={() =>
                  alert(`Activity ID: ${selectedGroup.activityId}`)
                }
              >
                ℹ️ Info
              </button>
            </div>

            <div className="messages-container">
              {messages[selectedGroup.id]?.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.isOwn ? "own" : "other"}`}
                >
                  {!msg.isOwn && (
                    <div className="message-sender">{msg.senderName}</div>
                  )}
                  <div
                    className="message-bubble"
                    style={{
                      backgroundColor: msg.isOwn ? COLORS.primary : "white",
                      color: msg.isOwn ? "white" : COLORS.text,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div className="message-time">{msg.timestamp}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="message-input-container"
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="message-input"
              />
              <button
                type="submit"
                className="send-button"
                disabled={!message.trim() || !stompClientRef.current?.connected}
                style={{ backgroundColor: COLORS.primary }}
              >
                📤
              </button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            <div className="empty-icon">💬</div>
            <h3>Select a chat to start messaging</h3>
            <p>Choose a group from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
