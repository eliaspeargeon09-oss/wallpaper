import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Trash2, Save } from 'lucide-react';
import { QuickLinkItem } from '../types';

interface ShortcutModalProps {
  isOpen: boolean;
  link: QuickLinkItem | null;
  onClose: () => void;
  onSave: (link: QuickLinkItem) => void;
  onDelete?: (id: string) => void;
}

export const ShortcutModal: React.FC<ShortcutModalProps> = ({
  isOpen,
  link,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState<QuickLinkItem['iconName']>('custom');

  useEffect(() => {
    if (link) {
      setName(link.name);
      setUrl(link.url);
      setDescription(link.description);
      setIconName(link.iconName);
    } else {
      setName('');
      setUrl('');
      setDescription('');
      setIconName('custom');
    }
  }, [link, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    onSave({
      id: link ? link.id : `shortcut_${Date.now()}`,
      name: name.trim(),
      url: url.trim(),
      description: description.trim() || 'Custom destination',
      iconName: iconName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-[#0b0e17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              {link ? 'Configure Shortcut' : 'Add Quick Access Link'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VS Code, LeetCode, GRIET Portal"
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Destination URL or Protocol
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... or vscode://"
              required
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Icon Type
            </label>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value as QuickLinkItem['iconName'])}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400/50"
            >
              <option value="vscode">VS Code</option>
              <option value="github">GitHub</option>
              <option value="aistudio">Google AI Studio</option>
              <option value="study">Study / University</option>
              <option value="terminal">Terminal / System</option>
              <option value="custom">General Web</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Brief Subtitle
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Code Editor, Repository, AI Tools"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {link && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(link.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
