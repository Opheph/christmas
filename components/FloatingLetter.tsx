import React, { useState } from 'react';

export const FloatingLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Falling Animation Container */}
      <div 
        className="fixed z-30 animate-falling-letter pointer-events-auto"
        style={{ 
           top: '-10%', 
           left: '15%', // Starts slightly to the left
           cursor: 'pointer' 
        }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pixel Art Letter Icon */}
        <div className={`transform transition-transform duration-300 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
           <svg width="32" height="24" viewBox="0 0 16 12" shapeRendering="crispEdges">
              {/* Envelope Body (White) */}
              <rect x="0" y="0" width="16" height="12" fill="#EEE" />
              <rect x="1" y="1" width="14" height="10" fill="#FFF" />
              
              {/* Flap Lines (Grey) */}
              <path d="M 1 1 L 8 6 L 15 1" stroke="#CCC" strokeWidth="1" fill="none" />
              
              {/* A small red heart seal or stamp */}
              <rect x="7" y="5" width="2" height="2" fill="#EF5350" />
           </svg>
           {isHovered && (
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-1 rounded pixel-font whitespace-nowrap shadow-lg">
                   Read me
               </div>
           )}
        </div>
      </div>

      {/* Letter Modal */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#f0e6d2] text-[#1a1a1a] w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-6 sm:p-10 shadow-2xl rotate-1 handwriting-font custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
            style={{ 
                boxShadow: '0 0 50px rgba(0,0,0,0.5)',
                // Simulating paper texture with a bit more grain
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E"), linear-gradient(#f0e6d2, #e6dcc0)',
            }}
          >
             {/* Close Button - Sticky to top right */}
             <div className="sticky top-0 right-0 flex justify-end z-20 pointer-events-none -mr-2 -mt-2">
                 <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-black text-4xl font-bold font-sans opacity-50 hover:opacity-100 pointer-events-auto transition-opacity"
                    aria-label="Close"
                 >
                    &times;
                 </button>
             </div>

             {/* Letter Content - Using Reenie Beanie font for realism */}
             <div className="space-y-4 text-2xl sm:text-3xl leading-snug tracking-wide -mt-6">
                
                {/* Header / Scribbles */}
                <div className="mb-6 relative leading-none pt-2">
                    <div className="opacity-40 text-xl transform -rotate-2 ml-2">
                         <span className="line-through decoration-2 decoration-black">Hey</span>
                    </div>
                    <div className="opacity-40 text-xl transform rotate-1 ml-4 -mt-1">
                         <span className="scribble-text">Dear L</span>
                    </div>
                    <div className="mt-2 ml-1 text-3xl">
                        Lexi,
                    </div>
                    
                    {/* Coffee Stain Visual */}
                    <div className="absolute -top-4 -right-2 w-20 h-20 rounded-full border-[6px] border-[#8D6E63] opacity-10 pointer-events-none blur-[2px] transform scale-y-90" />
                </div>

                <p>
                    As I write this, my roommates have <span className="scribble-text">finally</span> already fallen asleep. Time passes so quietly—it feels like a long while since we last talked freely.
                </p>

                <p>
                    I’ve been thinking about the silence between us, and I wanted to say <span className="scribble-text">it's my fault</span> I’m sorry for my part in it. 
                </p>
                
                <p>
                    I don’t know how we drifted from sharing so much to <span className="relative inline-block whitespace-nowrap"><span className="absolute top-1/2 left-0 w-full h-[2px] bg-black opacity-60 transform -rotate-2"></span>strangers</span> saying so little—whether I missed something along the way, or life simply carried us apart.
                </p>

                <p>
                   I’m not asking for explanations or promises. I just didn’t want to leave this unsaid. You’re still someone special to me, and I truly hope you’re well.
                </p>

                <div className="mt-10 mb-8 relative">
                   <p className="font-bold transform -rotate-1 text-4xl">
                       I’ve missed you. 
                   </p>
                   <p className="text-2xl mt-1 text-gray-700 ml-4">
                       More than I expected.
                   </p>
                   {/* Ink smudge */}
                   <div className="absolute -bottom-2 right-10 w-4 h-4 bg-black rounded-full opacity-10 blur-sm"></div>
                </div>

                {/* Paw Print Signature */}
                <div className="flex justify-end mt-8 opacity-80 pb-4">
                    <div className="transform rotate-12 flex flex-col items-center">
                        <div className="text-xl mb-1 text-gray-500">(draft)</div>
                        <svg width="50" height="50" viewBox="0 0 100 100" fill="#4E342E" style={{ filter: 'url(#ink-bleed)' }}>
                            <defs>
                                <filter id="ink-bleed">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                                </filter>
                            </defs>
                            <circle cx="50" cy="65" r="22" />
                            <circle cx="25" cy="35" r="9" />
                            <circle cx="50" cy="25" r="9" />
                            <circle cx="75" cy="35" r="9" />
                        </svg>
                    </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes falling-letter {
            0% { top: -10%; left: 10%; transform: rotate(0deg) translateX(0); opacity: 0.9; }
            25% { left: 15%; transform: rotate(15deg) translateX(20px); }
            50% { left: 5%; transform: rotate(-10deg) translateX(-20px); }
            75% { left: 12%; transform: rotate(5deg) translateX(10px); }
            100% { top: 110%; left: 8%; transform: rotate(0deg) translateX(0); opacity: 0.9; }
        }
        .animate-falling-letter {
            animation: falling-letter 18s linear infinite;
            animation-delay: 2s;
        }
        .handwriting-font {
            font-family: 'Reenie Beanie', cursive;
        }
        /* Realistic scribble effect */
        .scribble-text {
            text-decoration: line-through;
            text-decoration-color: rgba(0,0,0,0.6);
            text-decoration-thickness: 3px; /* Thicker for pen look */
            color: rgba(0,0,0,0.5); /* Faded text */
        }
        
        /* Custom Scrollbar for the letter to blend in */
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(141, 110, 99, 0.2); 
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(141, 110, 99, 0.4); 
        }
      `}</style>
    </>
  );
};