import { Client } from '@stomp/stompjs';
import { WS_BASE_URL } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
    this.messageCallbacks = new Map();
    this.isConnected = false;
  }

  async connect() {
    const token = await AsyncStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found');
      return Promise.reject('No auth token');
    }

    return new Promise((resolve, reject) => {
      // Use SockJS-compatible URL
      const wsUrl = WS_BASE_URL.replace('http', 'ws') + '/ws';
      
      this.stompClient = new Client({
        brokerURL: wsUrl,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          resolve(this.stompClient);
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame);
          this.isConnected = false;
          reject(frame);
        },
      });

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageCallbacks.clear();
      
      this.stompClient.deactivate();
      this.stompClient = null;
      this.isConnected = false;
    }
  }

  joinGroup(groupId) {
    if (!this.stompClient || !this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    // Subscribe to the group's chat topic
    const subscription = this.stompClient.subscribe(
      `/topic/chat/${groupId}`,
      (message) => {
        const msg = JSON.parse(message.body);
        const callback = this.messageCallbacks.get(groupId);
        if (callback) {
          callback(msg);
        }
      }
    );

    this.subscriptions.set(groupId, subscription);
    console.log(`Joined group ${groupId}`);
  }

  leaveGroup(groupId) {
    const subscription = this.subscriptions.get(groupId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(groupId);
      this.messageCallbacks.delete(groupId);
      console.log(`Left group ${groupId}`);
    }
  }

  sendMessage(groupId, content, messageType = 'TEXT') {
    if (!this.stompClient || !this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    const messagePayload = {
      content,
      type: messageType,
    };

    this.stompClient.publish({
      destination: `/app/chat/${groupId}`,
      body: JSON.stringify(messagePayload),
    });

    console.log('Message sent to group:', groupId);
  }

  onMessage(callback) {
    // Store callback for current group
    // This will be called when messages are received
    if (this.currentGroupId) {
      this.messageCallbacks.set(this.currentGroupId, callback);
    }
  }

  setCurrentGroup(groupId) {
    this.currentGroupId = groupId;
  }

  registerMessageCallback(groupId, callback) {
    this.messageCallbacks.set(groupId, callback);
  }

  removeListener(event, callback) {
    // Compatibility method - not needed for STOMP
  }

  removeAllListeners() {
    this.messageCallbacks.clear();
  }
}

export default new WebSocketService();
