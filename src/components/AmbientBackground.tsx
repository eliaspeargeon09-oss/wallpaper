import React from 'react';

interface AmbientBackgroundProps {
  opacity?: number;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ 
  opacity = 100 
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#06080e] select-none">
      {/* 1. Deep Midnight Charcoal & Navy Canvas */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #0d1222 0%, #080b15 50%, #04060a 100%)'
        }}
      />

      {/* 2. Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-35" />

      {/* 3. Subtle Cyber Constellation / Micro Particle Stars */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Subtle scattered coordinate stars */}
        <circle cx="8%" cy="18%" r="1.5" fill="#38bdf8" opacity="0.6" />
        <circle cx="15%" cy="75%" r="1" fill="#818cf8" opacity="0.5" />
        <circle cx="28%" cy="32%" r="1.5" fill="#22d3ee" opacity="0.4" />
        <circle cx="42%" cy="85%" r="1.2" fill="#c084fc" opacity="0.5" />
        <circle cx="65%" cy="22%" r="1.5" fill="#38bdf8" opacity="0.5" />
        <circle cx="78%" cy="68%" r="1.2" fill="#22d3ee" opacity="0.6" />
        <circle cx="88%" cy="28%" r="1.5" fill="#818cf8" opacity="0.4" />
        <circle cx="92%" cy="82%" r="1" fill="#38bdf8" opacity="0.7" />
        <circle cx="52%" cy="12%" r="1.5" fill="#22d3ee" opacity="0.5" />
        <circle cx="35%" cy="60%" r="1" fill="#a855f7" opacity="0.4" />
      </svg>

      {/* 4. Elegant Geometric Wallpaper Lines & Grid Horizon */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="25%" x2="100%" y2="25%" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="0.8" strokeDasharray="6 12" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="0.8" strokeDasharray="8 16" />
        {/* Futuristic angled accent vectors */}
        <line x1="10%" y1="0" x2="30%" y2="100%" stroke="rgba(34, 211, 238, 0.08)" strokeWidth="1" />
        <line x1="90%" y1="0" x2="70%" y2="100%" stroke="rgba(168, 85, 247, 0.08)" strokeWidth="1" />
      </svg>

      {/* 5. Atmospheric Violet Bloom on the Left */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(99, 102, 241, 0.2) 45%, transparent 70%)',
        }}
      />

      {/* 6. Electric Cyan Highlight on the Right */}
      <div 
        className="absolute -top-[12%] -right-[8%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full blur-[130px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(14, 165, 233, 0.2) 45%, transparent 70%)',
        }}
      />

      {/* 7. Bottom Atmospheric Horizon Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-[380px] overflow-hidden pointer-events-none">
        {/* Soft violet wave on the bottom-left */}
        <div 
          className="absolute -bottom-28 -left-10 w-[60vw] h-[320px] rounded-[100%] blur-[110px] opacity-35 animate-ambient"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.5) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 80%)',
          }}
        />

        {/* Electric cyan & aqua wave in the center-right */}
        <div 
          className="absolute -bottom-28 right-[-5%] w-[55vw] h-[320px] rounded-[100%] blur-[110px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.5) 0%, rgba(14, 165, 233, 0.2) 55%, transparent 80%)',
          }}
        />

        {/* Soft luminous horizon mist on bottom edge */}
        <div 
          className="absolute bottom-0 left-1/4 w-[50vw] h-[100px] rounded-[100%] blur-[60px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(224, 242, 254, 0.6) 0%, rgba(56, 189, 248, 0.25) 50%, transparent 80%)',
          }}
        />
      </div>

      {/* 8. Subtle Vignette edges */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};

