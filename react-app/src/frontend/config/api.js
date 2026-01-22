// API Configuration - centralized URL management
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://campushub-hwty.onrender.com');

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/Login`,
  SIGN_UP: `${API_BASE_URL}/sign`,
  GOOGLE_LOGIN: `${API_BASE_URL}/auth/google-login`,
  APPLE_LOGIN: `${API_BASE_URL}/auth/apple-login`,
  GOOGLE_SIGNUP: `${API_BASE_URL}/auth/google-signup`,
  APPLE_SIGNUP: `${API_BASE_URL}/auth/apple-signup`,
  
  // Upload & Resources
  UPLOAD: `${API_BASE_URL}/upload`,
  MY_RESOURCES: (userId) => `${API_BASE_URL}/myresources?userId=${userId}`,
  RESOURCE_DELETE: (fileId, userId) => `${API_BASE_URL}/resource/${fileId}?userId=${userId}`,
  
  // Summary
  SUMMARY: (userId) => `${API_BASE_URL}/summary?userId=${userId}`,
  SAVE_SUMMARY: `${API_BASE_URL}/save-summary`,
  SAVED_SUMMARIES: (userId) => `${API_BASE_URL}/saved-summaries?userId=${userId}`,
  DELETE_SUMMARY: (summaryId, userId) => `${API_BASE_URL}/summary/${summaryId}?userId=${userId}`,
  
  // Notifications
  CREATE_NOTIFICATION: `${API_BASE_URL}/create-notification`,
  GET_NOTIFICATIONS: (userId) => `${API_BASE_URL}/notifications?userId=${userId}`,
  DELETE_NOTIFICATION: (notificationId, userId) => `${API_BASE_URL}/notification/${notificationId}?userId=${userId}`,
};

export default API_BASE_URL;
