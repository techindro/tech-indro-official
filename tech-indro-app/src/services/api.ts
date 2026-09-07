/**
 * API Service Layer for Tech Indro
 * Wraps fetch calls to the Express.js backend
 */
import { API_BASE_URL, ENDPOINTS } from '@/constants/Api';
import { saveCoursesToCache, getCoursesFromCache } from './cache';

interface LoginResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  perks: string[];
  modules: { title: string; desc: string }[];
  resources: { title: string; url: string; type: string }[];
  image: string;
}

interface ApiError {
  error: string;
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as ApiError).error || 'Something went wrong');
    }

    return data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
}

// ====== AUTH ======

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>(ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

// ====== COURSES ======

export async function fetchCourses(): Promise<Course[]> {
  try {
    const data = await apiRequest<Course[]>(ENDPOINTS.COURSES);
    if (data && Array.isArray(data) && data.length > 0) {
      saveCoursesToCache(data);
    }
    return data;
  } catch (err) {
    const cached = await getCoursesFromCache();
    if (cached && cached.length > 0) {
      return cached;
    }
    throw err;
  }
}

export async function fetchCourseById(id: string): Promise<Course> {
  try {
    return await apiRequest<Course>(ENDPOINTS.COURSE_DETAIL(id));
  } catch (err) {
    const cached = await getCoursesFromCache();
    const found = cached.find((c) => c.id === id);
    if (found) return found;
    throw err;
  }
}

// ====== AI MENTOR CHAT ======

export interface ChatMessagePayload {
  message: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  systemInstruction?: string;
}

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  message: string,
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction?: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>(ENDPOINTS.CHAT, {
    method: 'POST',
    body: JSON.stringify({ message, history, systemInstruction }),
  });
}
