export type PageId = 'home' | 'spiritual' | 'projects' | 'assignments';

export interface Assignment {
  id: string;
  title: string;
  subject: string; // e.g. 'Data Structures', 'C Programming', 'DBMS', 'Digital Logic', etc.
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  isTodayPriority?: boolean;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: 'Ministry' | 'Game' | 'Church EdTech' | 'AI & Automation' | 'Personal Workspace' | 'General';
  status: string;
  statusType: 'active' | 'in_dev' | 'testing' | 'prototype';
  techStack: string[];
  url?: string;
  githubUrl?: string;
}

export interface BibleVerse {
  id: string;
  reference: string;
  translation: string;
  text: string;
  topic: string;
  reflection: string;
}

export interface PrayerEntry {
  id: string;
  title: string;
  focus: string;
  prayer: string;
  prompt: string;
}

export interface SpiritualReflection {
  id: string;
  date: string;
  timestamp: number;
  prompt: string;
  content: string;
}

export interface BibleStudyNote {
  id: string;
  book: string;
  chapter: string;
  notes: string;
  questions?: string;
  application?: string;
  prayerPoints?: string;
  updatedAt: number;
}

export interface MinistryActivity {
  id: string;
  title: string;
  category: 'Sunday School' | 'Youth Ministry' | 'Worship & Music' | 'Church Events';
  completed: boolean;
  notes?: string;
  createdAt: number;
}

// Legacy support types
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category?: 'CSE' | 'Dev' | 'Personal';
}

export interface QuickLinkItem {
  id: string;
  name: string;
  url: string;
  iconName: 'vscode' | 'github' | 'aistudio' | 'study' | 'terminal' | 'custom';
  description: string;
  shortcut?: string;
}

export type WallpaperMode = 'system-architecture' | 'ambient' | 'blended' | 'cinematic';

export interface ArchitectureNode {
  id: string;
  name: string;
  category: 'client' | 'gateway' | 'service' | 'storage' | 'devops';
  roleTag: string;
  port?: string;
  status: 'active' | 'synced' | 'healthy' | 'routing';
  tech: string[];
  latency?: string;
  throughput?: string;
  description: string;
  metrics?: { label: string; value: string }[];
}
