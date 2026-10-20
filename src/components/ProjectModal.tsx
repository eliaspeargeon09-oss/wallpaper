import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Globe, Save } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdateProject
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (project) {
      setName(project.name || '');
      setUrl(project.url || '');
      setGithubUrl(project.githubUrl || '');
      setDescription(project.description || '');
      setStatus(project.status || 'Active');
      setTechInput((project.techStack || []).join(', '));
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onUpdateProject({
      ...project,
      name: name.trim(),
      url: url.trim(),
      githubUrl: githubUrl.trim(),
      description: description.trim(),
      status: status.trim() || 'Active',
      techStack: techArray.length ? techArray : ['Web']
    });
    onClose();
  };

  const handleLaunch = () => {
    if (url.trim()) {
      window.open(url.trim(), '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-lg bg-[#0b0e17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">
              {project.name ? `Project: ${project.name}` : 'New Project Deployment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-3.5">
          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NPAT Multiplayer or JPWM Portal"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Tech Stack (Comma-separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, WebSocket, Tailwind"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Live Deployment URL (Launch Destination)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-domain.com or localhost:3000"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
              />
              {url.trim() && (
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="px-3 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium hover:bg-cyan-500/30 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test</span>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              GitHub Repository URL (Optional)
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/your-username/repo"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Status Tag
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="e.g. Active, In Development, Testing v1.0"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              Project Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 resize-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
