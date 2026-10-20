import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Maximize2, 
  Minimize2, 
  Wifi,
  Sparkles,
  Network
} from 'lucide-react';

interface WorkspaceHeaderProps {
  isArchitectureView?: boolean;
  onToggleArchitectureView?: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  isArchitectureView = false,
  onToggleArchitectureView
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-8 py-2.5 backdrop-blur-xl bg-[#06080e]/75 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/25 to-amber-500/25 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Terminal className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-bold tracking-wider text-white">
              KES<span className="text-cyan-400">.OS</span>
            </span>
            <span className="text-xs text-slate-300 font-sans font-medium">
              Katta Elia Speargeon
            </span>
            <span className="hidden sm:inline text-[11px] text-cyan-400/70 font-mono tracking-tight">
              // GRIET CSE-G
            </span>
          </div>
        </div>

        {/* Live Date & Host Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <span>{currentDateStr}</span>
          </div>

          <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Windows 11 Host
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Wifi className="w-3 h-3" />
              System Architecture Active
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleArchitectureView && (
            <button
              onClick={onToggleArchitectureView}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isArchitectureView
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30'
              }`}
              title="Toggle interactive full system architecture workflow diagram"
            >
              <Network className="w-3.5 h-3.5" />
              <span>{isArchitectureView ? 'Back to Workspace' : 'System Architecture'}</span>
            </button>
          )}

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Windows 11)'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
