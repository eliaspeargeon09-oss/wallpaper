import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Plus, 
  Star, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Save, 
  Calendar,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Assignment } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  fetchAssignmentsFromCloud, 
  saveAssignmentToCloud, 
  deleteAssignmentFromCloud, 
  fetchPersonalNotesFromCloud, 
  savePersonalNotesToCloud 
} from '../lib/supabaseService';

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Data Structures: Implement AVL Tree Balancing in C',
    subject: 'Data Structures',
    description: 'Complete AVL rotations, insertion, and deletion test cases for GRIET CSE-G lab evaluation.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'High',
    status: 'In Progress',
    isTodayPriority: true,
    createdAt: Date.now() - 3600000 * 10
  },
  {
    id: 'asg-2',
    title: 'DBMS: Relational Algebra & SQL Query Optimization',
    subject: 'DBMS',
    description: 'Solve problem set 4 on indexing, B+ trees, and subquery cost plans.',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    dueTime: '18:00',
    priority: 'Medium',
    status: 'Pending',
    isTodayPriority: false,
    createdAt: Date.now() - 3600000 * 6
  },
  {
    id: 'asg-3',
    title: 'Digital Logic: Karnaugh Map Minimization & Multiplexer Design',
    subject: 'Digital Logic',
    description: 'Verify 4-variable K-maps and simulate circuits in logic simulator.',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    dueTime: '17:00',
    priority: 'High',
    status: 'Pending',
    isTodayPriority: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'asg-4',
    title: 'Mathematics / Statistics: Probability Distribution Problem Sheet',
    subject: 'Mathematics / Statistics',
    description: 'Complete Normal and Poisson distribution exercises for internal assessment.',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'Low',
    status: 'Completed',
    isTodayPriority: false,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'asg-5',
    title: 'Sunday School: Print Weekly Scripture Verse Cards',
    subject: 'Church',
    description: 'Prepare printed memory verse cards for Sunday school class fellowship.',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dueTime: '19:00',
    priority: 'Medium',
    status: 'Pending',
    isTodayPriority: true,
    createdAt: Date.now() - 3600000 * 4
  }
];

const SUBJECTS = [
  'Data Structures',
  'C Programming',
  'DBMS',
  'Digital Logic',
  'Mathematics / Statistics',
  'Other College Work',
  'Personal',
  'Church'
];

