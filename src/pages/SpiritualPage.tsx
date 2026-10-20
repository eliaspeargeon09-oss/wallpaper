import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Heart, 
  Copy, 
  Check, 
  Bookmark, 
  Plus, 
  Trash2, 
  Music, 
  Users, 
  Baby, 
  Church, 
  ChevronRight,
  Layers,
  Calendar,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { 
  BibleVerse, 
  PrayerEntry, 
  SpiritualReflection, 
  BibleStudyNote, 
  MinistryActivity 
} from '../types';
import { useAuth } from '../context/AuthContext';
import {
  fetchReflectionsFromCloud,
  saveReflectionToCloud,
  deleteReflectionFromCloud,
  fetchStudyNotesFromCloud,
  saveStudyNoteToCloud,
  deleteStudyNoteFromCloud,
  fetchChurchActivitiesFromCloud,
  saveChurchActivityToCloud,
  deleteChurchActivityFromCloud,
  recordPrayerCompletionToCloud
} from '../lib/supabaseService';


// Curated authentic Bible verses (NIV / ESV)
const BIBLE_VERSES: BibleVerse[] = [
  {
    id: 'bv-1',
    reference: 'Colossians 3:23-24',
    translation: 'NIV',
    text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.',
    topic: 'Excellence & Purpose',
    reflection: 'Approach your computer science coursework, coding projects, and church responsibilities with full devotion, knowing that honest labor done in faith honors God.'
  },
  {
    id: 'bv-2',
    reference: 'Proverbs 3:5-6',
    translation: 'NIV',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    topic: 'Guidance & Discernment',
    reflection: 'When architectural challenges or semester schedules seem overwhelming, commit your plans to God with humility. Divine wisdom surpasses human intellect.'
  },
  {
    id: 'bv-3',
    reference: 'Jeremiah 29:11',
    translation: 'NIV',
    text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
    topic: 'Hope & Calling',
    reflection: 'God has prepared a specific, hopeful destiny for your life, your family, your education at GRIET, and your ministry outreach.'
  },
  {
    id: 'bv-4',
    reference: 'Philippians 4:13',
    translation: 'ESV',
    text: 'I can do all things through him who strengthens me.',
    topic: 'Inner Strength',
    reflection: 'True endurance does not come from self-reliance alone, but from the spiritual strength Christ imparts in every season of testing.'
  },
  {
    id: 'bv-5',
    reference: 'Joshua 1:9',
    translation: 'NIV',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    topic: 'Courage in Leadership',
    reflection: 'Lead Sunday School students and church youth with bold faith. The presence of God goes before you in every endeavor.'
  },
  {
    id: 'bv-6',
    reference: 'Isaiah 40:31',
    translation: 'NIV',
    text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    topic: 'Spiritual Renewal',
    reflection: 'When balancing exams, software engineering, and music rehearsals, wait patiently upon God to replenish your inner stamina.'
  },
  {
    id: 'bv-7',
    reference: 'Matthew 6:33',
    translation: 'ESV',
    text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.',
    topic: 'Right Priorities',
    reflection: 'Keep your daily devotions and relationship with Christ as the primary center; academic success and personal milestones will follow in divine order.'
  },
  {
    id: 'bv-8',
    reference: 'Psalm 119:105',
    translation: 'ESV',
    text: 'Your word is a lamp to my feet and a light to my path.',
    topic: 'God’s Guidance',
    reflection: 'Scripture illuminates practical day-to-day decisions. Ground your thoughts and ethics in God’s timeless truth.'
  }
];

// Curated daily prayers
const DAILY_PRAYERS: PrayerEntry[] = [
  {
    id: 'pr-1',
    title: 'Prayer for Wisdom and Academic Diligence',
    focus: 'Studies & Focus',
    prayer: 'Heavenly Father, grant me clarity of mind and sharp discernment as I study at GRIET. Bless my understanding of algorithms, systems, and engineering principles. Let my intellect be an instrument of service, and grant me self-discipline to steward my time wisely today. Amen.',
    prompt: 'How can I glorify God through focused study and excellence today?'
  },
  {
    id: 'pr-2',
    title: 'Prayer for Church Ministry and Sunday School',
    focus: 'Ministry & Leadership',
    prayer: 'Lord Jesus, fill my heart with patience, grace, and love as I teach Sunday school children and lead church youth. Give me creative insight to explain Scripture clearly, and let my life be a living example of faith, integrity, and warmth. Amen.',
    prompt: 'Who in Sunday School or youth fellowship can I encourage this week?'
  },
  {
    id: 'pr-3',
    title: 'Prayer for Worship and Music Ministry',
    focus: 'Worship & Music',
    prayer: 'Lord of All Glory, bless my hands as I practice the keyboard and prepare worship songs. May every melody, chord, and rhythm be played with a pure heart of worship, leading others into Your sacred presence. Amen.',
    prompt: 'Is my heart aligned in genuine worship before God today?'
  },
  {
    id: 'pr-4',
    title: 'Prayer for Family, Peace, and Protection',
    focus: 'Family & Faith',
    prayer: 'Gracious God, surround my family with Your peace and divine protection. Grant us unity of spirit, good health, and joyful hearts. Guide our steps and protect our household under Your wings. In Christ’s name, Amen.',
    prompt: 'What family blessing can I express gratitude for today?'
  }
];

