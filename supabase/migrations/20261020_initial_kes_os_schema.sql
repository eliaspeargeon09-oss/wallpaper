-- ==============================================================================
-- KES.OS (Katta Elia Speargeon Workspace) - Production PostgreSQL Schema
-- Migration: 20261020_initial_kes_os_schema.sql
-- Framework: Supabase Auth & PostgreSQL Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTION: AUTO-UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLE A: PROFILES
-- Linked to Supabase Auth (auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT 'Katta Elia Speargeon',
  college TEXT DEFAULT 'GRIET — CSE - G',
  workspace_tag TEXT DEFAULT 'PROTECTED LAPTOP • PERSONAL WORKSPACE',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to automatically create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', 'Katta Elia Speargeon')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- TABLE B: PROJECTS
-- Personal portfolio of software development & ministry platforms
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'In Development',
  status_type TEXT NOT NULL DEFAULT 'in_dev', -- 'active' | 'in_dev' | 'testing' | 'prototype'
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE C: ASSIGNMENTS
-- College coursework, labs, exams, and prioritized tasks
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  subject TEXT NOT NULL DEFAULT 'Other College Work',
  priority TEXT NOT NULL DEFAULT 'Medium', -- 'High' | 'Medium' | 'Low'
  status TEXT NOT NULL DEFAULT 'Pending',   -- 'Pending' | 'In Progress' | 'Completed'
  due_date DATE,
  due_time TEXT DEFAULT '23:59',
  is_today_priority BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assignments"
  ON public.assignments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assignments"
  ON public.assignments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assignments"
  ON public.assignments FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE D: CHURCH ACTIVITIES
-- Sunday School, Youth Ministry, Worship & Music, Church Events
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.church_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sunday School', -- 'Sunday School' | 'Youth Ministry' | 'Worship & Music' | 'Church Events'
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT DEFAULT '',
  scheduled_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.church_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own church activities"
  ON public.church_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own church activities"
  ON public.church_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own church activities"
  ON public.church_activities FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own church activities"
  ON public.church_activities FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_church_activities_user_id ON public.church_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_church_activities_category ON public.church_activities(category);

CREATE TRIGGER update_church_activities_updated_at
  BEFORE UPDATE ON public.church_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE E: SPIRITUAL REFLECTIONS
-- Dated devotional thoughts, scripture insights, personal reflections
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.spiritual_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_date TEXT NOT NULL, -- e.g. "Tue, Oct 20, 2026"
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.spiritual_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reflections"
  ON public.spiritual_reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON public.spiritual_reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON public.spiritual_reflections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
  ON public.spiritual_reflections FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON public.spiritual_reflections(user_id);

CREATE TRIGGER update_spiritual_reflections_updated_at
  BEFORE UPDATE ON public.spiritual_reflections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE F: BIBLE STUDY NOTES
-- Book, chapter, theological study notes, applications, prayer points
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bible_study_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book TEXT NOT NULL,
  chapter TEXT NOT NULL,
  notes TEXT NOT NULL,
  questions TEXT DEFAULT '',
  application TEXT DEFAULT '',
  prayer_points TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.bible_study_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study notes"
  ON public.bible_study_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study notes"
  ON public.bible_study_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study notes"
  ON public.bible_study_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own study notes"
  ON public.bible_study_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_study_notes_user_id ON public.bible_study_notes(user_id);

CREATE TRIGGER update_bible_study_notes_updated_at
  BEFORE UPDATE ON public.bible_study_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE G: PERSONAL NOTES
-- Academic scratchpad, exam deadlines, quick reminders
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.personal_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Academic Scratchpad',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON public.personal_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.personal_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.personal_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON public.personal_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_personal_notes_user_id ON public.personal_notes(user_id);

CREATE TRIGGER update_personal_notes_updated_at
  BEFORE UPDATE ON public.personal_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- TABLE H: DAILY PRAYER RECORDS
-- Tracks daily prayer devotion completions without judging spirituality
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_prayer_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  prayer_id TEXT NOT NULL,
  completion_status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_prayer_date UNIQUE (user_id, prayer_date, prayer_id)
);

ALTER TABLE public.daily_prayer_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own prayer records"
  ON public.daily_prayer_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer records"
  ON public.daily_prayer_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer records"
  ON public.daily_prayer_records FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer records"
  ON public.daily_prayer_records FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_prayer_records_user_id ON public.daily_prayer_records(user_id);