export const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Assignments list
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem('kes_assignments_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  // Quick notes
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('kes_assignment_notes_v2') || 
        "// KES.OS Academic Deadlines & Reminders\n- GRIET Mid-Term Exam schedules\n- Submit Data Structures lab manual before Friday\n- Sunday School attendance register check";
    } catch {
      return '';
    }
  });

  const [notesSaved, setNotesSaved] = useState(false);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<Assignment['priority']>('Medium');
  const [status, setStatus] = useState<Assignment['status']>('Pending');
  const [isTodayPriority, setIsTodayPriority] = useState(false);

  // Filter & Sort
  const [filter, setFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed' | 'Overdue'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'recentlyAdded'>('dueDate');

  // Live Clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      fetchAssignmentsFromCloud().then((cloudAssignments) => {
        if (cloudAssignments && cloudAssignments.length > 0) {
          setAssignments(cloudAssignments);
        }
      });
      fetchPersonalNotesFromCloud().then((cloudNotes) => {
        if (cloudNotes !== null && cloudNotes.trim()) {
          setNotes(cloudNotes);
        }
      });
    }
  }, [user]);

  // Sync assignments to local storage as fallback
  useEffect(() => {
    try {
      localStorage.setItem('kes_assignments_v2', JSON.stringify(assignments));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [assignments]);

  // Sync notes
  const handleSaveNotes = (val: string) => {
    setNotes(val);
    try {
      localStorage.setItem('kes_assignment_notes_v2', val);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (e) {
      console.warn('Notes save failed', e);
    }
    if (user) {
      savePersonalNotesToCloud(val);
    }
  };


  // Check if date is overdue
  const isOverdue = (assignment: Assignment) => {
    if (assignment.status === 'Completed') return false;
    if (!assignment.dueDate) return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return assignment.dueDate < todayStr;
  };

  // Real statistics calculation
  const totalCount = assignments.length;
  const completedCount = assignments.filter((a) => a.status === 'Completed').length;
  const pendingCount = assignments.filter((a) => a.status === 'Pending').length;
  const inProgressCount = assignments.filter((a) => a.status === 'In Progress').length;
  const overdueCount = assignments.filter(isOverdue).length;

  const todayPriorities = assignments.filter((a) => a.isTodayPriority && a.status !== 'Completed');

  // Filtered & Sorted list
  const filteredAssignments = assignments
    .filter((a) => {
      if (filter === 'All') return true;
      if (filter === 'Overdue') return isOverdue(a);
      return a.status === filter;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const weight = { High: 3, Medium: 2, Low: 1 };
        return weight[b.priority] - weight[a.priority];
      }
      if (sortBy === 'recentlyAdded') {
        return b.createdAt - a.createdAt;
      }
      // default: dueDate
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  const handleToggleComplete = async (id: string) => {
    let updatedItem: Assignment | undefined;
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === 'Completed' ? 'Pending' : 'Completed';
          updatedItem = { ...a, status: newStatus };
          return updatedItem;
        }
        return a;
      })
    );
    if (user && updatedItem) {
      await saveAssignmentToCloud(updatedItem);
    }
  };

  const handleToggleTodayPriority = async (id: string) => {
    let updatedItem: Assignment | undefined;
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          updatedItem = { ...a, isTodayPriority: !a.isTodayPriority };
          return updatedItem;
        }
        return a;
      })
    );
    if (user && updatedItem) {
      await saveAssignmentToCloud(updatedItem);
    }
  };

  const handleDelete = async (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    if (user) {
      await deleteAssignmentFromCloud(id);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    setTitle(assignment.title);
    setSubject(assignment.subject);
    setDescription(assignment.description || '');
    setDueDate(assignment.dueDate);
    setDueTime(assignment.dueTime || '23:59');
    setPriority(assignment.priority);
    setStatus(assignment.status);
    setIsTodayPriority(assignment.isTodayPriority || false);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSubject(SUBJECTS[0]);
    setDescription('');
    setDueDate('');
    setDueTime('23:59');
    setPriority('Medium');
    setStatus('Pending');
    setIsTodayPriority(false);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let targetItem: Assignment;

    if (editingId) {
      targetItem = {
        id: editingId,
        title: title.trim(),
        subject,
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        status,
        isTodayPriority,
        createdAt: assignments.find((a) => a.id === editingId)?.createdAt || Date.now()
      };
      setAssignments((prev) => prev.map((a) => (a.id === editingId ? targetItem : a)));
    } else {
      targetItem = {
        id: `asg_${Date.now()}`,
        title: title.trim(),
        subject,
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        status,
        isTodayPriority,
        createdAt: Date.now()
      };
      setAssignments((prev) => [targetItem, ...prev]);
    }

    if (user) {
      const saved = await saveAssignmentToCloud(targetItem);
      if (saved) {
        setAssignments((prev) => prev.map((a) => (a.id === targetItem.id ? saved : a)));
      }
    }

    resetForm();
  };

  const hoursStr = now.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const dateStr = now.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
  const weekdayStr = now.toLocaleDateString(undefined, { weekday: 'short' });

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-3 sm:p-5 max-w-7xl mx-auto overflow-hidden select-none gap-2.5">
      
      {/* 1. Header & Live Clock Bar (Compact, shrink-0) */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                Assignments & Academic Task Workspace
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                GRIET CSE-G
              </span>
              {user ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cloud Synced
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                  Local Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Coursework, lab practicals, semester problem sets, and ministry tasks.
            </p>
          </div>
        </div>


        {/* Live Clock Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white tabular-nums">{hoursStr}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 text-[11px]">{weekdayStr}, {dateStr}</span>
        </div>
      </div>

      {/* 2. Real Assignment Summary Counters (Compact 5-stat strip, shrink-0) */}
      <div className="grid grid-cols-5 gap-2 shrink-0">
        <div className="glass-panel rounded-lg py-1.5 px-3 border border-white/5 text-center">
          <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider block">Total</span>
          <span className="text-base font-bold font-mono text-white tabular-nums">{totalCount}</span>
        </div>
        <div className="glass-panel rounded-lg py-1.5 px-3 border border-emerald-500/20 text-center bg-emerald-500/[0.02]">
          <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-wider block">Done</span>
          <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">{completedCount}</span>
        </div>
        <div className="glass-panel rounded-lg py-1.5 px-3 border border-cyan-500/20 text-center bg-cyan-500/[0.02]">
          <span className="text-[9px] font-mono uppercase text-cyan-300 tracking-wider block">Pending</span>
          <span className="text-base font-bold font-mono text-cyan-300 tabular-nums">{pendingCount}</span>
        </div>
        <div className="glass-panel rounded-lg py-1.5 px-3 border border-violet-500/20 text-center bg-violet-500/[0.02]">
          <span className="text-[9px] font-mono uppercase text-violet-300 tracking-wider block">In Progress</span>
          <span className="text-base font-bold font-mono text-violet-300 tabular-nums">{inProgressCount}</span>
        </div>
        <div className="glass-panel rounded-lg py-1.5 px-3 border border-rose-500/30 text-center bg-rose-500/[0.02]">
          <span className="text-[9px] font-mono uppercase text-rose-400 tracking-wider block">Overdue</span>
          <span className="text-base font-bold font-mono text-rose-400 tabular-nums">{overdueCount}</span>
        </div>
      </div>

      {/* 3. Main Workspace Deck (Split layout, fits within viewport without page scroll) */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden">
        
        {/* Left Column (Assignments List + Filters + Today's Priorities) */}
        <div className="flex-1 min-h-0 flex flex-col glass-panel rounded-xl p-3 border border-white/[0.08] overflow-hidden">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06] shrink-0">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {(['All', 'Pending', 'In Progress', 'Completed', 'Overdue'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    filter === f
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f} {f === 'Overdue' && overdueCount > 0 ? `(${overdueCount})` : ''}
                </button>
              ))}
            </div>

            {/* Sort Dropdown + Add Task Trigger */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <ArrowUpDown className="w-3 h-3" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white/[0.04] border border-white/10 rounded-md px-1.5 py-0.5 text-white focus:outline-none focus:border-cyan-400/50"
                >
                  <option value="dueDate" className="bg-slate-900">Due Date</option>
                  <option value="priority" className="bg-slate-900">Priority</option>
                  <option value="recentlyAdded" className="bg-slate-900">Recent</option>
                </select>
              </div>

              <button
                onClick={() => {
                  if (isFormOpen && !editingId) {
                    setIsFormOpen(false);
                  } else {
                    resetForm();
                    setIsFormOpen(true);
                  }
                }}
                className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isFormOpen && !editingId ? 'Close Form' : 'New Assignment'}</span>
              </button>
            </div>
          </div>

          {/* Today's Critical Priorities Bar (if any marked for today) */}
          {todayPriorities.length > 0 && (
            <div className="my-2 p-2 rounded-lg bg-amber-500/[0.04] border border-amber-500/30 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>TODAY'S PRIORITIES:</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-200">
                {todayPriorities.slice(0, 2).map((item) => (
                  <span key={item.id} className="px-2 py-0.5 rounded bg-black/40 border border-amber-500/20 truncate max-w-[220px]">
                    {item.title}
                  </span>
                ))}
                {todayPriorities.length > 2 && (
                  <span className="text-[10px] text-amber-400 font-mono">+{todayPriorities.length - 2} more</span>
                )}
              </div>
            </div>
          )}

          {/* Assignments List (Inner scrollable container; window never scrolls) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 mt-2">
            {filteredAssignments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs font-mono">
                <CheckSquare className="w-8 h-8 text-slate-600 mb-2" />
                <span>No assignments match the "{filter}" filter.</span>
              </div>
            ) : (
              filteredAssignments.map((a) => {
                const overdue = isOverdue(a);
                return (
                  <div
                    key={a.id}
                    className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 group ${
                      a.status === 'Completed'
                        ? 'bg-white/[0.015] border-white/5 opacity-65'
                        : overdue
                        ? 'bg-rose-500/[0.04] border-rose-500/40 hover:border-rose-400'
                        : 'bg-white/[0.02] border-white/5 hover:border-cyan-500/30'
                    }`}
                  >
                    {/* Left: Complete Checkbox + Title + Meta */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => handleToggleComplete(a.id)}
                        className="text-slate-400 hover:text-emerald-400 cursor-pointer shrink-0"
                        title={a.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                      >
                        {a.status === 'Completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                      </button>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-300">
                            {a.subject}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                              a.priority === 'High'
                                ? 'bg-rose-500/20 text-rose-300'
                                : a.priority === 'Medium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {a.priority}
                          </span>
                          {overdue && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500 text-white font-bold animate-pulse">
                              OVERDUE
                            </span>
                          )}
                        </div>

                        <h4
                          className={`text-xs font-medium leading-tight truncate ${
                            a.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {a.title}
                        </h4>

                        {a.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Due Date & Actions */}
                    <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                      {a.dueDate && (
                        <span className={`text-[11px] ${overdue ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                          {a.dueDate} {a.dueTime ? `(${a.dueTime})` : ''}
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleTodayPriority(a.id)}
                        className={`p-1 transition-colors cursor-pointer ${
                          a.isTodayPriority ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'
                        }`}
                        title="Toggle Today's Priority"
                      >
                        <Star className={`w-3.5 h-3.5 ${a.isTodayPriority ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => handleEdit(a)}
                        className="text-slate-500 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                        title="Edit assignment"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(a.id)}
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                        title="Delete assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Creation/Edit Form OR Quick Academic Notes */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-3 shrink-0 min-h-0">
          
          {/* Quick Add / Edit Form Card */}
          {isFormOpen ? (
            <div className="glass-panel rounded-xl p-3 border border-cyan-500/30 flex flex-col justify-between shrink-0 shadow-lg">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <span className="text-xs font-mono font-bold text-cyan-300">
                  {editingId ? 'Edit Assignment' : 'New Assignment'}
                </span>
                <button onClick={resetForm} className="text-slate-500 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2 mt-2">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Assignment title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400/50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="todayPriority"
                    checked={isTodayPriority}
                    onChange={(e) => setIsTodayPriority(e.target.checked)}
                    className="rounded bg-white/[0.04] border-white/10 text-cyan-500 focus:ring-0"
                  />
                  <label htmlFor="todayPriority" className="text-[11px] font-mono text-slate-300">
                    Mark as Today's Critical Priority
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                  >
                    {editingId ? 'Update' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* Quick Academic Scratchpad & Notes */}
          <div className="flex-1 min-h-0 glass-panel rounded-xl p-3 border border-white/[0.08] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">Quick Notes & Reminders</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {notesSaved ? 'Saved' : 'Auto-sync'}
              </span>
            </div>

            <div className="flex-1 min-h-0 mt-2">
              <textarea
                value={notes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                placeholder="Jot down quick exam dates, lab manual requirements, ideas..."
                className="w-full h-full bg-white/[0.02] border border-white/5 rounded-lg p-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between shrink-0">
              <span>Saved in local storage</span>
              <span>GRIET CSE-G</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
