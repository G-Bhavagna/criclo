import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  signup: (userData) => 
    api.post('/auth/signup', userData),
  
  refreshToken: (refreshToken) => 
    api.post('/auth/refresh', { refreshToken }),
};

// User APIs
export const userAPI = {
  getProfile: (userId) => 
    api.get(`/users/${userId}`),
  
  updateProfile: (userId, data) => 
    api.put(`/users/${userId}`, data),
  
  uploadProfileImage: (userId, formData) => 
    api.post(`/users/${userId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateLocation: (latitude, longitude) => 
    api.put('/users/location', { latitude, longitude }),
};

// Activity APIs
export const activityAPI = {
  getNearbyActivities: (latitude, longitude, radius = 2) => 
    api.get('/activities/nearby', {
      params: { latitude, longitude, radius },
    }),
  
  getActivityById: (activityId) => 
    api.get(`/activities/${activityId}`),
  
  createActivity: (activityData) => 
    api.post('/activities', activityData),
  
  updateActivity: (activityId, data) => 
    api.put(`/activities/${activityId}`, data),
  
  deleteActivity: (activityId) => 
    api.delete(`/activities/${activityId}`),
  
  getUserActivities: (userId) => 
    api.get(`/activities/user/${userId}`),
  
  getJoinedActivities: (userId) => 
    api.get(`/activities/joined/${userId}`),
};

// Join Request APIs
export const joinRequestAPI = {
  sendJoinRequest: (activityId) => 
    api.post(`/join-requests`, { activityId }),
  
  getPendingRequests: (activityId) => 
    api.get(`/join-requests/activity/${activityId}/pending`),
  
  acceptRequest: (requestId) => 
    api.put(`/join-requests/${requestId}/accept`),
  
  rejectRequest: (requestId) => 
    api.put(`/join-requests/${requestId}/reject`),
  
  getUserJoinRequests: (userId) => 
    api.get(`/join-requests/user/${userId}`),
};

// Group APIs
export const groupAPI = {
  getGroupByActivity: (activityId) => 
    api.get(`/groups/activity/${activityId}`),
  
  getGroupMembers: (groupId) => 
    api.get(`/groups/${groupId}/members`),
  
  leaveGroup: (groupId) => 
    api.delete(`/groups/${groupId}/leave`),
};

// Message APIs
export const messageAPI = {
  getGroupMessages: (groupId, page = 0, size = 50) => 
    api.get(`/messages/group/${groupId}`, {
      params: { page, size },
    }),
  
  sendMessage: (groupId, message, messageType = 'TEXT') => 
    api.post('/messages', { groupId, message, messageType }),
};

export default api;
