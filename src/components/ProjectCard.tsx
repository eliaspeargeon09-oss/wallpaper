import React from 'react';
import { ExternalLink, Globe, Gamepad2, Bot, BookOpen, Settings } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
  onConfigureLink: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpenDetails,
  onConfigureLink
}) => {
  const getIcon = () => {
    switch (project.id) {
      case 'jpwm':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'npat':
        return <Gamepad2 className="w-4 h-4 text-violet-400" />;
      case 'ai-assistant':
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case 'sunday-school':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      default:
        return <Globe className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (project.statusType) {
      case 'active':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      case 'in_dev':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
      case 'testing':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'prototype':
        return 'text-violet-400 bg-violet-950/60 border-violet-500/30';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  const handleLaunchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.url && project.url.trim().length > 0 && !project.url.startsWith('#')) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else {
      onConfigureLink(project);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(project)}
      className="p-3.5 rounded-xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/5 group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>
          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
            {project.name}
          </h4>
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${getStatusBadge()} shrink-0`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 line-clamp-2 mb-2.5 leading-relaxed">
        {project.description}
      </p>

      {/* Tech stack and Actions */}
      <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 text-slate-500 font-mono truncate mr-2">
          {project.techStack.map((tech, idx) => (
            <React.Fragment key={tech}>
              {idx > 0 && <span>·</span>}
              <span>{tech}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfigureLink(project);
            }}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded hover:bg-white/[0.05]"
            title="Configure project link"
          >
            <Settings className="w-3 h-3" />
          </button>

          <button
            onClick={handleLaunchClick}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
            title={project.url ? `Open ${project.url}` : 'Configure link'}
          >
            <span>Launch</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
