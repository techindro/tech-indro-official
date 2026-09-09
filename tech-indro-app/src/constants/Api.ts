/**
 * API Configuration for Tech Indro Backend
 * The existing Express.js server (server.js) on port 5000
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Dynamically resolves host machine IP for Expo Go physical devices & emulators
const getBaseUrl = (): string => {
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost;
    if (hostUri) {
      const host = hostUri.split(':')[0];
      return `http://${host}:5000`;
    }
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000';
    }
    return 'http://localhost:5000';
  }
  // Production — live Vercel deployment URL
  return 'https://tech-indro-official.vercel.app';
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  SEND_OTP: '/api/auth/send-otp',
  VERIFY_OTP: '/api/auth/verify-otp',
  COURSES: '/api/courses',
  COURSE_DETAIL: (id: string) => `/api/courses/${id}`,
  CHAT: '/api/chat',
  ANALYTICS: '/api/analytics',
  CONTACT: '/api/contact',
  RUN_CODE: '/api/compiler/run',
  PAYMENT_CONFIG: '/api/payments/config',
  PAYMENT_CREATE_INTENT: '/api/payments/create-intent',
  PAYMENT_CONFIRM: '/api/payments/confirm',
  PAYMENT_SYNC_STATUS: '/api/payments/sync-status',
};
