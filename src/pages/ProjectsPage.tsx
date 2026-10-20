import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  Github, 
  Plus, 
  Search, 
  Layers, 
  Edit3, 
  Trash2, 
  Globe, 
  Gamepad2,
  Cpu,
  Monitor,
  GraduationCap
} from 'lucide-react';
import { Project } from '../types';
import { ProjectModal } from '../components/ProjectModal';
import { useAuth } from '../context/AuthContext';
import { 
  fetchProjectsFromCloud, 
  saveProjectToCloud, 
  deleteProjectFromCloud 
} from '../lib/supabaseService';

// Source of truth for Katta Elia Speargeon's 5 known projects
export const KNOWN_PROJECTS: Project[] = [
  {
    id: 'proj_jpwm',
    name: 'JPWM Ministries Website',
    description: 'Official web portal for Jesus Praise and Worship Ministries featuring church information, sermon broadcasts, devotionals, photo gallery, worship resources, and live outreach updates.',
    category: 'Ministry',
    status: 'Live / Active',
    statusType: 'active',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    url: 'https://jpwm.org',
    githubUrl: ''
  },
  {
    id: 'proj_npat',
    name: 'NPAT Multiplayer Word Game',
    description: 'Competitive real-time Name, Place, Animal, Thing multiplayer game with custom room codes, public/private lobbies, timed countdown rounds, trie dictionary validation, and live scoreboards.',
    category: 'Game',
    status: 'In Development',
    statusType: 'in_dev',
    techStack: ['WebSockets', 'Node.js', 'HTML5 Canvas'],
    url: '',
    githubUrl: ''
  },
  {
    id: 'proj_sunday_school',
    name: 'Sunday School Management App',
    description: 'Educator and church companion app for managing student attendance, weekly scripture memory verse milestones, points leaderboards, curriculum schedules, and parent SMS alerts.',
    category: 'Church EdTech',
    status: 'Testing v1.2',
    statusType: 'testing',
    techStack: ['React', 'PWA', 'Local Storage'],
    url: '',
    githubUrl: ''
  },
  {
    id: 'proj_ai_assistant',
    name: 'Personal AI Assistant',
    description: 'Autonomous desktop assistant integrated with Gemini models for rapid coding guidance, academic paper summarization, and daily workflow automation.',
    category: 'AI & Automation',
    status: 'Active Prototype',
    statusType: 'prototype',
    techStack: ['Gemini API', 'TypeScript', 'Node.js'],
    url: '',
    githubUrl: ''
  },
  {
    id: 'proj_kes_os',
    name: 'KES.OS Personal Workspace',
    description: 'Personalized desktop environment uniting personal identity, spiritual growth, software development, college coursework, and productivity in a cyber-inspired workspace.',
    category: 'Personal Workspace',
    status: 'Active v2.0',
    statusType: 'active',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    url: 'http://localhost:3000',
    githubUrl: ''
  }
];

export const ProjectsPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('kes_known_projects_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return KNOWN_PROJECTS;
    } catch {
      return KNOWN_PROJECTS;
    }
  });

  const [isLoadingCloud, setIsLoadingCloud] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      setIsLoadingCloud(true);
      fetchProjectsFromCloud().then((cloudProjects) => {
        if (cloudProjects && cloudProjects.length > 0) {
          setProjects(cloudProjects);
        }
        setIsLoadingCloud(false);
      });
    }
  }, [user]);

  // Sync to local storage as fallback
  useEffect(() => {
    try {
      localStorage.setItem('kes_known_projects_v2', JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [projects]);

  const handleUpdateProject = async (updated: Project) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === updated.id);
      if (exists) {
        return prev.map((p) => (p.id === updated.id ? updated : p));
      }
      return [updated, ...prev];
    });

    if (user) {
      const saved = await saveProjectToCloud(updated);
      if (saved) {
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? saved : p)));
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this project?')) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (user) {
        await deleteProjectFromCloud(id);
      }
    }
  };


  const handleAddNew = () => {
    setSelectedProject({
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      category: 'General',
      status: 'In Development',
      statusType: 'in_dev',
      techStack: ['TypeScript', 'React'],
      url: '',
      githubUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const getStatusBadge = (statusType: Project['statusType'], statusText: string) => {
    switch (statusType) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {statusText}
          </span>
        );
      case 'in_dev':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {statusText}
          </span>
        );
      case 'testing':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {statusText}
          </span>
        );
      case 'prototype':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-violet-500/15 text-violet-300 border border-violet-500/30">
            {statusText}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-slate-300">
            {statusText}
          </span>
        );
    }
  };

  const getCategoryIcon = (category: Project['category']) => {
    switch (category) {
      case 'Ministry':
        return <Globe className="w-3.5 h-3.5 text-amber-400" />;
      case 'Game':
        return <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Church EdTech':
        return <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'AI & Automation':
        return <Cpu className="w-3.5 h-3.5 text-violet-400" />;
      case 'Personal Workspace':
        return <Monitor className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const categories = ['All', 'Ministry', 'Game', 'Church EdTech', 'AI & Automation', 'Personal Workspace'];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-3 sm:p-5 max-w-7xl mx-auto overflow-hidden select-none gap-3">
      
      {/* 1. Header (Compact) */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                Projects & Software Engineering
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {projects.length} REPOSITORIES
              </span>
              {user ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cloud Synced
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                  Local Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Personal portfolio of ministry platforms, multiplayer game engines, edtech tools, and AI workflows.
            </p>
          </div>
        </div>


        <button
          onClick={handleAddNew}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* 2. Search and Category Filter Strip (Compact) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white/[0.02] p-2 rounded-xl border border-white/5 shrink-0">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Projects Grid (Inner scrollable container; viewport never scrolls) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        {filteredProjects.length === 0 ? (
          <div className="h-full min-h-[200px] rounded-xl border border-dashed border-white/10 bg-white/[0.015] text-center flex flex-col items-center justify-center p-6">
            <FolderGit2 className="w-8 h-8 text-slate-600 mb-2" />
            <h3 className="text-xs font-semibold text-slate-300 mb-1">No Projects Found</h3>
            <p className="text-[11px] text-slate-500 max-w-sm mb-3">
              No projects match your current search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-white/[0.04] text-slate-300 hover:text-white border border-white/10 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-panel glass-panel-hover rounded-xl p-3.5 relative overflow-hidden flex flex-col justify-between group/card border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-200 shadow-md"
              >
                <div className="space-y-2">
                  {/* Top Row: Category Icon & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/5">
                        {getCategoryIcon(project.category)}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {project.category}
                      </span>
                    </div>

                    {getStatusBadge(project.statusType, project.status)}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-sm font-bold text-white group-hover/card:text-cyan-300 transition-colors line-clamp-1">
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack Chips */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/[0.03] border border-white/5 text-slate-400 group-hover/card:text-cyan-200/80 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Launch, Edit, Delete */}
                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  {/* External links */}
                  <div className="flex items-center gap-1.5">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 text-[11px] transition-colors"
                        title={`Open ${project.name}`}
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Launch</span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-md text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
                        title="GitHub Repository"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Management buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
                      title="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdateProject={handleUpdateProject}
        />
      )}

    </div>
  );
};
