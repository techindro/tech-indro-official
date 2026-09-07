/**
 * Offline Cache Manager — Tech Indro
 * Automatically caches courses, syllabus, and quiz data into AsyncStorage
 * for seamless zero-internet access.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '@/services/api';

const COURSES_CACHE_KEY = '@cached_courses_catalog';
const LAST_SYNC_KEY = '@last_cache_sync';

// Bundled offline courses fallback
const fallbackCourses: Course[] = require('../../assets/data/courses.json');

export async function saveCoursesToCache(courses: Course[]): Promise<void> {
  try {
    await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(courses));
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch {
    // ignore
  }
}

export async function getCoursesFromCache(): Promise<Course[]> {
  try {
    const data = await AsyncStorage.getItem(COURSES_CACHE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as Course[];
      if (parsed && Array.isArray(parsed) && parsed.length >= fallbackCourses.length) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return fallbackCourses;
}

export async function getLastSyncTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
}
