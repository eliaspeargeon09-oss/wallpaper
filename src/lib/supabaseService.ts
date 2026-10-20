import { getSupabaseClient } from './supabase';
import { 
  Project, 
  Assignment, 
  MinistryActivity, 
  SpiritualReflection, 
  BibleStudyNote 
} from '../types';

// ==============================================================================
// 1. PROJECTS SERVICE
// ==============================================================================

export async function fetchProjectsFromCloud(): Promise<Project[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch projects from Supabase:', error.message);
    return null;
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    statusType: row.status_type || 'in_dev',
    techStack: row.tech_stack || [],
    url: row.live_url || '',
    githubUrl: row.github_url || ''
  }));
}

export async function saveProjectToCloud(project: Project): Promise<Project | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const payload = {
    user_id: userData.user.id,
    title: project.name,
    description: project.description,
    category: project.category,
    status: project.status,
    status_type: project.statusType,
    tech_stack: project.techStack,
    live_url: project.url || '',
    github_url: project.githubUrl || ''
  };

  // If project has a valid UUID, upsert/update, otherwise insert
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.id);
  
  if (isUuid) {
    const { data, error } = await supabase
      .from('projects')
      .upsert({ id: project.id, ...payload })
      .select()
      .single();

    if (error) {
      console.error('Project upsert error:', error.message);
      return null;
    }
    return {
      ...project,
      id: data.id
    };
  } else {
    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Project insert error:', error.message);
      return null;
    }
    return {
      ...project,
      id: data.id
    };
  }
}

export async function deleteProjectFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete project:', error.message);
    return false;
  }
  return true;
}

// ==============================================================================
// 2. ASSIGNMENTS SERVICE
// ==============================================================================

export async function fetchAssignmentsFromCloud(): Promise<Assignment[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch assignments from Supabase:', error.message);
    return null;
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    subject: row.subject,
    description: row.description || '',
    dueDate: row.due_date || '',
    dueTime: row.due_time || '23:59',
    priority: row.priority,
    status: row.status,
    isTodayPriority: row.is_today_priority || false,
    createdAt: new Date(row.created_at).getTime()
  }));
}

export async function saveAssignmentToCloud(assignment: Assignment): Promise<Assignment | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const payload = {
    user_id: userData.user.id,
    title: assignment.title,
    subject: assignment.subject,
    description: assignment.description || '',
    due_date: assignment.dueDate || null,
    due_time: assignment.dueTime || '23:59',
    priority: assignment.priority,
    status: assignment.status,
    is_today_priority: assignment.isTodayPriority || false,
    completed_at: assignment.status === 'Completed' ? new Date().toISOString() : null
  };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(assignment.id);

  if (isUuid) {
    const { data, error } = await supabase
      .from('assignments')
      .upsert({ id: assignment.id, ...payload })
      .select()
      .single();

    if (error) {
      console.error('Assignment upsert error:', error.message);
      return null;
    }
    return {
      ...assignment,
      id: data.id
    };
  } else {
    const { data, error } = await supabase
      .from('assignments')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Assignment insert error:', error.message);
      return null;
    }
    return {
      ...assignment,
      id: data.id
    };
  }
}

export async function deleteAssignmentFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete assignment:', error.message);
    return false;
  }
  return true;
}

// ==============================================================================
// 3. CHURCH ACTIVITIES SERVICE
// ==============================================================================

export async function fetchChurchActivitiesFromCloud(): Promise<MinistryActivity[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('church_activities')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch church activities:', error.message);
    return null;
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    completed: row.completed,
    notes: row.notes || '',
    createdAt: new Date(row.created_at).getTime()
  }));
}

export async function saveChurchActivityToCloud(activity: MinistryActivity): Promise<MinistryActivity | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const payload = {
    user_id: userData.user.id,
    title: activity.title,
    category: activity.category,
    completed: activity.completed,
    notes: activity.notes || ''
  };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activity.id);

  if (isUuid) {
    const { data, error } = await supabase
      .from('church_activities')
      .upsert({ id: activity.id, ...payload })
      .select()
      .single();

    if (error) {
      console.error('Activity upsert error:', error.message);
      return null;
    }
    return { ...activity, id: data.id };
  } else {
    const { data, error } = await supabase
      .from('church_activities')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Activity insert error:', error.message);
      return null;
    }
    return { ...activity, id: data.id };
  }
}

