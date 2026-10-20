import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface TodoPanelProps {
  tasks: Task[];
  onAddTask: (text: string, category?: 'CSE' | 'Dev' | 'Personal') => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const TodoPanel: React.FC<TodoPanelProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'CSE' | 'Dev' | 'Personal'>('CSE');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddTask(inputText.trim(), selectedCategory);
    setInputText('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group flex flex-col h-[340px]">
      {/* Top subtle line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Today's Priorities
          </span>
        </div>
        
        <span className="text-xs font-mono text-cyan-400/90 font-medium tabular-nums">
          {completedCount}/{totalCount} ({progressPercent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden mb-3 border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Input bar */}
      <form onSubmit={handleFormSubmit} className="flex gap-1.5 mb-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="New priority task..."
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as 'CSE' | 'Dev' | 'Personal')}
          className="bg-slate-900 border border-white/10 rounded-lg px-2 text-[11px] text-slate-300 focus:outline-none focus:border-cyan-400/40"
        >
          <option value="CSE">CSE</option>
          <option value="Dev">Dev</option>
          <option value="Personal">Personal</option>
        </select>
        <button
          type="submit"
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center shrink-0"
          title="Add task"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-xs">
        <div className="flex items-center gap-1 bg-white/[0.03] p-0.5 rounded-md">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              filter === 'all'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              filter === 'active'
                ? 'bg-white/10 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
              filter === 'completed'
                ? 'bg-white/10 text-violet-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Done
          </button>
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear Done
          </button>
        )}
      </div>

      {/* Task List (scrollable) */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
            <span>No tasks in this view</span>
            <span className="text-[10px] text-slate-600 mt-0.5">Stay focused on key priorities</span>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between gap-2 p-2 rounded-lg border transition-all ${
                task.completed
                  ? 'bg-white/[0.015] border-white/5 opacity-60'
                  : 'bg-white/[0.03] border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className="flex items-center gap-2.5 flex-1 text-left min-w-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 shrink-0 hover:text-cyan-400" />
                )}
                <span
                  className={`text-xs truncate ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-200 font-normal'
                  }`}
                >
                  {task.text}
                </span>
                {task.category && (
                  <span className="text-[9px] text-slate-500 shrink-0 font-mono">
                    [{task.category}]
                  </span>
                )}
              </button>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="opacity-40 hover:opacity-100 text-slate-400 hover:text-rose-400 transition-opacity p-1"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
