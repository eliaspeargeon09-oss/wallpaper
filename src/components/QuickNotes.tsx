import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, Trash2 } from 'lucide-react';

interface QuickNotesProps {
  initialNotes: string;
  onSaveNotes: (content: string) => void;
}

export const QuickNotes: React.FC<QuickNotesProps> = ({ initialNotes, onSaveNotes }) => {
  const [content, setContent] = useState(initialNotes);
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    setContent(initialNotes);
  }, [initialNotes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    onSaveNotes(val);
    setSavedStatus(true);
    const timeout = setTimeout(() => setSavedStatus(false), 1200);
    return () => clearTimeout(timeout);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (content.trim() && window.confirm('Clear all scratchpad notes?')) {
      setContent('');
      onSaveNotes('');
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group flex flex-col h-[220px]">
      {/* Top subtle line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Scratchpad & Notes
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            {savedStatus ? (
              <span className="text-cyan-400 font-medium animate-pulse">Syncing...</span>
            ) : (
              <span>Local Cached</span>
            )}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors rounded hover:bg-white/[0.05]"
            title="Copy notes to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors rounded hover:bg-white/[0.05]"
            title="Clear notes"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Text Area */}
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Quick ideas, code snippets, reminders, or lecture notes..."
        className="w-full flex-1 bg-white/[0.02] border border-white/[0.08] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 resize-none font-mono transition-all leading-relaxed"
      />

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
        <span>{wordCount} words · {charCount} chars</span>
        <span>Auto-saved to device</span>
      </div>
    </div>
  );
};
