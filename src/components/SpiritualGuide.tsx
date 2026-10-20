import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  Copy, 
  Check, 
  RefreshCw, 
  Sun,
  Flame,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface ScriptureItem {
  id: string;
  reference: string;
  text: string;
  topic: string;
  prayer: string;
}

const DAILY_SCRIPTURES: ScriptureItem[] = [
  {
    id: 'scrip-1',
    reference: 'Colossians 3:23-24',
    text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.',
    topic: 'Excellence & Purpose',
    prayer: 'Lord, bless every line of code I write, every algorithm I study at GRIET, and every task I undertake today. May my education and work bring glory to Your name and serve others with integrity and diligence. Amen.'
  },
  {
    id: 'scrip-2',
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    topic: 'Guidance & Trust',
    prayer: 'Heavenly Father, guide my thoughts, decisions, and future plans. When problems seem complex or paths uncertain, grant me divine discernment and steady peace, knowing You order every step. Amen.'
  },
  {
    id: 'scrip-3',
    reference: 'Jeremiah 29:11',
    text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
    topic: 'Hope & Calling',
    prayer: 'Gracious God, thank You for the destiny and purposeful calling You have laid out for me. Strengthen my resolve in CSE-G studies and in building solutions that impact lives for Your kingdom. Amen.'
  },
  {
    id: 'scrip-4',
    reference: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
    topic: 'Inner Strength',
    prayer: 'Lord Jesus, when fatigue or tight deadlines press upon me, infuse my spirit with Your supernatural resilience. Let Your strength be magnified in my weakness as I tackle every challenge today. Amen.'
  },
  {
    id: 'scrip-5',
    reference: 'Joshua 1:9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    topic: 'Courage & Faith',
    prayer: 'Almighty God, cast out all fear and self-doubt. Empower me with fearless confidence to lead in Sunday School, build bold innovative projects, and stand firm in faith wherever I go. Amen.'
  },
  {
    id: 'scrip-6',
    reference: 'Isaiah 40:31',
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    topic: 'Renewal & Endurance',
    prayer: 'Father, renew my physical and mental energy today. Keep my passion ignited for learning, software architecture, and ministry outreach. Elevate my vision higher than immediate circumstances. Amen.'
  },
  {
    id: 'scrip-7',
    reference: 'Matthew 6:33',
    text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.',
    topic: 'Priority & Devotion',
    prayer: 'Lord, help me align my priorities rightly today. Above academic scores and technical achievements, may seeking Your presence and Your righteousness always take first place in my heart. Amen.'
  }
];

export const SpiritualGuide: React.FC = () => {
  // Compute daily index based on current date
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    return dayOfYear % DAILY_SCRIPTURES.length;
  });

  const [copied, setCopied] = useState(false);
  const [prayedAmen, setPrayedAmen] = useState(false);

  const currentItem = DAILY_SCRIPTURES[currentIndex];

  const handleNextScripture = () => {
    setCurrentIndex((prev) => (prev + 1) % DAILY_SCRIPTURES.length);
    setPrayedAmen(false);
    setCopied(false);
  };

  const handleCopy = () => {
    const content = `"${currentItem.text}"\n— ${currentItem.reference}\n\nPrayer:\n${currentItem.prayer}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden group border border-amber-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Top subtle golden/amber light beam */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

      {/* Atmospheric warm ambient glow behind scripture */}
      <div 
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-[480px] h-[240px] pointer-events-none -z-10 rounded-full blur-[100px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 70%)',
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">
                Spiritual Guide & Daily Devotional
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                DAILY SCRIPTURE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Katta Elia Speargeon • Walking in Faith, Excellence, and Purpose
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy scripture and prayer to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleNextScripture}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Read next inspiring scripture"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Next Verse</span>
          </button>
        </div>
      </div>

      {/* Main Content: 2-Column Grid for Scripture and Prayer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card (7 cols): Today's Scripture */}
        <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] relative group/verse">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentItem.topic}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Holy Bible</span>
            </div>

            {/* Scripture Verse Quote */}
            <div className="relative pt-1">
              <span className="text-4xl text-amber-400/20 font-serif leading-none absolute -top-3 -left-2 select-none">“</span>
              <p className="text-base sm:text-lg text-slate-100 font-serif italic leading-relaxed pl-4 pr-1 tracking-wide">
                {currentItem.text}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-sm sm:text-base font-bold text-amber-300 font-mono tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              {currentItem.reference}
            </span>
            <span className="text-[11px] font-mono text-slate-500">JPWM Daily Word</span>
          </div>
        </div>

        {/* Right Card (5 cols): Today's Prayer */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-amber-500/[0.06] to-transparent border border-amber-500/20 relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                A Personal Prayer
              </span>
              <span className="text-[10px] font-mono text-slate-500">Devotional Walk</span>
            </div>

            {/* Prayer Content */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-normal">
              {currentItem.prayer}
            </p>
          </div>

          {/* Prayer Commitment Button */}
          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => setPrayedAmen(!prayedAmen)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                prayedAmen
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
              }`}
            >
              {prayedAmen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5 text-amber-400" />}
              <span>{prayedAmen ? 'Prayed · Amen 🙏' : 'Pray & Affirm (Amen)'}</span>
            </button>

            <span className="text-[11px] font-mono text-slate-500">
              GRIET CSE-G
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
