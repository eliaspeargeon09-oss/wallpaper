import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Home, 
  BookOpen, 
  FolderGit2, 
  CheckSquare, 
  Maximize2, 
  Minimize2, 
  Settings,
  Cloud,
  Database
} from 'lucide-react';
import { PageId } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onNavigate,
  onOpenSettings,
  onOpenAuth
}) => {
  const { user, isConfigured } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format 12-hour time with seconds
      setCurrentTimeStr(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      // Format date (e.g., "Tue, Oct 20")
      setCurrentDateStr(
        now.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'HOME', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'spiritual', label: 'SPIRITUAL', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'PROJECTS', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: 'assignments', label: 'ASSIGNMENTS', icon: <CheckSquare className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 py-2.5 backdrop-blur-xl bg-[#06080e]/80 border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LEFT: KES.OS Brand & College Label */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          title="Return to Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/25 to-violet-500/25 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:border-cyan-300 transition-colors">
            <Terminal className="w-4 h-4 text-cyan-400 group-hover:scale-105 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors">
              KES<span className="text-cyan-400">.OS</span>
            </span>
            <span className="hidden sm:inline text-[11px] text-cyan-400/70 font-mono tracking-tight">
              GRIET CSE-G
            </span>
          </div>
        </div>

        {/* CENTER: Exact 4 Nav Items (HOME, SPIRITUAL, PROJECTS, ASSIGNMENTS) */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] select-none">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Live Date & Time, Windows 11 Host, Settings, Fullscreen */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Live Date and Time */}
          <div className="hidden md:flex flex-col items-end text-xs font-mono leading-tight">
            <span className="text-white font-medium tabular-nums">{currentTimeStr}</span>
            <span className="text-[10px] text-slate-400">{currentDateStr}</span>
          </div>

          {/* Windows 11 Host Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Windows 11 Host</span>
          </div>

          {/* Cloud Sync Status / Auth Button */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
              user
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-400 hover:text-white'
            }`}
            title={user ? `Connected: ${user.email}` : 'Connect Supabase Cloud'}
          >
            <Cloud className={`w-3.5 h-3.5 ${user ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {user ? 'Cloud Synced' : isConfigured ? 'Sign In' : 'Cloud Setup'}
            </span>
          </button>

          {/* Settings Icon */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer"
            title="Workspace Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 text-slate-300 hover:text-cyan-400 transition-colors" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Windows 11)'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
};
