/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { AmbientBackground } from './components/AmbientBackground';
import { HomePage } from './pages/HomePage';
import { SpiritualPage } from './pages/SpiritualPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { PageId } from './types';

function AppContent() {
  // Navigation state: 'home' | 'spiritual' | 'projects' | 'assignments'
  const [activePage, setActivePage] = useState<PageId>('home');
  
  // Focus Mode state (only applicable on Home page)
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Settings Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Auth / Cloud Sync Modal state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const handleResetData = () => {
    localStorage.removeItem('kes_known_projects_v2');
    localStorage.removeItem('kes_assignments_v2');
    localStorage.removeItem('kes_assignment_notes_v2');
    localStorage.removeItem('kes_reflections_v1');
    localStorage.removeItem('kes_study_notes_v1');
    localStorage.removeItem('kes_ministry_activities_v1');
    window.location.reload();
  };


  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden flex flex-col justify-between selection:bg-cyan-500/25 selection:text-cyan-200 bg-[#06080e]">
      
      {/* Visual Ambient Background with subtle cyber grid, geometric lines, and soft cyan-violet glow */}
      <AmbientBackground opacity={100} />

      {/* Top Navigation Bar (Hidden only in Minimalist Focus Mode on Home page) */}
      {!isFocusMode && (
        <Navigation
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setIsFocusMode(false);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {/* Main Single-Page Content Area — Exactly One Page Rendered at a Time, Viewport Fixed */}
      <main className="flex-1 min-h-0 w-full overflow-hidden relative flex flex-col">
        {activePage === 'home' && (
          <HomePage
            isFocusMode={isFocusMode}
            onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
            onExitFocusMode={() => setIsFocusMode(false)}
          />
        )}

        {activePage === 'spiritual' && (
          <SpiritualPage />
        )}

        {activePage === 'projects' && (
          <ProjectsPage />
        )}

        {activePage === 'assignments' && (
          <AssignmentsPage />
        )}
      </main>

      {/* Workspace Ultra-Slim Desktop Status Bar (Visible when not in focus mode) */}
      {!isFocusMode && (
        <footer className="h-6 shrink-0 w-full px-4 sm:px-6 border-t border-white/[0.05] bg-[#06080e]/80 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-slate-500 z-30 select-none">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-bold">KES.OS</span>
            <span>•</span>
            <span className="hidden sm:inline">Katta Elia Speargeon</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-cyan-400/80">GRIET CSE - G</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="tracking-wider uppercase text-[10px] text-slate-400">Windows 11 Desktop Workspace</span>
            <span className="text-cyan-500">•</span>
            <span className="text-emerald-400 font-medium">PROTECTED</span>
          </div>
        </footer>
      )}

      {/* Workspace Settings Dialog */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetData={handleResetData}
      />

      {/* Supabase Authentication & Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


