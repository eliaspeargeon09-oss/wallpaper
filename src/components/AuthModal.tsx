import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  LogOut, 
  Cloud, 
  Check, 
  AlertCircle, 
  Database,
  ArrowRight,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { migrateLocalStorageToCloud, MigrationReport } from '../lib/supabaseService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataMigrated?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  onDataMigrated
}) => {
  const { user, isConfigured, signIn, signUp, signOut } = useAuth();
  
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('Katta Elia Speargeon');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Migration state
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationReport, setMigrationReport] = useState<MigrationReport | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (isSignUpMode) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Account created successfully! You are now authenticated.');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error);
        } else {
          setSuccessMsg('Signed in successfully!');
          setTimeout(() => {
            setSuccessMsg(null);
          }, 1500);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunMigration = async () => {
    if (!user) return;
    setIsMigrating(true);
    setErrorMsg(null);

    try {
      const report = await migrateLocalStorageToCloud(user.id);
      setMigrationReport(report);
      if (onDataMigrated) onDataMigrated();
    } catch (err: any) {
      setErrorMsg(`Migration error: ${err?.message || err}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      <div 
        className="glass-panel w-full max-w-md rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] relative overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide font-mono flex items-center gap-2">
                <span>KES.OS</span>
                <span className="text-cyan-400">Cloud Sync</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Supabase PostgreSQL • RLS Protected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice if configuration is missing */}
        {!isConfigured && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Supabase Credentials Pending</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              To connect your live cloud database, add your Supabase URL and Publishable/Anon key to your <code className="text-amber-300">.env</code> file:
            </p>
            <div className="p-2 rounded bg-black/50 text-[10px] text-cyan-300 font-mono overflow-x-auto">
              VITE_SUPABASE_URL="https://your-id.supabase.co"<br />
              VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              KES.OS will seamlessly continue using your local encrypted storage until cloud credentials are provided.
            </p>
          </div>
        )}

        {/* Content for Logged-In User */}
        {user ? (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Authenticated User</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Connected
                </span>
              </div>
              <div className="text-sm font-bold text-white font-mono break-all">
                {user.email}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                UID: {user.id}
              </div>
            </div>

            {/* Cloud Data Migration Utility */}
            <div className="p-3.5 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local Storage ➔ Cloud Sync</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Safely copy your local projects, assignments, church activities, and spiritual reflections to your Supabase PostgreSQL cloud database.
              </p>

              <button
                onClick={handleRunMigration}
                disabled={isMigrating}
                className="w-full py-2 rounded-xl text-xs font-mono font-semibold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>{isMigrating ? 'Migrating Data to Cloud...' : 'Sync Local Data to Supabase'}</span>
              </button>

              {migrationReport && (
                <div className="p-2.5 rounded-lg bg-black/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Migration Completed Successfully:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-300 pt-1">
                    <span>Projects: {migrationReport.projectsMigrated}</span>
                    <span>Assignments: {migrationReport.assignmentsMigrated}</span>
                    <span>Activities: {migrationReport.activitiesMigrated}</span>
                    <span>Reflections: {migrationReport.reflectionsMigrated}</span>
                    <span>Study Notes: {migrationReport.studyNotesMigrated}</span>
                    <span>Notes: {migrationReport.notesMigrated ? '✓ Yes' : '—'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sign Out Button */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-xs font-mono text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {isSignUpMode && (
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400/50 font-sans"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="developer@griet.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400/50 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400/50 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isConfigured}
              className="w-full mt-2 py-2.5 rounded-xl text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {isSignUpMode ? <UserPlus className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              <span>{isSubmitting ? 'Authenticating...' : isSignUpMode ? 'Create Personal Account' : 'Sign In to KES.OS'}</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setErrorMsg(null);
                }}
                className="text-cyan-400 hover:underline"
              >
                {isSignUpMode ? 'Already have an account? Sign In' : "First time? Create account"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-500 hover:text-white"
              >
                Continue Offline
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
