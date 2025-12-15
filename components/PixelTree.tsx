import React, { useState, useEffect } from 'react';

export const PixelTree: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Handle click to trigger a short burst of interaction
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 2000); // Effect lasts 2 seconds after click
  };

  const isLit = isHovered || isClicked;

  // Light coordinates extracted for cleaner rendering
  const lights = [
    { x: 32, y: 62, delay: '0.1s' },
    { x: 66, y: 58, delay: '0.5s' },
    { x: 44, y: 50, delay: '1.2s' },
    { x: 56, y: 42, delay: '0.8s' },
    { x: 50, y: 24, delay: '0.3s' },
    { x: 22, y: 72, delay: '1.5s' },
    { x: 76, y: 68, delay: '0.7s' },
  ];

  // Client-only random delays to avoid SSR/CSR hydration mismatch
  const [clientDelays, setClientDelays] = useState<string[] | null>(null);

  useEffect(() => {
    // Generate randomized negative delays only on the client after mount
    setClientDelays(lights.map(() => `-${Math.random().toFixed(3)}s`));
  }, []);

  return (
    <div 
      className="relative w-80 h-96 sm:w-96 sm:h-[30rem] mx-auto group cursor-pointer transition-transform duration-200 active:scale-95"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Ambient Glow Aura - Changes from gold to multicolor when lit */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-[-1] rounded-full pointer-events-none transition-all duration-500"
        style={{
          background: isLit 
            ? 'radial-gradient(circle, rgba(255, 0, 0, 0.15) 0%, rgba(0, 255, 0, 0.1) 30%, rgba(0, 0, 255, 0.1) 60%, rgba(0,0,0,0) 80%)'
            : 'radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.05) 50%, rgba(0,0,0,0) 70%)',
          filter: 'blur(20px)',
          opacity: isLit ? 1 : 0.8
        }}
      />
      
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible" shapeRendering="crispEdges">
        
        {/* Snowy Ground Patch */}
        <ellipse cx="50" cy="85" rx="40" ry="10" fill="#E3F2FD" opacity="0.3" />

        {/* --- GIFTS (Behind/Side) --- */}
        {/* Green Gift Far Left */}
        <rect x="15" y="80" width="7" height="6" fill="#2E7D32" />
        <rect x="18" y="80" width="1" height="6" fill="#A5D6A7" />
        <rect x="15" y="82" width="7" height="1" fill="#A5D6A7" />

        {/* Blue Gift Left */}
        <rect x="25" y="78" width="8" height="8" fill="#1565C0" />
        <rect x="28" y="78" width="2" height="8" fill="#90CAF9" />
        <rect x="25" y="81" width="8" height="2" fill="#90CAF9" />
        
        {/* Red Gift Right */}
        <rect x="65" y="78" width="10" height="7" fill="#C62828" />
        <rect x="69" y="78" width="2" height="7" fill="#FFEB3B" />
        <rect x="65" y="80" width="10" height="2" fill="#FFEB3B" />

        {/* Small Gold Gift Front */}
        <rect x="58" y="82" width="6" height="5" fill="#FFB300" />
        <rect x="60" y="82" width="2" height="5" fill="#FFF8E1" />

        {/* Pot/Stump */}
        <rect x="44" y="80" width="12" height="8" fill="#5D4037" />
        <rect x="42" y="86" width="16" height="4" fill="#3E2723" />
        
        {/* Tree Layers - Darker shades for depth */}
        
        {/* Bottom Tier */}
        <path d="M 20 80 L 80 80 L 80 70 L 76 70 L 76 66 L 70 66 L 70 60 L 30 60 L 30 66 L 24 66 L 24 70 L 20 70 Z" fill="#1B5E20" />
        <rect x="24" y="70" width="52" height="2" fill="#2E7D32" />
        
        {/* Middle Tier */}
        <path d="M 28 60 L 72 60 L 72 52 L 68 52 L 68 46 L 62 46 L 62 40 L 38 40 L 38 46 L 32 46 L 32 52 L 28 52 Z" fill="#2E7D32" />
        <rect x="32" y="52" width="36" height="2" fill="#43A047" />

        {/* Top Tier */}
        <path d="M 38 40 L 62 40 L 62 32 L 58 32 L 58 26 L 54 26 L 54 20 L 46 20 L 46 26 L 42 26 L 42 32 L 38 32 Z" fill="#43A047" />
        <rect x="42" y="32" width="16" height="2" fill="#66BB6A" />

        {/* Top Tip */}
        <rect x="46" y="14" width="8" height="8" fill="#43A047" />
        <rect x="48" y="10" width="4" height="4" fill="#66BB6A" />

        {/* --- PIXEL RIBBONS (Embedded) --- */}
        <g className="animate-pulse" style={{ animationDuration: '3s' }}>
           {/* Top Ribbon: Diagonal steps */}
           <rect x="44" y="34" width="2" height="2" fill="#FDD835" />
           <rect x="46" y="36" width="2" height="2" fill="#FDD835" />
           <rect x="48" y="38" width="2" height="2" fill="#FDD835" />
           <rect x="50" y="38" width="2" height="2" fill="#FDD835" />
           <rect x="52" y="36" width="2" height="2" fill="#FDD835" />
           <rect x="54" y="34" width="2" height="2" fill="#FDD835" />

           {/* Middle Ribbon: Longer drape */}
           <rect x="34" y="54" width="2" height="2" fill="#FDD835" />
           <rect x="36" y="56" width="2" height="2" fill="#FDD835" />
           <rect x="38" y="58" width="2" height="2" fill="#FDD835" />
           <rect x="40" y="58" width="2" height="2" fill="#FDD835" />
           <rect x="42" y="58" width="2" height="2" fill="#FDD835" />
           <rect x="44" y="56" width="2" height="2" fill="#FDD835" />
           <rect x="46" y="54" width="2" height="2" fill="#FDD835" />
           <rect x="48" y="56" width="2" height="2" fill="#FDD835" />
           <rect x="50" y="58" width="2" height="2" fill="#FDD835" />
           <rect x="52" y="60" width="2" height="2" fill="#FDD835" />
           <rect x="54" y="60" width="2" height="2" fill="#FDD835" />
           <rect x="56" y="60" width="2" height="2" fill="#FDD835" />
           <rect x="58" y="58" width="2" height="2" fill="#FDD835" />
           <rect x="60" y="56" width="2" height="2" fill="#FDD835" />
           <rect x="62" y="54" width="2" height="2" fill="#FDD835" />

           {/* Bottom Ribbon */}
           <rect x="26" y="72" width="2" height="2" fill="#FDD835" />
           <rect x="28" y="74" width="2" height="2" fill="#FDD835" />
           <rect x="30" y="76" width="2" height="2" fill="#FDD835" />
           <rect x="32" y="76" width="2" height="2" fill="#FDD835" />
           <rect x="34" y="74" width="2" height="2" fill="#FDD835" />
           <rect x="36" y="72" width="2" height="2" fill="#FDD835" />
           
           <rect x="50" y="72" width="2" height="2" fill="#FDD835" />
           <rect x="52" y="74" width="2" height="2" fill="#FDD835" />
           <rect x="54" y="76" width="2" height="2" fill="#FDD835" />
           <rect x="56" y="76" width="2" height="2" fill="#FDD835" />
           <rect x="58" y="74" width="2" height="2" fill="#FDD835" />
           <rect x="60" y="72" width="2" height="2" fill="#FDD835" />

           <rect x="70" y="72" width="2" height="2" fill="#FDD835" />
           <rect x="72" y="74" width="2" height="2" fill="#FDD835" />
           <rect x="74" y="72" width="2" height="2" fill="#FDD835" />
        </g>

        {/* --- DECORATIONS --- */}

        {/* Candy Canes */}
        <g transform="translate(36, 62) rotate(-10)">
            {/* White Body */}
            <path d="M 0 0 L 2 0 L 2 6 L 0 6 Z" fill="#FFF" />
            {/* Red Stripes */}
            <rect x="0" y="1" width="2" height="1" fill="#D32F2F" />
            <rect x="0" y="3" width="2" height="1" fill="#D32F2F" />
            <rect x="0" y="5" width="2" height="1" fill="#D32F2F" />
            {/* Hook */}
            <path d="M 0 0 L 0 -1 L 3 -1 L 3 1 L 2 1 L 2 0 Z" fill="#FFF" /> 
            <rect x="2" y="-1" width="1" height="1" fill="#D32F2F" />
        </g>

        <g transform="translate(64, 72) rotate(15)">
             <path d="M 0 0 L 2 0 L 2 6 L 0 6 Z" fill="#FFF" />
             <rect x="0" y="1" width="2" height="1" fill="#D32F2F" />
             <rect x="0" y="3" width="2" height="1" fill="#D32F2F" />
             <rect x="0" y="5" width="2" height="1" fill="#D32F2F" />
             <path d="M 0 0 L 0 -1 L 3 -1 L 3 1 L 2 1 L 2 0 Z" fill="#FFF" />
             <rect x="2" y="-1" width="1" height="1" fill="#D32F2F" />
        </g>

        {/* Stockings */}
        {/* Red Stocking */}
        <g transform="translate(56, 54)">
            <rect x="0" y="0" width="4" height="1" fill="#FFF" /> {/* Cuff */}
            <rect x="0" y="1" width="4" height="4" fill="#C62828" /> {/* Leg */}
            <rect x="2" y="4" width="4" height="2" fill="#C62828" /> {/* Foot */}
        </g>

        {/* Blue Stocking */}
        <g transform="translate(32, 66)">
             <rect x="0" y="0" width="4" height="1" fill="#FFF" /> 
             <rect x="0" y="1" width="4" height="4" fill="#1565C0" /> 
             <rect x="2" y="4" width="4" height="2" fill="#1565C0" /> 
        </g>

        {/* Varied Ornaments */}
        
        {/* Classic Red Bulb with highlight */}
        <rect x="26" y="76" width="3" height="3" fill="#D32F2F" /> 
        <rect x="27" y="75" width="1" height="1" fill="#FFCDD2" />

        {/* Blue Bulb */}
        <rect x="70" y="74" width="3" height="3" fill="#1976D2" />
        <rect x="71" y="73" width="1" height="1" fill="#BBDEFB" />

        {/* Large Gold Ornament */}
        <rect x="50" y="66" width="4" height="4" fill="#FDD835" />
        <rect x="51" y="67" width="1" height="1" fill="#FFF9C4" />

        {/* Purple Round */}
        <rect x="60" y="48" width="3" height="3" fill="#E040FB" />
        <rect x="61" y="49" width="1" height="1" fill="#F8BBD0" />

        {/* Green Diamond Ornament */}
        <g transform="translate(42, 58)">
            <rect x="1" y="0" width="2" height="1" fill="#00E676" />
            <rect x="0" y="1" width="4" height="2" fill="#00E676" />
            <rect x="1" y="3" width="2" height="1" fill="#00E676" />
        </g>

        {/* Small fillers */}
        <rect x="36" y="46" width="2" height="2" fill="#1976D2" /> 
        <rect x="48" y="36" width="3" height="3" fill="#D32F2F" />

        {/* Interactive Lights */}
        {lights.map((l, i) => (
            <rect 
                key={i}
                x={l.x} 
                y={l.y} 
                width="2" 
                height="2" 
                className={isLit ? "animate-disco" : "animate-pulse"}
                style={{ 
              // Use server-safe static delay on first render and switch to
              // randomized delays after mount to prevent hydration mismatch
              animationDelay: isLit ? (clientDelays ? clientDelays[i] : l.delay) : l.delay,
                    // When lit, the class controls the fill. When not lit, it's white.
                    fill: isLit ? undefined : '#FFF' 
                }}
            />
        ))}

        {/* The Star - Spins when interactive */}
        <path 
            d="M 50 2 L 52 8 L 58 8 L 54 12 L 56 18 L 50 14 L 44 18 L 46 12 L 42 8 L 48 8 Z" 
            fill={isLit ? "#FFF176" : "#FFD700"} 
            className={isLit ? "animate-spin-slow origin-center" : "animate-pulse"}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <rect x="49" y="7" width="2" height="2" fill="#FFF" opacity="0.8" className="pointer-events-none" />
      </svg>

      <style>{`
         /* Disco flashing colors */
         @keyframes disco {
            0% { fill: #ef4444; } /* red */
            20% { fill: #eab308; } /* yellow */
            40% { fill: #22c55e; } /* green */
            60% { fill: #3b82f6; } /* blue */
            80% { fill: #a855f7; } /* purple */
            100% { fill: #ef4444; }
         }
         .animate-disco {
             animation: disco 0.6s step-end infinite;
         }
         
         .animate-spin-slow {
             animation: spin 3s linear infinite;
         }
         @keyframes spin {
             from { transform: rotate(0deg); }
             to { transform: rotate(360deg); }
         }
      `}</style>
    </div>
  );
};