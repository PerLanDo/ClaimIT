import axios from 'axios';

// Configure base URL - update this for production
const BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token will be added by AuthContext
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      
      // You might want to redirect to login screen here
      // This would require navigation context
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  verify: '/auth/verify',
  
  // Items
  items: '/items',
  itemDetail: (id: string) => `/items/${id}`,
  categories: '/items/categories/list',
  
  // Claims
  claims: '/claims',
  claimDetail: (id: string) => `/claims/${id}`,
  claimStatus: (id: string) => `/claims/${id}/status`,
  claimStatistics: '/claims/admin/statistics',
  
  // Messages
  conversations: '/messages/conversations',
  conversation: (id: string) => `/messages/conversation/${id}`,
  messages: '/messages',
  markConversationRead: (id: string) => `/messages/conversation/${id}/read`,
  unreadCount: '/messages/unread-count',
  
  // Profile
  profile: '/profile',
  profileStatistics: '/profile/statistics',
  profileItems: '/profile/items',
  profileClaims: '/profile/claims',
  profileNotifications: '/profile/notifications',
  markNotificationRead: (id: string) => `/profile/notifications/${id}/read`,
  markAllNotificationsRead: '/profile/notifications/read-all',
  unreadNotificationCount: '/profile/notifications/unread-count',
  
  // Admin
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminItems: '/admin/items',
  adminNotifications: '/admin/notifications',
  updateUserRole: (id: string) => `/admin/users/${id}/role`,
  updateItemStatus: (id: string) => `/admin/items/${id}/status`,
  deleteItem: (id: string) => `/admin/items/${id}`,
};
