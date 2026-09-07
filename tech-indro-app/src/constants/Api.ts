/**
 * API Configuration for Tech Indro Backend
 * The existing Express.js server (server.js) on port 5000
 */
import { Platform } from 'react-native';

// For Android emulator use 10.0.2.2, for iOS simulator use localhost
// For physical device, use your computer's local IP or Vercel URL
const getBaseUrl = (): string => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000';
    }
    return 'http://localhost:5000';
  }
  // Production — replace with your Vercel deployment URL
  return 'https://tech-indro-website.vercel.app';
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  COURSES: '/api/courses',
  COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
  CHAT: '/api/chat',
  ANALYTICS: '/api/analytics',
  CONTACT: '/api/contact',
};
