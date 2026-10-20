import React from 'react';
import { 
  Code, 
  Github, 
  Sparkles, 
  GraduationCap, 
  ExternalLink, 
  Settings2,
  Terminal,
  Compass
} from 'lucide-react';
import { QuickLinkItem } from '../types';

interface QuickLinksProps {
  links: QuickLinkItem[];
  onOpenEditModal: (link: QuickLinkItem) => void;
  onAddNewLink: () => void;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({
  links,
  onOpenEditModal,
  onAddNewLink
}) => {
  const getIcon = (iconName: QuickLinkItem['iconName']) => {
    switch (iconName) {
      case 'vscode':
        return <Code className="w-4 h-4 text-sky-400" />;
      case 'github':
        return <Github className="w-4 h-4 text-slate-200" />;
      case 'aistudio':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'study':
        return <GraduationCap className="w-4 h-4 text-violet-400" />;
      case 'terminal':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      default:
        return <Compass className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleLaunch = (url: string) => {
    if (!url) return;
    // Check if it's a protocol like vscode:// or http/https
    if (url.startsWith('http://') || url.startsWith('https://') || url.includes('://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group flex flex-col h-[220px]">
      {/* Top subtle line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Quick Hub
          </span>
        </div>

        <button
          onClick={onAddNewLink}
          className="text-[10px] text-slate-400 hover:text-cyan-300 transition-colors px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/5"
        >
          + Add Shortcut
        </button>
      </div>

      {/* Shortcut Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-0.5">
        {links.map((link) => (
          <div
            key={link.id}
            onClick={() => handleLaunch(link.url)}
            className="p-2.5 rounded-xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.07] hover:border-cyan-500/30 transition-all duration-200 cursor-pointer flex flex-col justify-between group/link relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/5">
                  {getIcon(link.iconName)}
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-200 group-hover/link:text-cyan-300 transition-colors block leading-tight">
                    {link.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[90px]">
                    {link.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditModal(link);
                  }}
                  className="opacity-0 group-hover/link:opacity-80 hover:!opacity-100 p-1 text-slate-400 hover:text-white transition-opacity"
                  title="Configure shortcut"
                >
                  <Settings2 className="w-3 h-3" />
                </button>
                <ExternalLink className="w-3 h-3 text-slate-600 group-hover/link:text-cyan-400 transition-colors" />
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span className="truncate max-w-[120px]">{link.url.replace(/^https?:\/\//, '')}</span>
              {link.shortcut && <span className="text-slate-600">{link.shortcut}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
