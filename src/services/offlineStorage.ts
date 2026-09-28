import { Lesson, Quiz, StudentProgress, Worksheet } from '../types';
import {
  DEMO_WATER_CYCLE_LESSON,
  DEMO_PLANTS_LESSON,
  DEMO_QUIZ_WATER_CYCLE,
  DEMO_STUDENT_PROGRESS,
  DEMO_WORKSHEET,
} from '../data/demoData';

const STORAGE_KEYS = {
  OFFLINE_SIMULATION: 'vernacraft_offline_sim',
  CACHED_LESSONS: 'vernacraft_cached_lessons',
  CACHED_QUIZZES: 'vernacraft_cached_quizzes',
  CACHED_PROGRESS: 'vernacraft_cached_progress',
  CACHED_WORKSHEETS: 'vernacraft_cached_worksheets',
};

export class OfflineStorageService {
  static isOfflineSimulated(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_SIMULATION) === 'true';
  }

  static setOfflineSimulation(value: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.OFFLINE_SIMULATION, String(value));
    window.dispatchEvent(new CustomEvent('vernacraft-network-change', { detail: { offline: value } }));
  }

  static getCachedLessons(): Lesson[] {
    const defaultLessons = [DEMO_WATER_CYCLE_LESSON, DEMO_PLANTS_LESSON];
    if (typeof window === 'undefined') return defaultLessons;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_LESSONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CACHED_LESSONS, JSON.stringify(defaultLessons));
        return defaultLessons;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(STORAGE_KEYS.CACHED_LESSONS, JSON.stringify(defaultLessons));
      return defaultLessons;
    } catch {
      return defaultLessons;
    }
  }

  static cacheLesson(lesson: Lesson) {
    if (typeof window === 'undefined' || !lesson) return;
    try {
      const defaultLessons = [DEMO_WATER_CYCLE_LESSON, DEMO_PLANTS_LESSON];
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_LESSONS);
      let existing: Lesson[] = defaultLessons;
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            existing = parsed;
          }
        } catch {}
      }
      const updated = [lesson, ...existing.filter((l) => l.id !== lesson.id)];
      localStorage.setItem(STORAGE_KEYS.CACHED_LESSONS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to cache lesson:', err);
    }
  }

  static cacheLessons(lessons: Lesson[]) {
    if (typeof window === 'undefined' || !Array.isArray(lessons) || lessons.length === 0) return;
    try {
      const defaultLessons = [DEMO_WATER_CYCLE_LESSON, DEMO_PLANTS_LESSON];
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_LESSONS);
      let existing: Lesson[] = defaultLessons;
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            existing = parsed;
          }
        } catch {}
      }
      const map = new Map<string, Lesson>();
      existing.forEach((l) => map.set(l.id, l));
      lessons.forEach((l) => map.set(l.id, l));
      const updated = Array.from(map.values());
      localStorage.setItem(STORAGE_KEYS.CACHED_LESSONS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to batch cache lessons:', err);
    }
  }

  static getCachedQuiz(id: string): Quiz | null {
    if (typeof window === 'undefined') return DEMO_QUIZ_WATER_CYCLE;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_QUIZZES);
      if (data) {
        const list: Quiz[] = JSON.parse(data);
        const match = list.find((q) => q.id === id || q.lessonId === id);
        if (match) return match;
      }
    } catch {}
    return DEMO_QUIZ_WATER_CYCLE;
  }

  static cacheQuiz(quiz: Quiz) {
    if (typeof window === 'undefined' || !quiz) return;
    try {
      let existing: Quiz[] = [DEMO_QUIZ_WATER_CYCLE];
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_QUIZZES);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) existing = parsed;
        } catch {}
      }
      const updated = [quiz, ...existing.filter((q) => q.id !== quiz.id)];
      localStorage.setItem(STORAGE_KEYS.CACHED_QUIZZES, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to cache quiz:', err);
    }
  }

  static getCachedProgress(): StudentProgress {
    if (typeof window === 'undefined') return DEMO_STUDENT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_PROGRESS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CACHED_PROGRESS, JSON.stringify(DEMO_STUDENT_PROGRESS));
        return DEMO_STUDENT_PROGRESS;
      }
      return JSON.parse(data);
    } catch {
      return DEMO_STUDENT_PROGRESS;
    }
  }

  static saveProgress(progress: StudentProgress) {
    if (typeof window === 'undefined' || !progress) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_PROGRESS, JSON.stringify(progress));
    } catch (err) {
      console.warn('Failed to save progress:', err);
    }
  }

  static getCachedWorksheets(): Worksheet[] {
    if (typeof window === 'undefined') return [DEMO_WORKSHEET];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_WORKSHEETS);
      if (!data) return [DEMO_WORKSHEET];
      return JSON.parse(data);
    } catch {
      return [DEMO_WORKSHEET];
    }
  }

  static cacheWorksheet(worksheet: Worksheet) {
    if (typeof window === 'undefined' || !worksheet) return;
    try {
      let existing: Worksheet[] = [DEMO_WORKSHEET];
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_WORKSHEETS);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) existing = parsed;
        } catch {}
      }
      const updated = [worksheet, ...existing.filter((w) => w.id !== worksheet.id)];
      localStorage.setItem(STORAGE_KEYS.CACHED_WORKSHEETS, JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to cache worksheet:', err);
    }
  }
}