export async function deleteChurchActivityFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('church_activities')
    .delete()
    .eq('id', id);

  return !error;
}

// ==============================================================================
// 4. SPIRITUAL REFLECTIONS SERVICE
// ==============================================================================

export async function fetchReflectionsFromCloud(): Promise<SpiritualReflection[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('spiritual_reflections')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reflections:', error.message);
    return null;
  }

  return (data || []).map((row) => ({
    id: row.id,
    date: row.reflection_date,
    timestamp: new Date(row.created_at).getTime(),
    prompt: row.prompt,
    content: row.content
  }));
}

export async function saveReflectionToCloud(ref: SpiritualReflection): Promise<SpiritualReflection | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const payload = {
    user_id: userData.user.id,
    reflection_date: ref.date,
    prompt: ref.prompt,
    content: ref.content
  };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ref.id);

  if (isUuid) {
    const { data, error } = await supabase
      .from('spiritual_reflections')
      .upsert({ id: ref.id, ...payload })
      .select()
      .single();

    if (error) return null;
    return { ...ref, id: data.id };
  } else {
    const { data, error } = await supabase
      .from('spiritual_reflections')
      .insert(payload)
      .select()
      .single();

    if (error) return null;
    return { ...ref, id: data.id };
  }
}

export async function deleteReflectionFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('spiritual_reflections')
    .delete()
    .eq('id', id);

  return !error;
}

// ==============================================================================
// 5. BIBLE STUDY NOTES SERVICE
// ==============================================================================

export async function fetchStudyNotesFromCloud(): Promise<BibleStudyNote[] | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('bible_study_notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return null;

  return (data || []).map((row) => ({
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    notes: row.notes,
    questions: row.questions || '',
    application: row.application || '',
    prayerPoints: row.prayer_points || '',
    updatedAt: new Date(row.updated_at).getTime()
  }));
}

export async function saveStudyNoteToCloud(note: BibleStudyNote): Promise<BibleStudyNote | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return null;

  const payload = {
    user_id: userData.user.id,
    book: note.book,
    chapter: note.chapter,
    notes: note.notes,
    questions: note.questions || '',
    application: note.application || '',
    prayer_points: note.prayerPoints || ''
  };

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(note.id);

  if (isUuid) {
    const { data, error } = await supabase
      .from('bible_study_notes')
      .upsert({ id: note.id, ...payload })
      .select()
      .single();

    if (error) return null;
    return { ...note, id: data.id };
  } else {
    const { data, error } = await supabase
      .from('bible_study_notes')
      .insert(payload)
      .select()
      .single();

    if (error) return null;
    return { ...note, id: data.id };
  }
}

export async function deleteStudyNoteFromCloud(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { error } = await supabase
    .from('bible_study_notes')
    .delete()
    .eq('id', id);

  return !error;
}

// ==============================================================================
// 6. PERSONAL NOTES SERVICE
// ==============================================================================

export async function fetchPersonalNotesFromCloud(): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('personal_notes')
    .select('content')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data?.content ?? null;
}

export async function savePersonalNotesToCloud(content: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return false;

  // Check if a row already exists
  const { data: existing } = await supabase
    .from('personal_notes')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from('personal_notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    return !error;
  } else {
    const { error } = await supabase
      .from('personal_notes')
      .insert({ user_id: userData.user.id, content });
    return !error;
  }
}

// ==============================================================================
// 7. DAILY PRAYER RECORDS SERVICE
// ==============================================================================

export async function recordPrayerCompletionToCloud(prayerId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return false;

  const todayStr = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('daily_prayer_records')
    .upsert(
      {
        user_id: userData.user.id,
        prayer_date: todayStr,
        prayer_id: prayerId,
        completion_status: true
      },
      { onConflict: 'user_id,prayer_date,prayer_id' }
    );

  return !error;
}

