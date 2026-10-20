import React from 'react';
import { ShieldCheck, Sparkles, Laptop, Eye, EyeOff, Network, Cpu, Terminal } from 'lucide-react';

interface IdentityHeroProps {
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenWallpaperModal: () => void;
  isArchitectureView?: boolean;
  onToggleArchitectureView?: () => void;
}

export const IdentityHero: React.FC<IdentityHeroProps> = ({
  isFocusMode,
  onToggleFocusMode,
  onOpenWallpaperModal,
  isArchitectureView = false,
  onToggleArchitectureView
}) => {
  return (
    <section className="glass-panel rounded-2xl p-5 relative overflow-hidden group flex flex-col items-center justify-center text-center select-none h-full min-h-[220px]">
      {/* Top subtle cyan/violet accent line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-violet-400/30" />

      {/* Cybernetic Corner Bracket Accents */}
      <div className="absolute top-2 left-2 text-cyan-500/30 font-mono text-[10px] pointer-events-none">┌</div>
      <div className="absolute top-2 right-2 text-cyan-500/30 font-mono text-[10px] pointer-events-none">┐</div>
      <div className="absolute bottom-2 left-2 text-cyan-500/30 font-mono text-[10px] pointer-events-none">└</div>
      <div className="absolute bottom-2 right-2 text-cyan-500/30 font-mono text-[10px] pointer-events-none">┘</div>

      {/* Background radial highlight centered behind the name */}
      <div 
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[380px] h-[220px] pointer-events-none -z-10 rounded-full blur-[90px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.7) 0%, rgba(139, 92, 246, 0.45) 50%, transparent 70%)',
        }}
      />

      {/* Role / Identity Subtitle kicker */}
      <div className="flex items-center gap-2 mb-2 text-[10px] sm:text-xs tracking-[0.22em] uppercase text-cyan-400 font-mono font-semibold">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>System Architect</span>
        <span className="text-slate-600 font-normal">·</span>
        <span>Developer</span>
        <span className="text-slate-600 font-normal">·</span>
        <span>GRIET CSE-G</span>
      </div>

      {/* Main Dominant Identity Name */}
      <div className="relative group cursor-default my-0.5">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-slate-200">
            Katta Elia Speargeon
          </span>
        </h1>
        {/* Subtle cyan glow reflection line */}
        <div className="h-[2px] w-24 mx-auto mt-1.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent transition-all duration-500 group-hover:w-44" />
      </div>

      {/* College & Department & Verification Badges */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 font-bold tracking-wide text-slate-200 font-mono">
          GRIET HYDERABAD
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 font-medium tracking-wider text-cyan-300 font-mono">
          CSE - G // NODE 01
        </span>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          VERIFIED ARCHITECT
        </span>
      </div>

      {/* Interactive Controls Row */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {onToggleArchitectureView && (
          <button
            onClick={onToggleArchitectureView}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isArchitectureView
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                : 'bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
            }`}
            title="Inspect full interactive system workflow architecture"
          >
            <Network className="w-3.5 h-3.5" />
            <span>{isArchitectureView ? 'Exit Workflow View' : 'Explore System Workflow'}</span>
          </button>
        )}

        <button
          onClick={onToggleFocusMode}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            isFocusMode
              ? 'bg-violet-500/25 text-violet-300 border border-violet-400/50 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
              : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
          }`}
          title="Toggle Focus Mode"
        >
          {isFocusMode ? <Eye className="w-3.5 h-3.5 text-violet-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isFocusMode ? 'Focus Active' : 'Focus Mode'}</span>
        </button>

        <button
          onClick={onOpenWallpaperModal}
          className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10 transition-colors cursor-pointer"
          title="Configure System Wallpaper and Ambience"
        >
          <Laptop className="w-3.5 h-3.5 text-cyan-400" />
          <span>Wallpaper HUD</span>
        </button>
      </div>
    </section>
  );
};
