import React from 'react';
import { X, Image, Sparkles, Sliders } from 'lucide-react';
import { WallpaperMode } from '../types';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: WallpaperMode;
  onSelectMode: (mode: WallpaperMode) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  opacity,
  onOpacityChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-xl bg-[#0b0e17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              Visual Atmosphere & Personal Wallpaper
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Wallpaper Preview & Tribute */}
          <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 items-center">
            <div className="w-28 h-36 rounded-lg overflow-hidden shrink-0 border border-white/10 shadow-lg relative group">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-20_at_11.52.58_AM_b31b2b4b.jpeg"
                alt="Katta Elia Speargeon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="text-left space-y-1.5 flex-1">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                User Portrait & Foundation Asset
              </span>
              <h4 className="text-sm font-bold text-white">
                Katta Elia Speargeon
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                GRIET CSE-G • Connected with family, inspired to build meaningful digital solutions.
              </p>
              <div className="pt-1 text-[11px] text-slate-500 font-mono">
                Used dynamically as background ambience or standalone view.
              </div>
            </div>
          </div>

          {/* Ambience Preset Options */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2 uppercase tracking-wider font-mono">
              Background Aesthetic Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => onSelectMode('system-architecture')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentMode === 'system-architecture'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-xs font-medium">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-white">System Workflow (Featured)</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Living system architecture schematic with active bus conduits, microservice nodes, and live flow.
                </p>
              </button>

              <button
                onClick={() => onSelectMode('ambient')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentMode === 'ambient'
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cyber Ambient Glow</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Pure charcoal with violet and electric cyan bottom horizon glow.
                </p>
              </button>

              <button
                onClick={() => onSelectMode('blended')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentMode === 'blended'
                    ? 'bg-violet-500/15 border-violet-400/50 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-xs font-medium">
                  <Image className="w-3.5 h-3.5 text-violet-400" />
                  <span>Blended Portrait</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Personal photo smoothly blurred into ambient gradient lighting.
                </p>
              </button>

              <button
                onClick={() => onSelectMode('cinematic')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  currentMode === 'cinematic'
                    ? 'bg-cyan-500/15 border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-xs font-medium">
                  <Image className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cinematic Scrim</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  High-contrast dark scrim overlaying the photo for high readability.
                </p>
              </button>
            </div>
          </div>

          {/* Opacity Slider for Wallpaper Modes */}
          {currentMode !== 'ambient' && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Wallpaper Opacity</span>
                <span className="text-cyan-400 font-mono">{opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={opacity}
                onChange={(e) => onOpacityChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-white/10 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-slate-500 block">
                Adjusts photo transparency beneath the dark cyber interface.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