// ==============================================================================
// 8. SAFE DATA MIGRATION UTILITY (LOCAL STORAGE -> SUPABASE)
// Preserves local storage, validates and associates records with auth user
// ==============================================================================

export interface MigrationReport {
  projectsMigrated: number;
  assignmentsMigrated: number;
  activitiesMigrated: number;
  reflectionsMigrated: number;
  studyNotesMigrated: number;
  notesMigrated: boolean;
  errors: string[];
}

export async function migrateLocalStorageToCloud(userId: string): Promise<MigrationReport> {
  const report: MigrationReport = {
    projectsMigrated: 0,
    assignmentsMigrated: 0,
    activitiesMigrated: 0,
    reflectionsMigrated: 0,
    studyNotesMigrated: 0,
    notesMigrated: false,
    errors: []
  };

  const supabase = getSupabaseClient();
  if (!supabase) {
    report.errors.push('Supabase client is not configured.');
    return report;
  }

  // 1. Projects
  try {
    const savedProjects = localStorage.getItem('kes_known_projects_v2');
    if (savedProjects) {
      const parsed: Project[] = JSON.parse(savedProjects);
      for (const p of parsed) {
        if (!p.name?.trim()) continue;
        const res = await saveProjectToCloud(p);
        if (res) report.projectsMigrated++;
      }
    }
  } catch (err: any) {
    report.errors.push(`Projects migration: ${err?.message || err}`);
  }

  // 2. Assignments
  try {
    const savedAssignments = localStorage.getItem('kes_assignments_v2');
    if (savedAssignments) {
      const parsed: Assignment[] = JSON.parse(savedAssignments);
      for (const a of parsed) {
        if (!a.title?.trim()) continue;
        const res = await saveAssignmentToCloud(a);
        if (res) report.assignmentsMigrated++;
      }
    }
  } catch (err: any) {
    report.errors.push(`Assignments migration: ${err?.message || err}`);
  }

  // 3. Church Activities
  try {
    const savedActivities = localStorage.getItem('kes_ministry_activities_v1');
    if (savedActivities) {
      const parsed: MinistryActivity[] = JSON.parse(savedActivities);
      for (const act of parsed) {
        if (!act.title?.trim()) continue;
        const res = await saveChurchActivityToCloud(act);
        if (res) report.activitiesMigrated++;
      }
    }
  } catch (err: any) {
    report.errors.push(`Church activities migration: ${err?.message || err}`);
  }

  // 4. Reflections
  try {
    const savedReflections = localStorage.getItem('kes_reflections_v1');
    if (savedReflections) {
      const parsed: SpiritualReflection[] = JSON.parse(savedReflections);
      for (const r of parsed) {
        if (!r.content?.trim()) continue;
        const res = await saveReflectionToCloud(r);
        if (res) report.reflectionsMigrated++;
      }
    }
  } catch (err: any) {
    report.errors.push(`Reflections migration: ${err?.message || err}`);
  }

  // 5. Bible Study Notes
  try {
    const savedNotes = localStorage.getItem('kes_study_notes_v1');
    if (savedNotes) {
      const parsed: BibleStudyNote[] = JSON.parse(savedNotes);
      for (const sn of parsed) {
        if (!sn.book?.trim() || !sn.notes?.trim()) continue;
        const res = await saveStudyNoteToCloud(sn);
        if (res) report.studyNotesMigrated++;
      }
    }
  } catch (err: any) {
    report.errors.push(`Bible study notes migration: ${err?.message || err}`);
  }

  // 6. Personal Notes
  try {
    const savedAcademicNotes = localStorage.getItem('kes_assignment_notes_v2');
    if (savedAcademicNotes?.trim()) {
      const success = await savePersonalNotesToCloud(savedAcademicNotes);
      report.notesMigrated = success;
    }
  } catch (err: any) {
    report.errors.push(`Academic notes migration: ${err?.message || err}`);
  }

  return report;
}
