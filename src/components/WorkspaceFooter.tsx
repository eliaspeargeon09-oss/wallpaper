import React from 'react';
import { Cpu, CheckCircle, FolderGit2 } from 'lucide-react';

interface WorkspaceFooterProps {
  completedTasks: number;
  totalTasks: number;
  projectCount: number;
}

export const WorkspaceFooter: React.FC<WorkspaceFooterProps> = ({
  completedTasks,
  totalTasks,
  projectCount
}) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  return (
    <footer className="w-full px-4 sm:px-8 py-3 backdrop-blur-md bg-[#06080e]/40 border-t border-white/[0.05] mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        {/* Progress & Project stats */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Daily Sprint: <strong className="text-white font-medium">{completedTasks}/{totalTasks}</strong> ({percentage}%)
            </span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1.5 text-slate-300">
            <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
            <span>
              <strong className="text-white font-medium">{projectCount}</strong> Active Projects
            </span>
          </div>
        </div>

        {/* Productivity message */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 text-center">
          <Cpu className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
          <span>Building high-impact software from GRIET CSE-G • Keep pushing</span>
        </div>

        {/* Windows 11 Workspace Tag */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500">
          <span>Katta Elia Speargeon</span>
          <span>·</span>
          <span>Personal Desktop Node</span>
        </div>
      </div>
    </footer>
  );
};