// Initial starter ministry activities
const INITIAL_ACTIVITIES: MinistryActivity[] = [
  {
    id: 'act-1',
    title: 'Prepare Sunday School lesson on David & Goliath (Faith & Courage)',
    category: 'Sunday School',
    completed: true,
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'act-2',
    title: 'Plan weekly memory verse flashcards & student quiz',
    category: 'Sunday School',
    completed: false,
    createdAt: Date.now() - 86400000
  },
  {
    id: 'act-3',
    title: 'Coordinate youth fellowship discussion & prayer requests',
    category: 'Youth Ministry',
    completed: false,
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'act-4',
    title: 'Keyboard rehearsal: Chord transitions & new worship song list',
    category: 'Worship & Music',
    completed: true,
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: 'act-5',
    title: 'Review Vacation Bible School (VBS) student activity schedule',
    category: 'Church Events',
    completed: false,
    createdAt: Date.now()
  }
];

const REFLECTION_PROMPTS = [
  'What am I grateful to God for today?',
  'What did I learn from Scripture today?',
  'Where do I need more spiritual discipline?',
  'How can I serve someone in need today?',
  'What prayer request is on my heart right now?'
];

type SpiritualTab = 'reflection' | 'study' | 'activities';

export const SpiritualPage: React.FC = () => {
  const { user } = useAuth();

  // Scripture state
  const [verseIndex, setVerseIndex] = useState(0);
  const [verseCopied, setVerseCopied] = useState(false);

  // Prayer state
  const [prayerIndex, setPrayerIndex] = useState(0);
  const [hasPrayedAmen, setHasPrayedAmen] = useState(false);

  // Bottom active tab
  const [activeTab, setActiveTab] = useState<SpiritualTab>('reflection');

  // Personal reflection state
  const [reflections, setReflections] = useState<SpiritualReflection[]>(() => {
    try {
      const saved = localStorage.getItem('kes_reflections_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedPrompt, setSelectedPrompt] = useState(REFLECTION_PROMPTS[0]);
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Bible study notes state
  const [studyNotes, setStudyNotes] = useState<BibleStudyNote[]>(() => {
    try {
      const saved = localStorage.getItem('kes_study_notes_v1');
      return saved ? JSON.parse(saved) : [
        {
          id: 'sn-1',
          book: 'Colossians',
          chapter: '3',
          notes: 'Focus on setting minds on things above and doing all work with excellence as serving the Lord Christ.',
          questions: 'How can technical work in software reflect godly character?',
          application: 'Maintain integrity in all assignments, help classmates with patience, and honor commitments.',
          prayerPoints: 'Lord, give me discipline in coding and study as worship.',
          updatedAt: Date.now() - 86400000 * 3
        }
      ];
    } catch {
      return [];
    }
  });

  // Form states for study note
  const [newBook, setNewBook] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newApplication, setNewApplication] = useState('');
  const [newPrayerPoints, setNewPrayerPoints] = useState('');

  // Church activities state
  const [activities, setActivities] = useState<MinistryActivity[]>(() => {
    try {
      const saved = localStorage.getItem('kes_ministry_activities_v1');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });
  const [activityCategory, setActivityCategory] = useState<MinistryActivity['category']>('Sunday School');
  const [newActivityTitle, setNewActivityTitle] = useState('');

  // Fetch from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      fetchReflectionsFromCloud().then((cloudRefs) => {
        if (cloudRefs && cloudRefs.length > 0) setReflections(cloudRefs);
      });
      fetchStudyNotesFromCloud().then((cloudNotes) => {
        if (cloudNotes && cloudNotes.length > 0) setStudyNotes(cloudNotes);
      });
      fetchChurchActivitiesFromCloud().then((cloudActs) => {
        if (cloudActs && cloudActs.length > 0) setActivities(cloudActs);
      });
    }
  }, [user]);

  // Persistence to local storage as fallback
  useEffect(() => {
    try {
      localStorage.setItem('kes_reflections_v1', JSON.stringify(reflections));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [reflections]);

  useEffect(() => {
    try {
      localStorage.setItem('kes_study_notes_v1', JSON.stringify(studyNotes));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [studyNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('kes_ministry_activities_v1', JSON.stringify(activities));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [activities]);

  const currentVerse = BIBLE_VERSES[verseIndex];
  const currentPrayer = DAILY_PRAYERS[prayerIndex];

  const handleNextVerse = () => {
    setVerseIndex((prev) => (prev + 1) % BIBLE_VERSES.length);
    setVerseCopied(false);
  };

  const handleCopyVerse = () => {
    const textToCopy = `"${currentVerse.text}"\n— ${currentVerse.reference} (${currentVerse.translation})\n\nReflection: ${currentVerse.reflection}`;
    navigator.clipboard.writeText(textToCopy);
    setVerseCopied(true);
    setTimeout(() => setVerseCopied(false), 2000);
  };

  const handleNextPrayer = () => {
    setPrayerIndex((prev) => (prev + 1) % DAILY_PRAYERS.length);
    setHasPrayedAmen(false);
  };

  const handlePrayAmen = async () => {
    setHasPrayedAmen(true);
    if (user) {
      await recordPrayerCompletionToCloud(currentPrayer.id);
    }
  };

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    const newReflection: SpiritualReflection = {
      id: `ref_${Date.now()}`,
      date: new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      timestamp: Date.now(),
      prompt: selectedPrompt,
      content: reflectionText.trim()
    };

    setReflections([newReflection, ...reflections]);
    setReflectionText('');
    setReflectionSaved(true);
    setTimeout(() => setReflectionSaved(false), 2500);

    if (user) {
      const saved = await saveReflectionToCloud(newReflection);
      if (saved) {
        setReflections((prev) => prev.map((r) => (r.id === newReflection.id ? saved : r)));
      }
    }
  };

  const handleDeleteReflection = async (id: string) => {
    setReflections(reflections.filter((r) => r.id !== id));
    if (user) {
      await deleteReflectionFromCloud(id);
    }
  };

  const handleSaveStudyNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.trim() || !newChapter.trim() || !newNotes.trim()) return;

    const note: BibleStudyNote = {
      id: `sn_${Date.now()}`,
      book: newBook.trim(),
      chapter: newChapter.trim(),
      notes: newNotes.trim(),
      questions: '',
      application: newApplication.trim(),
      prayerPoints: newPrayerPoints.trim(),
      updatedAt: Date.now()
    };

    setStudyNotes([note, ...studyNotes]);
    setNewBook('');
    setNewChapter('');
    setNewNotes('');
    setNewApplication('');
    setNewPrayerPoints('');

    if (user) {
      const saved = await saveStudyNoteToCloud(note);
      if (saved) {
        setStudyNotes((prev) => prev.map((s) => (s.id === note.id ? saved : s)));
      }
    }
  };

  const handleDeleteStudyNote = async (id: string) => {
    setStudyNotes(studyNotes.filter((s) => s.id !== id));
    if (user) {
      await deleteStudyNoteFromCloud(id);
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const activity: MinistryActivity = {
      id: `act_${Date.now()}`,
      title: newActivityTitle.trim(),
      category: activityCategory,
      completed: false,
      createdAt: Date.now()
    };

    setActivities([activity, ...activities]);
    setNewActivityTitle('');

    if (user) {
      const saved = await saveChurchActivityToCloud(activity);
      if (saved) {
        setActivities((prev) => prev.map((a) => (a.id === activity.id ? saved : a)));
      }
    }
  };

  const handleToggleActivity = async (id: string) => {
    let updated: MinistryActivity | undefined;
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          updated = { ...a, completed: !a.completed };
          return updated;
        }
        return a;
      })
    );
    if (user && updated) {
      await saveChurchActivityToCloud(updated);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
    if (user) {
      await deleteChurchActivityFromCloud(id);
    }
  };

  const getCategoryIcon = (cat: MinistryActivity['category']) => {
    switch (cat) {
      case 'Sunday School':
        return <Baby className="w-3.5 h-3.5 text-amber-400" />;
      case 'Youth Ministry':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Worship & Music':
        return <Music className="w-3.5 h-3.5 text-violet-400" />;
      case 'Church Events':
        return <Church className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col p-3 sm:p-5 max-w-7xl mx-auto overflow-hidden select-none gap-3">
      
      {/* 1. Header (Compact) */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide leading-tight">
                Spiritual Growth & Ministry Workspace
              </h1>
              <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PERSONAL DEVOTION
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
              Katta Elia Speargeon • Walking in Faith, Excellence, and Purpose
            </p>
          </div>
        </div>


        <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300/80">
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">JPWM Ministries & GRIET CSE-G</span>
        </div>
      </div>

      {/* 2 & 3. TOP ROW: Daily Bible Verse & Daily Prayer (Side-by-side, compact viewport fit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 shrink-0 min-h-[220px] max-h-[260px]">
        
        {/* Daily Bible Verse (7 cols) */}
        <section aria-label="Daily Bible Verse" className="lg:col-span-7 glass-panel rounded-xl p-4 relative overflow-hidden flex flex-col justify-between border border-amber-500/25 shadow-lg">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentVerse.topic}
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyVerse}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy verse and reference"
                >
                  {verseCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{verseCopied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleNextVerse}
                  className="px-2 py-1 rounded-lg text-[11px] font-medium text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Next verse in local collection"
                >
                  <span>Next Verse</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Scripture Quote in Elegant Serif */}
            <blockquote className="font-serif text-sm sm:text-base text-slate-100 italic leading-snug line-clamp-3">
              "{currentVerse.text}"
            </blockquote>

            {/* Reference with Gold Accent */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <span>— {currentVerse.reference}</span>
              <span className="text-[10px] text-amber-500/70 uppercase">({currentVerse.translation})</span>
            </div>
          </div>

          {/* Short Reflection Prompt Note */}
          <div className="mt-2 pt-2 border-t border-white/[0.06] text-[11px] text-slate-400 font-sans line-clamp-1">
            <span className="text-amber-400/90 font-semibold font-mono">Reflection: </span>
            {currentVerse.reflection}
          </div>
        </section>

        {/* Daily Prayer (5 cols) */}
        <section aria-label="Daily Prayer" className="lg:col-span-5 glass-panel rounded-xl p-4 relative overflow-hidden flex flex-col justify-between border border-cyan-500/20 shadow-lg">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-semibold flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-cyan-400" />
                {currentPrayer.focus}
              </span>

              <button
                onClick={handleNextPrayer}
                className="text-[11px] text-slate-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Next prayer prompt"
              >
                <span>Rotate</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide line-clamp-1">
              {currentPrayer.title}
            </h3>

            <p className="text-xs text-slate-300 font-sans italic leading-relaxed line-clamp-3">
              "{currentPrayer.prayer}"
            </p>
          </div>

          {/* Pray / Amen Action */}
          <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono line-clamp-1 max-w-[200px]">
              {currentPrayer.prompt}
            </span>

            <button
              onClick={handlePrayAmen}
              className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                hasPrayedAmen
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
              }`}
            >
              {hasPrayedAmen ? <Check className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3" />}
              <span>{hasPrayedAmen ? 'Amen Recorded' : 'Pray / Amen'}</span>
            </button>

          </div>
        </section>

      </div>

      {/* 4, 5, 6. BOTTOM ROW: Interactive Devotional Workspace (Tabs to fit within Viewport) */}
      <div className="flex-1 min-h-0 flex flex-col glass-panel rounded-xl border border-white/[0.08] overflow-hidden">
        
        {/* Workspace Tab Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] bg-white/[0.015] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('reflection')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'reflection'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <span>Personal Reflection</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">{reflections.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('study')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'study'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <span>Bible Study Notes</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">{studyNotes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'activities'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <span>Church Activities & Ministry</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">{activities.length}</span>
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
            Local sync • Window-fit desktop
          </span>
        </div>

        {/* Tab Content Container (Scrolls internally if entries grow, parent never scrolls) */}
        <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-hidden flex flex-col">
          
          {/* TAB 1: PERSONAL REFLECTION */}
          {activeTab === 'reflection' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
              {/* Left Column: Form (5 cols) */}
              <form onSubmit={handleSaveReflection} className="lg:col-span-5 flex flex-col justify-between space-y-2 h-full">
                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Choose Reflection Prompt
                  </label>
                  <select
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400/50"
                  >
                    {REFLECTION_PROMPTS.map((p, idx) => (
                      <option key={idx} value={p} className="bg-slate-900 text-white">
                        {p}
                      </option>
                    ))}
                  </select>

                  <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-2">
                    Your Reflection
                  </label>
                  <textarea
                    rows={4}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Write your personal thoughts, insights from Scripture, and prayers..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-mono text-emerald-400">
                    {reflectionSaved ? '✓ Reflection saved locally' : ''}
                  </span>
                  <button
                    type="submit"
                    disabled={!reflectionText.trim()}
                    className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>

              {/* Right Column: List of Saved Reflections (7 cols, inner scroll) */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-4">
                <div className="flex items-center justify-between pb-1 text-xs font-mono text-slate-400">
                  <span>Saved Reflections ({reflections.length})</span>
                </div>
                
                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                  {reflections.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs font-mono">
                      <span>No reflections recorded yet. Write your first thought on the left.</span>
                    </div>
                  ) : (
                    reflections.map((ref) => (
                      <div
                        key={ref.id}
                        className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors relative group"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span className="text-cyan-300 font-semibold">{ref.date}</span>
                          <button
                            onClick={() => handleDeleteReflection(ref.id)}
                            className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-amber-300/80 font-mono mb-1">
                          Q: {ref.prompt}
                        </p>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                          {ref.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIBLE STUDY NOTES */}
          {activeTab === 'study' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
              {/* Left Column: Create Note Form (5 cols) */}
              <form onSubmit={handleSaveStudyNote} className="lg:col-span-5 flex flex-col justify-between space-y-2 h-full">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Book</label>
                      <input
                        type="text"
                        placeholder="e.g. Colossians"
                        value={newBook}
                        onChange={(e) => setNewBook(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Chapter / Verse</label>
                      <input
                        type="text"
                        placeholder="e.g. 3:1-17"
                        value={newChapter}
                        onChange={(e) => setNewChapter(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Study Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Key theological insights, theme, context..."
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Personal Application</label>
                      <input
                        type="text"
                        placeholder="Actionable takeaway"
                        value={newApplication}
                        onChange={(e) => setNewApplication(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Prayer Points</label>
                      <input
                        type="text"
                        placeholder="What to pray for"
                        value={newPrayerPoints}
                        onChange={(e) => setNewPrayerPoints(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newBook.trim() || !newChapter.trim() || !newNotes.trim()}
                    className="px-4 py-1.5 rounded-lg text-xs font-mono font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Save Study Note
                  </button>
                </div>
              </form>

              {/* Right Column: List of Study Notes (7 cols, inner scroll) */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-4">
                <div className="flex items-center justify-between pb-1 text-xs font-mono text-slate-400">
                  <span>Saved Study Notes ({studyNotes.length})</span>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                  {studyNotes.map((sn) => (
                    <div
                      key={sn.id}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors group relative"
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-bold text-amber-300">
                          {sn.book} {sn.chapter}
                        </span>
                        <button
                          onClick={() => handleDeleteStudyNote(sn.id)}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 mb-1 leading-snug">
                        {sn.notes}
                      </p>
                      {sn.application && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          <span className="text-cyan-300">Apply: </span>{sn.application}
                        </div>
                      )}
                      {sn.prayerPoints && (
                        <div className="text-[11px] text-slate-400 font-mono">
                          <span className="text-amber-400">Prayer: </span>{sn.prayerPoints}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHURCH ACTIVITIES & MINISTRY */}
          {activeTab === 'activities' && (
            <div className="flex flex-col h-full min-h-0 space-y-3">
              {/* Category selector & quick add bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(['Sunday School', 'Youth Ministry', 'Worship & Music', 'Church Events'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActivityCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activityCategory === cat
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-400/40 font-semibold'
                          : 'text-slate-400 hover:text-white bg-white/[0.02]'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>

                {/* Add new activity form */}
                <form onSubmit={handleAddActivity} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`New ${activityCategory} activity...`}
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    className="bg-white/[0.04] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400/50 w-60 sm:w-72"
                  />
                  <button
                    type="submit"
                    disabled={!newActivityTitle.trim()}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-violet-500 hover:bg-violet-400 text-slate-950 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Activities list (inner scroll) */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                {activities
                  .filter((a) => a.category === activityCategory)
                  .map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-violet-500/30 flex items-center justify-between gap-3 group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => handleToggleActivity(act.id)}
                          className="text-slate-400 hover:text-violet-400 cursor-pointer shrink-0"
                        >
                          {act.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <span className={`text-xs ${act.completed ? 'line-through text-slate-500' : 'text-slate-200'} truncate`}>
                          {act.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500">
                          {act.completed ? 'Done' : 'Active'}
                        </span>
                        <button
                          onClick={() => handleDeleteActivity(act.id)}
                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                          title="Delete activity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
