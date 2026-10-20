import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  HardDrive, 
  Zap, 
  Terminal, 
  Activity, 
  Layers, 
  GitBranch, 
  Play, 
  Pause, 
  Maximize2, 
  Info,
  Server,
  Radio,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ArchitectureNode } from '../types';

interface SystemArchitectureWallpaperProps {
  opacity?: number;
  interactive?: boolean;
  onSelectNode?: (node: ArchitectureNode) => void;
  className?: string;
  isBackground?: boolean;
}

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  // Tier 1: Clients & Ingress
  {
    id: 'cli-griet',
    name: 'GRIET CSE-G Workstation',
    category: 'client',
    roleTag: 'Host Node',
    port: ':3000',
    status: 'active',
    tech: ['Windows 11', 'VS Code', 'Node.js'],
    latency: '1ms',
    throughput: '320 req/s',
    description: 'Primary local development host and workstation for GRIET Computer Science coursework and project builds.',
    metrics: [
      { label: 'Host OS', value: 'Windows 11 Pro' },
      { label: 'Subsystem', value: 'PowerShell / POSIX' },
      { label: 'Node Status', value: 'Active Master' }
    ]
  },
  {
    id: 'cli-npat',
    name: 'NPAT Player Clients',
    category: 'client',
    roleTag: 'Game Ingress',
    port: 'WSS',
    status: 'active',
    tech: ['WebSockets', 'HTML5 Canvas', 'Lobby State'],
    latency: '18ms',
    throughput: '450 msg/s',
    description: 'Real-time multiplayer client connections participating in live word anagram matches and leaderboard updates.',
    metrics: [
      { label: 'Protocol', value: 'Binary WebSocket' },
      { label: 'Room Latency', value: '< 20ms' },
      { label: 'Active Sockets', value: '64 Concurrent' }
    ]
  },
  {
    id: 'cli-jpwm',
    name: 'JPWM Global Portal',
    category: 'client',
    roleTag: 'Web Outreach',
    port: 'HTTPS',
    status: 'synced',
    tech: ['React 19', 'Tailwind CSS', 'Vite CDN'],
    latency: '24ms',
    throughput: '1.2k req/s',
    description: 'Public-facing responsive web application serving sermon broadcasts, daily devotionals, and ministry content.',
    metrics: [
      { label: 'CDN Edge', value: 'Cloudflare Tier 1' },
      { label: 'Uptime', value: '99.98%' },
      { label: 'Asset Cache', value: '98.4% Hit' }
    ]
  },
  {
    id: 'cli-sunday',
    name: 'Sunday School Mobile PWA',
    category: 'client',
    roleTag: 'Teacher App',
    port: 'PWA',
    status: 'active',
    tech: ['PWA', 'Local Cache', 'Service Worker'],
    latency: '12ms',
    throughput: '85 sync/m',
    description: 'Educator mobile dashboard for offline attendance recording, weekly scripture memory marks, and parent notifications.',
    metrics: [
      { label: 'Storage', value: 'IndexedDB Offline' },
      { label: 'Sync State', value: 'Background Queue' },
      { label: 'Platform', value: 'Cross-Device' }
    ]
  },

  // Tier 2: Edge & Security Gateways
  {
    id: 'gw-reverse-proxy',
    name: 'Unified API Gateway',
    category: 'gateway',
    roleTag: 'Traffic Router',
    port: ':443 / :8080',
    status: 'routing',
    tech: ['Reverse Proxy', 'JWT Auth', 'Rate Limiter'],
    latency: '3ms',
    throughput: '2.4k req/s',
    description: 'Secures inbound traffic, terminates TLS/SSL, validates JWT auth tokens, and intelligently routes service endpoints.',
    metrics: [
      { label: 'TLS Level', value: 'TLS 1.3 Strict' },
      { label: 'DDoS Guard', value: 'Active Mitigation' },
      { label: 'Load Balancer', value: 'Least-Connection' }
    ]
  },
  {
    id: 'gw-websocket',
    name: 'Real-time WebSocket Broker',
    category: 'gateway',
    roleTag: 'Event Hub',
    port: ':3001',
    status: 'routing',
    tech: ['Socket.io Engine', 'Heartbeat', 'Channel Mux'],
    latency: '4ms',
    throughput: '890 evt/s',
    description: 'Manages bidirectional event loops, connection keepalives, and room broadcast multiplexing for multiplayer sync.',
    metrics: [
      { label: 'Event Mesh', value: 'Pub/Sub Channel' },
      { label: 'Heartbeat', value: '15s Interval' },
      { label: 'Buffer Drop', value: '0.00%' }
    ]
  },

  // Tier 3: Core Microservices & Intelligence
  {
    id: 'srv-ai',
    name: 'Personal AI Assistant Core',
    category: 'service',
    roleTag: 'Intelligence',
    port: ':5050',
    status: 'healthy',
    tech: ['Google Gemini 2.0', 'TypeScript', 'Prompt Engine'],
    latency: '180ms',
    throughput: '12 tokens/s',
    description: 'Autonomous AI engine leveraging Gemini for real-time coding guidance, academic task analysis, and workflow automation.',
    metrics: [
      { label: 'Model', value: 'Gemini 2.0 Flash' },
      { label: 'Context Window', value: '1M Tokens' },
      { label: 'Stream Type', value: 'Server-Sent Events' }
    ]
  },
  {
    id: 'srv-npat',
    name: 'NPAT Game State Engine',
    category: 'service',
    roleTag: 'Game Daemon',
    port: ':4000',
    status: 'healthy',
    tech: ['Node.js', 'Dictionary Trie', 'Matchmaker'],
    latency: '8ms',
    throughput: '340 calc/s',
    description: 'Deterministic word lookup engine with rapid trie dictionary validation, live lobby countdowns, and scoreboard calculation.',
    metrics: [
      { label: 'Dictionary', value: '180k Lexicon Trie' },
      { label: 'Matchmaking', value: 'Elo Tier Queues' },
      { label: 'Tick Rate', value: '60 Hz' }
    ]
  },
  {
    id: 'srv-jpwm',
    name: 'JPWM Media & CMS Service',
    category: 'service',
    roleTag: 'Content Engine',
    port: ':4010',
    status: 'healthy',
    tech: ['Express REST', 'HLS Stream', 'Scripture DB'],
    latency: '15ms',
    throughput: '180 req/s',
    description: 'Content delivery pipelines for sermons, video broadcasts, scripture references, and community prayer requests.',
    metrics: [
      { label: 'Transcoder', value: 'Adaptive HLS' },
      { label: 'CMS Cache', value: 'In-Memory Hot' },
      { label: 'Bible API', value: 'Direct Concordance' }
    ]
  },
  {
    id: 'srv-sunday',
    name: 'Sunday School Management Core',
    category: 'service',
    roleTag: 'Admin Service',
    port: ':4020',
    status: 'healthy',
    tech: ['TypeScript', 'SMS Gateway', 'Curriculum Hub'],
    latency: '12ms',
    throughput: '45 ops/s',
    description: 'Maintains student rosters, lesson milestone trackers, teacher schedules, and parent SMS reminder dispatches.',
    metrics: [
      { label: 'SMS Dispatch', value: 'Twilio / FastSMS' },
      { label: 'Roster State', value: 'Class Partitioned' },
      { label: 'Report Gen', value: 'Weekly PDF/CSV' }
    ]
  },

  // Tier 4: Data & Persistence Fabric
  {
    id: 'data-redis',
    name: 'Redis In-Memory State Cache',
    category: 'storage',
    roleTag: 'Fast Memory',
    port: ':6379',
    status: 'synced',
    tech: ['Redis v7', 'Key-Value', 'Pub/Sub Broker'],
    latency: '1.2ms',
    throughput: '4.8k ops/s',
    description: 'Sub-millisecond latency cache storing live multiplayer game lobbies, temporary tokens, and session states.',
    metrics: [
      { label: 'Memory Used', value: '42.8 MB' },
      { label: 'Hit Rate', value: '99.4%' },
      { label: 'Eviction', value: 'volatile-lru' }
    ]
  },
  {
    id: 'data-postgres',
    name: 'PostgreSQL Relational DB',
    category: 'storage',
    roleTag: 'Master Store',
    port: ':5432',
    status: 'synced',
    tech: ['PostgreSQL 16', 'ACID Compliant', 'JSONB'],
    latency: '4.5ms',
    throughput: '420 queries/s',
    description: 'Primary durable relational storage storing user credentials, attendance history, sermon logs, and system audit trails.',
    metrics: [
      { label: 'Connections', value: '18 / 100 Pool' },
      { label: 'WAL Mode', value: 'Continuous Replica' },
      { label: 'Disk IOPS', value: 'Optimal' }
    ]
  },
  {
    id: 'data-vector',
    name: 'Vector Knowledge Store',
    category: 'storage',
    roleTag: 'AI Embeddings',
    port: ':8000',
    status: 'synced',
    tech: ['Vector DB', 'Cosine Similarity', 'RAG Store'],
    latency: '22ms',
    throughput: '65 search/s',
    description: 'High-dimensional vector embeddings supporting the Personal AI Assistant for semantic retrieval and code search.',
    metrics: [
      { label: 'Dimension', value: '1536 Float' },
      { label: 'Index Type', value: 'HNSW Graph' },
      { label: 'Items', value: '14,200 Embeddings' }
    ]
  },

  // Tier 5: DevOps & Telemetry
  {
    id: 'ops-cicd',
    name: 'GitHub Actions CI/CD Pipeline',
    category: 'devops',
    roleTag: 'Continuous Delivery',
    port: 'Webhook',
    status: 'active',
    tech: ['GitHub Actions', 'Vite Build', 'ESLint'],
    latency: '34s build',
    throughput: 'Auto-Trigger',
    description: 'Automated testing, bundle minimization, linting verification, and production edge deployment for all projects.',
    metrics: [
      { label: 'Last Build', value: 'Success (32s)' },
      { label: 'Test Pass', value: '100% Green' },
      { label: 'Branch', value: 'main' }
    ]
  },
  {
    id: 'ops-telemetry',
    name: 'Prometheus & Host Telemetry',
    category: 'devops',
    roleTag: 'System Monitor',
    port: ':9090',
    status: 'active',
    tech: ['Prometheus', 'Grafana Matrix', 'Health Probes'],
    latency: '10s scrape',
    throughput: '120 metrics/s',
    description: 'Continuous health telemetry observing host CPU, memory usage, network socket health, and microservice status.',
    metrics: [
      { label: 'Host CPU', value: '14% Steady' },
      { label: 'Host RAM', value: '6.4 GB / 16 GB' },
      { label: 'System Uptime', value: '99.98%' }
    ]
  }
];

