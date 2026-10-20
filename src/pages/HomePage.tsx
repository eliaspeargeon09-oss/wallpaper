import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Terminal,
  Calendar 
} from 'lucide-react';

interface HomePageProps {
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onExitFocusMode: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isFocusMode,
  onToggleFocusMode,
  onExitFocusMode
}) => {
  // Listen for Escape key to exit Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        onExitFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, onExitFocusMode]);

  // Format today's date for subtle indicator
  const today = new Date();
  const dateFormatted = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="relative w-full h-full min-h-0 flex flex-col items-center justify-center px-4 sm:px-6 select-none overflow-hidden">
      
      {/* Background Radial Glow Centered Behind Identity */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[380px] pointer-events-none -z-10 rounded-full blur-[140px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.75) 0%, rgba(139, 92, 246, 0.45) 45%, transparent 70%)',
        }}
      />

      {/* Cybernetic Frame / Futuristic Corner Accents */}
      <div className="relative max-w-3xl w-full flex flex-col items-center text-center p-6 sm:p-10 transition-all">
        
        {/* Subtle Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-lg pointer-events-none" />

        {/* Futuristic Technical Status Chip (Replaces photograph with clean abstract system badge) */}
        {!isFocusMode && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tracking-wider">HOST: WIN11 // KES.OS WORKSPACE</span>
          </div>
        )}

        {/* Role Kicker */}
        <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm tracking-[0.3em] uppercase text-cyan-400 font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>STUDENT</span>
          <span className="text-slate-600 font-normal">·</span>
          <span>DEVELOPER</span>
          <span className="text-slate-600 font-normal">·</span>
          <span>CREATOR</span>
        </div>

        {/* Main Dominant Identity Name */}
        <div className="relative group cursor-default">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_35px_rgba(34,211,238,0.3)] leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-slate-200">
              Katta Elia Speargeon
            </span>
          </h1>
          {/* Subtle cyan glow reflection line */}
          <div className="h-[2px] w-32 mx-auto mt-3 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent transition-all duration-500 group-hover:w-60" />
        </div>

        {/* College & Department */}
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3">
          <span className="text-lg sm:text-2xl font-bold tracking-wide text-slate-200 font-mono">
            GRIET
          </span>
          <span className="text-cyan-500/70 font-light text-xl">|</span>
          <span className="text-lg sm:text-2xl font-medium tracking-wider text-cyan-300 font-mono">
            CSE - G
          </span>
        </div>

        {/* Protected Laptop & Personal Workspace Tagline */}
        <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono tracking-widest text-slate-300 uppercase shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>PROTECTED LAPTOP</span>
          <span className="text-cyan-500">•</span>
          <span>PERSONAL WORKSPACE</span>
        </div>

        {/* Short Personal Intro Line */}
        <p className="mt-5 text-sm sm:text-base text-slate-400 font-sans max-w-lg leading-relaxed">
          "My personal space for learning, building, creating, and growing."
        </p>

        {/* Focus Mode Button & Controls */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onToggleFocusMode}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wider font-mono flex items-center gap-2.5 transition-all cursor-pointer ${
              isFocusMode
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-400'
                : 'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-400/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]'
            }`}
            title={isFocusMode ? 'Exit Minimalist Focus Mode' : 'Enter Minimalist Focus Mode'}
          >
            {isFocusMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>{isFocusMode ? 'EXIT FOCUS MODE' : 'FOCUS MODE'}</span>
          </button>

          {isFocusMode && (
            <span className="text-[11px] font-mono text-slate-500 animate-pulse">
              Press [ESC] to exit focus
            </span>
          )}
        </div>

        {/* Subtle Date Indicator */}
        {!isFocusMode && (
          <div className="mt-6 sm:mt-8 flex items-center gap-2 text-xs font-mono text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateFormatted}</span>
          </div>
        )}

      </div>
    </div>
  );
};

