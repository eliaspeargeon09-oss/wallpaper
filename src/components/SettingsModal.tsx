import React from 'react';
import { X, Settings, ShieldCheck, Database, RefreshCw, Laptop, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-[#0b0e17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white font-mono">
              KES.OS Workspace Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Identity & Device Info */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold">
              <Laptop className="w-4 h-4" />
              <span>Host Node & Workstation</span>
            </div>
            <div className="space-y-1 text-slate-300 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Owner:</span>
                <span>Katta Elia Speargeon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <span>GRIET (CSE - G)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Host OS:</span>
                <span>Windows 11 Local Environment</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Version:</span>
                <span>KES.OS v2.4 (Four-Page Edition)</span>
              </div>
            </div>
          </div>

          {/* Storage & Data Integrity */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
              <Database className="w-4 h-4" />
              <span>Local Storage Persistence</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Assignments, projects, reflections, Bible study notes, and ministry tasks are securely saved in your browser's local storage.
            </p>
          </div>

          {/* Factory Reset Action */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all assignments, projects, and spiritual data to default values?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default Workspace Data</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
