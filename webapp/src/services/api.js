import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  updateInterests: async (interests) => {
    const response = await api.put('/users/interests', { interests });
    return response.data;
  },
  
  updateLocation: async (latitude, longitude) => {
    const response = await api.put('/users/location', { latitude, longitude });
    return response.data;
  },
};

// Activity API
export const activityAPI = {
  create: async (data) => {
    const response = await api.post('/activities', data);
    return response.data;
  },
  
  getNearby: async (latitude, longitude, radiusKm = 5, type = null) => {
    const params = { latitude, longitude, radiusKm };
    if (type) params.type = type;
    const response = await api.get('/activities/nearby', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/activities/${id}`);
    return response.data;
  },
  
  getMyActivities: async () => {
    const response = await api.get('/activities/my');
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  },
  
  close: async (id) => {
    const response = await api.post(`/activities/${id}/close`);
    return response.data;
  },
  
  cancel: async (id) => {
    const response = await api.post(`/activities/${id}/cancel`);
    return response.data;
  },
};

// Join Request API
export const joinRequestAPI = {
  create: async (activityId, message) => {
    const response = await api.post('/join-requests', { activityId, message });
    return response.data;
  },
  
  getPendingForMyActivities: async () => {
    // Get user's activities first, then get requests for each
    const activities = await api.get('/activities/my');
    const allRequests = [];
    
    for (const activity of activities.data) {
      try {
        const requests = await api.get(`/join-requests/activity/${activity.id}`);
        allRequests.push(...requests.data);
      } catch (error) {
        console.error(`Error fetching requests for activity ${activity.id}:`, error);
      }
    }
    
    return allRequests;
  },
  
  getMyRequests: async () => {
    const response = await api.get('/join-requests/my');
    return response.data;
  },
  
  approve: async (id, reviewMessage = null) => {
    const response = await api.post(`/join-requests/${id}/accept`, { reviewMessage });
    return response.data;
  },
  
  reject: async (id, reviewMessage = null) => {
    const response = await api.post(`/join-requests/${id}/reject`, { reviewMessage });
    return response.data;
  },
  
  getActivityMembers: async (activityId) => {
    const response = await api.get(`/join-requests/activity/${activityId}/members`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  getActivityChatGroup: async (activityId) => {
    const response = await api.get(`/chat/groups/activity/${activityId}`);
    return response.data;
  },
  
  getChatMessages: async (groupId) => {
    const response = await api.get(`/chat/groups/${groupId}/messages`);
    return response.data;
  },
};

// Notification API
export const notificationAPI = {
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  getUnread: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};

export default api;