export const SystemArchitectureWallpaper: React.FC<SystemArchitectureWallpaperProps> = ({
  opacity = 100,
  interactive = false,
  onSelectNode,
  className = '',
  isBackground = false
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(ARCHITECTURE_NODES[0]);
  const [isFlowPlaying, setIsFlowPlaying] = useState(true);
  const [showMetricsOverlay, setShowMetricsOverlay] = useState(true);

  const getCategoryColor = (cat: ArchitectureNode['category']) => {
    switch (cat) {
      case 'client':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          bg: 'bg-cyan-950/30',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]'
        };
      case 'gateway':
        return {
          border: 'border-blue-500/40 hover:border-blue-400',
          bg: 'bg-blue-950/30',
          text: 'text-blue-400',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]'
        };
      case 'service':
        return {
          border: 'border-violet-500/40 hover:border-violet-400',
          bg: 'bg-violet-950/30',
          text: 'text-violet-400',
          badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
          glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]'
        };
      case 'storage':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          bg: 'bg-emerald-950/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]'
        };
      case 'devops':
      default:
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          bg: 'bg-amber-950/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]'
        };
    }
  };

  const filteredNodes = ARCHITECTURE_NODES.filter((node) => {
    if (activeFilter === 'all') return true;
    return node.category === activeFilter;
  });

  const handleNodeClick = (node: ArchitectureNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  return (
    <div 
      className={`relative w-full h-full select-none overflow-hidden ${className}`}
      style={{ opacity: opacity / 100 }}
    >
      {/* High-Tech Circuit Board Vector Grid Background */}
      <div className="absolute inset-0 bg-[#06080e]" />

      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Diagonal Architecture Bus Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="busGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="busGradViolet" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Major Orthogonal Bus Conduits */}
        <path d="M 0 120 L 400 120 L 520 240 L 1600 240" fill="none" stroke="url(#busGradCyan)" strokeWidth="1.5" strokeDasharray="6 4" />
        <path d="M 0 380 L 350 380 L 480 460 L 1600 460" fill="none" stroke="url(#busGradCyan)" strokeWidth="1" strokeDasharray="4 6" />
        <path d="M 0 600 L 450 600 L 600 520 L 1600 520" fill="none" stroke="url(#busGradViolet)" strokeWidth="1.5" strokeDasharray="8 6" />
        <path d="M 300 0 L 300 800" fill="none" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="1" />
        <path d="M 680 0 L 680 800" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="1" />
        <path d="M 1060 0 L 1060 800" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" />

        {/* Animated Traveling Data Packets along Conduits */}
        {isFlowPlaying && (
          <>
            <circle r="3.5" fill="#22d3ee" filter="url(#neonGlow)">
              <animateMotion
                path="M 0 120 L 400 120 L 520 240 L 1600 240"
                dur="7s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3" fill="#a855f7" filter="url(#neonGlow)">
              <animateMotion
                path="M 0 600 L 450 600 L 600 520 L 1600 520"
                dur="8.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2.5" fill="#38bdf8" filter="url(#neonGlow)">
              <animateMotion
                path="M 0 380 L 350 380 L 480 460 L 1600 460"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3" fill="#34d399" filter="url(#neonGlow)">
              <animateMotion
                path="M 300 50 L 300 750"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3" fill="#a78bfa" filter="url(#neonGlow)">
              <animateMotion
                path="M 680 50 L 680 750"
                dur="6.5s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>

      {/* Atmospheric Ambient Radial Nebulae */}
      <div 
        className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[45vw] h-[45vw] rounded-full blur-[150px] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)' }}
      />

      {/* Architectural Wallpaper Content */}
      <div className="relative z-10 w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
        
        {/* Architecture Header & Telemetry Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] bg-black/30 backdrop-blur-md px-4 py-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Network className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  System Architecture Topology
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE WORKFLOW
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Katta Elia Speargeon • Engineering Ecosystem • GRIET CSE-G
              </p>
            </div>
          </div>

          {/* Interactive Controls & Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Play / Pause Packet Stream */}
            <button
              onClick={() => setIsFlowPlaying(!isFlowPlaying)}
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isFlowPlaying ? 'Pause Data Packets' : 'Resume Data Packets'}
            >
              {isFlowPlaying ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isFlowPlaying ? 'Flow Active' : 'Paused'}</span>
            </button>

            {/* Metrics Toggle */}
            <button
              onClick={() => setShowMetricsOverlay(!showMetricsOverlay)}
              className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                showMetricsOverlay 
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300' 
                  : 'bg-white/[0.04] border-white/10 text-slate-400'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Telemetry</span>
            </button>

            {/* Category Filter Pills */}
            <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-0.5 rounded-lg border border-white/5">
              {(['all', 'client', 'gateway', 'service', 'storage', 'devops'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-all cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Five Architectural Tiers Layout */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1 items-start">
          
          {/* TIER 1: CLIENT EDGE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 py-1 border-b border-cyan-500/20">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-400 flex items-center gap-1.5">
                <Globe className="w-3 h-3" />
                1. Client Edge
              </span>
              <span className="text-[10px] font-mono text-slate-500">4 Ingress</span>
            </div>

            {filteredNodes
              .filter((n) => n.category === 'client')
              .map((node) => {
                const styles = getCategoryColor(node.category);
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all backdrop-blur-md relative group ${
                      styles.bg
                    } ${
                      isSelected
                        ? 'border-cyan-400 ring-1 ring-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-950/40'
                        : styles.border
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                        {node.name}
                      </h4>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${styles.badge}`}>
                        {node.port}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-1 items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span className="text-cyan-400/90 font-medium">{node.roleTag}</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {node.latency}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* TIER 2: GATEWAY & INGRESS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 py-1 border-b border-blue-500/20">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                2. Gateway Edge
              </span>
              <span className="text-[10px] font-mono text-slate-500">2 Proxies</span>
            </div>

            {filteredNodes
              .filter((n) => n.category === 'gateway')
              .map((node) => {
                const styles = getCategoryColor(node.category);
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all backdrop-blur-md relative group ${
                      styles.bg
                    } ${
                      isSelected
                        ? 'border-blue-400 ring-1 ring-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-blue-950/40'
                        : styles.border
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-bold text-white font-mono group-hover:text-blue-300 transition-colors">
                        {node.name}
                      </h4>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${styles.badge}`}>
                        {node.port}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-1 items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span className="text-blue-400 font-medium">{node.roleTag}</span>
                      <span className="text-cyan-300 font-mono">{node.throughput}</span>
                    </div>
                  </div>
                );
              })}

            {/* Visual Conduit Connector Card */}
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-dashed border-white/10 text-center font-mono text-[10px] text-slate-500">
              ⚡ High-speed TLS / WSS Ingress
            </div>
          </div>

          {/* TIER 3: MICROSERVICES & AI CORE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 py-1 border-b border-violet-500/20">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-violet-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3" />
                3. Microservices
              </span>
              <span className="text-[10px] font-mono text-slate-500">4 Services</span>
            </div>

            {filteredNodes
              .filter((n) => n.category === 'service')
              .map((node) => {
                const styles = getCategoryColor(node.category);
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all backdrop-blur-md relative group ${
                      styles.bg
                    } ${
                      isSelected
                        ? 'border-violet-400 ring-1 ring-violet-400/50 shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-violet-950/40'
                        : styles.border
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-bold text-white font-mono group-hover:text-violet-300 transition-colors">
                        {node.name}
                      </h4>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${styles.badge}`}>
                        {node.port}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-1 items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span className="text-violet-400 font-medium">{node.roleTag}</span>
                      <span className="text-emerald-400">{node.latency}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* TIER 4: DATA & PERSISTENCE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 py-1 border-b border-emerald-500/20">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                4. Data Fabric
              </span>
              <span className="text-[10px] font-mono text-slate-500">3 Datastores</span>
            </div>

            {filteredNodes
              .filter((n) => n.category === 'storage')
              .map((node) => {
                const styles = getCategoryColor(node.category);
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all backdrop-blur-md relative group ${
                      styles.bg
                    } ${
                      isSelected
                        ? 'border-emerald-400 ring-1 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-950/40'
                        : styles.border
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-bold text-white font-mono group-hover:text-emerald-300 transition-colors">
                        {node.name}
                      </h4>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${styles.badge}`}>
                        {node.port}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-1 items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span className="text-emerald-400 font-medium">{node.roleTag}</span>
                      <span className="text-slate-300">{node.latency}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* TIER 5: CI/CD & OBSERVABILITY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2 py-1 border-b border-amber-500/20">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                <GitBranch className="w-3 h-3" />
                5. DevOps & Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-500">2 Pipelines</span>
            </div>

            {filteredNodes
              .filter((n) => n.category === 'devops')
              .map((node) => {
                const styles = getCategoryColor(node.category);
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all backdrop-blur-md relative group ${
                      styles.bg
                    } ${
                      isSelected
                        ? 'border-amber-400 ring-1 ring-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-950/40'
                        : styles.border
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <h4 className="text-xs font-bold text-white font-mono group-hover:text-amber-300 transition-colors">
                        {node.name}
                      </h4>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${styles.badge}`}>
                        {node.port}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-sans">
                      {node.description}
                    </p>

                    <div className="flex flex-wrap gap-1 items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                      <span className="text-amber-400 font-medium">{node.roleTag}</span>
                      <span className="text-emerald-400">{node.throughput}</span>
                    </div>
                  </div>
                );
              })}

            {/* Architecture Node Inspector Card (when node selected) */}
            {selectedNode && (
              <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-cyan-500/30 backdrop-blur-xl shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Node Telemetry
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="font-mono">
                  <div className="text-xs font-bold text-white">{selectedNode.name}</div>
                  <div className="text-[10px] text-slate-400">{selectedNode.roleTag} • {selectedNode.port}</div>
                </div>

                {selectedNode.metrics && (
                  <div className="space-y-1 pt-1 border-t border-white/10 font-mono text-[10px]">
                    {selectedNode.metrics.map((m: { label: string; value: string }, idx: number) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span className="text-slate-500">{m.label}:</span>
                        <span className="text-cyan-300 font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Global Architecture Status Footnote */}
        {showMetricsOverlay && (
          <div className="mt-6 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 bg-black/40 px-4 py-2.5 rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                12 Micro-Nodes Online
              </span>
              <span className="hidden sm:inline text-slate-600">|</span>
              <span className="hidden sm:inline text-slate-300">
                Total Topology Latency: <strong className="text-cyan-400">14ms</strong>
              </span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span className="hidden md:inline text-slate-300">
                Throughput: <strong className="text-violet-400">2,480 req/s</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[10px]">
              <span>GRIET CSE-G // SYSTEM ARCHITECTURE DEPLOYMENT</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
