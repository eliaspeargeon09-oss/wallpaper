import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, Calendar } from 'lucide-react';

interface LiveClockProps {
  is24Hour: boolean;
  onToggleTimeFormat: () => void;
}

export const LiveClock: React.FC<LiveClockProps> = ({ is24Hour, onToggleTimeFormat }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'clock' | 'pomodoro'>('clock');
  
  // Pomodoro / Focus Timer state
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && focusSeconds > 0) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => prev - 1);
      }, 1000);
    } else if (focusSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, focusSeconds]);

  // Format time components
  let hours = time.getHours();
  let ampm = '';
  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(time.getMinutes()).padStart(2, '0');
  const secondsStr = String(time.getSeconds()).padStart(2, '0');

  // Format date
  const weekday = time.toLocaleDateString(undefined, { weekday: 'long' });
  const dateFormatted = time.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const timerMin = String(Math.floor(focusSeconds / 60)).padStart(2, '0');
  const timerSec = String(focusSeconds % 60).padStart(2, '0');

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden group">
      {/* Subtle top cyan line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Header with Mode Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            System Chrono
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('clock')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              activeTab === 'clock'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Clock
          </button>
          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
              activeTab === 'pomodoro'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Focus Sprint
          </button>
        </div>
      </div>

      {activeTab === 'clock' ? (
        <div>
          {/* Main Time Display */}
          <div className="flex items-baseline justify-center gap-1.5 py-1 my-1">
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {hoursStr}:{minutesStr}
            </span>
            <span className="text-xl sm:text-2xl font-mono font-semibold text-cyan-400/90 tabular-nums">
              :{secondsStr}
            </span>
            {!is24Hour && (
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-cyan-300 ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                {ampm}
              </span>
            )}
          </div>

          {/* Date & Location */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.06] text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300 font-medium">{weekday}</span>
              <span className="text-slate-500">·</span>
              <span>{dateFormatted}</span>
            </div>

            <button
              onClick={onToggleTimeFormat}
              className="text-[10px] text-slate-400 hover:text-cyan-300 transition-colors px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/5"
              title="Toggle 12h / 24h format"
            >
              {is24Hour ? '24H Active' : '12H Active'}
            </button>
          </div>
        </div>
      ) : (
        /* Focus Timer */
        <div className="py-1">
          <div className="flex items-center justify-center gap-2 my-1">
            <span className="text-4xl font-mono font-bold tracking-tight text-violet-300 tabular-nums">
              {timerMin}:{timerSec}
            </span>
          </div>
          <p className="text-[11px] text-center text-slate-400 mb-3">
            Deep focus sprint for study & algorithms
          </p>

          <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/[0.06]">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isTimerRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-violet-600/30 text-violet-200 hover:bg-violet-600/50 border border-violet-500/40'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setFocusSeconds(25 * 60);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.06] transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
