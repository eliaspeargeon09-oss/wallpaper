import React from 'react';
import { Layers, FolderGit2, Plus } from 'lucide-react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectPanelProps {
  projects: Project[];
  onOpenDetails: (project: Project) => void;
  onConfigureLink: (project: Project) => void;
  onAddNewProject?: () => void;
}

export const ProjectPanel: React.FC<ProjectPanelProps> = ({
  projects,
  onOpenDetails,
  onConfigureLink,
  onAddNewProject
}) => {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group flex flex-col h-[380px]">
      {/* Top subtle line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Projects & Deployments
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>{projects.length} Repositories</span>
          </div>

          {onAddNewProject && (
            <button
              onClick={onAddNewProject}
              className="text-[10px] text-cyan-300 hover:text-white transition-colors px-2 py-0.5 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 flex items-center gap-1 cursor-pointer font-mono"
            >
              <Plus className="w-3 h-3" />
              <span>Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects List or Empty State */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {projects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.015]">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-3 text-slate-500">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300 mb-1">
              No Projects Active
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Your deployment pipeline is clean. Register a new repository or application to start tracking.
            </p>
            {onAddNewProject && (
              <button
                onClick={onAddNewProject}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 flex items-center gap-1.5 transition-colors cursor-pointer font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Project</span>
              </button>
            )}
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={onOpenDetails}
              onConfigureLink={onConfigureLink}
            />
          ))
        )}
      </div>
    </div>
  );
};
