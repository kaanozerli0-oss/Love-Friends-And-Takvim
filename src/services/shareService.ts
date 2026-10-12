import { GiftPageConfig } from '../types';
import { DEFAULT_GIFT_CONFIG } from '../data/constants';

const LOCAL_STORAGE_GIFT_KEY = 'kalp_ajanda_gift_page_data_v1';
const LOCAL_STORAGE_PLANNER_TASKS = 'kalp_ajanda_tasks_v1';
const LOCAL_STORAGE_PLANNER_HABITS = 'kalp_ajanda_habits_v1';
const LOCAL_STORAGE_PLANNER_JOURNAL = 'kalp_ajanda_journal_v1';
const LOCAL_STORAGE_PLANNER_EVENTS = 'kalp_ajanda_events_v1';

export function saveGiftConfig(config: GiftPageConfig) {
  try {
    localStorage.setItem(LOCAL_STORAGE_GIFT_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save gift config to localStorage:', err);
  }
}

export function loadGiftConfig(): GiftPageConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GIFT_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load gift config:', err);
  }
  return DEFAULT_GIFT_CONFIG;
}

export function encodeGiftToShareUrl(config: GiftPageConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    // Safe utf8 to base64
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.searchParams.delete('gift');
    url.hash = `gift=${encoded}`;
    return url.toString();
  } catch (err) {
    console.error('Error encoding gift to url:', err);
    return window.location.href;
  }
}

export function decodeGiftFromShareUrl(): GiftPageConfig | null {
  try {
    // Check hash first: #gift=...
    const hash = window.location.hash;
    if (hash && hash.startsWith('#gift=')) {
      const encoded = hash.replace('#gift=', '');
      const jsonStr = decodeURIComponent(atob(encoded));
      return JSON.parse(jsonStr) as GiftPageConfig;
    }

    // Check search params: ?gift=...
    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get('gift');
    if (param) {
      const jsonStr = decodeURIComponent(atob(param));
      return JSON.parse(jsonStr) as GiftPageConfig;
    }
  } catch (err) {
    console.error('Failed to decode gift page from URL:', err);
  }
  return null;
}

// Storage helpers for planner
export function getStoredTasks() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLANNER_TASKS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredTasks(tasks: any[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLANNER_TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error(err);
  }
}

export function getStoredHabits() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLANNER_HABITS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredHabits(habits: any[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLANNER_HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error(err);
  }
}

export function getStoredJournal() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLANNER_JOURNAL);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredJournal(journal: any) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLANNER_JOURNAL, JSON.stringify(journal));
  } catch (err) {
    console.error(err);
  }
}

export function getStoredEvents() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLANNER_EVENTS);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredEvents(events: any[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLANNER_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error(err);
  }
}
