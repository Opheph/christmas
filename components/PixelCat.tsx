import React, { useState, useEffect, useRef } from 'react';
import { HatType, AccessoryType } from '../types';

interface PixelCatProps {
  message?: string | null;
  hat: HatType;
  accessory: AccessoryType;
  isThinking?: boolean;
}

type CatAction = 'idle' | 'walking' | 'sitting' | 'laying' | 'licking' | 'sleeping' | 'surprised';

export const PixelCat: React.FC<PixelCatProps> = ({ message, hat, accessory, isThinking }) => {
  // Position is relative to the center of the scene floor
  const [pos, setPos] = useState({ x: 0, y: 0 }); 
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [action, setAction] = useState<CatAction>('sitting');
  const [frame, setFrame] = useState(0);
  const [isBlinking, setBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hearts, setHearts] = useState<{id: number, x: number}[]>([]);

  // Use refs for animation loop values
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const isInteracting = useRef(false);

  // Behavior Loop: Decides WHAT to do
  useEffect(() => {
    const behaviorInterval = setInterval(() => {
      if (isInteracting.current) return; // Don't change behavior if user just clicked

      const roll = Math.random();
      
      // If currently walking, decide to stop or keep going
      if (action === 'walking') {
        if (roll > 0.7) {
          // Stop and pick a state
          const stopRoll = Math.random();
          if (stopRoll < 0.4) setAction('idle'); // Stand
          else if (stopRoll < 0.7) setAction('sitting'); // Sit
          else setAction('laying'); // Lie down
        } else if (roll < 0.2) {
           // Change target while walking
           pickNewTarget();
        }
      } 
      // If stationary, decide to move or change posture
      else {
        if (roll < 0.4) {
          setAction('walking');
          pickNewTarget();
        } else if (roll < 0.6) {
          setAction('sitting');
        } else if (roll < 0.8) {
          setAction('laying');
        } else if (roll < 0.9) {
          setAction('licking');
        } else {
          setAction('idle'); // Stand
        }
      }
    }, 2000); // Check every 2 seconds for calmer behavior

    return () => clearInterval(behaviorInterval);
  }, [action]);

  const pickNewTarget = () => {
    // Define bounds for the "floor" area around the tree
    const newX = (Math.random() * 260) - 130;
    const newY = (Math.random() * 60) - 10;
    targetPos.current = { x: newX, y: newY };
  };

  // Blinking Loop
  useEffect(() => {
    const blinkLoop = setInterval(() => {
      // 15% chance to blink every check
      if (Math.random() < 0.15 && action !== 'sleeping') {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 200);
      }
    }, 1000);
    return () => clearInterval(blinkLoop);
  }, [action]);

  // Animation & Movement Loop
  useEffect(() => {
    const loop = setInterval(() => {
      setFrame(f => (f + 1) % 64); 

      if (action === 'walking') {
        const dx = targetPos.current.x - currentPos.current.x;
        const dy = targetPos.current.y - currentPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 5) {
          // Arrived
          currentPos.current = targetPos.current;
        } else {
          // Move Slower: Speed 1.5
          const speed = 1.5;
          const vx = (dx / dist) * speed;
          const vy = (dy / dist) * speed;
          
          currentPos.current.x += vx;
          currentPos.current.y += vy;

          setPos({ ...currentPos.current });
          
          if (vx > 0.1) setDirection('right');
          if (vx < -0.1) setDirection('left');
        }
      }
    }, 60); // 60ms loop (~16fps)

    return () => clearInterval(loop);
  }, [action]);

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 1. Set interacting flag
    isInteracting.current = true;
    
    // 2. Trigger "Surprised" / Happy action
    setAction('surprised');
    
    // 3. Add visual heart explosion
    const id = Date.now();
    // Add 2 hearts with slight random offsets
    setHearts(prev => [
        ...prev, 
        { id, x: Math.random() * 20 - 10 },
        { id: id + 1, x: Math.random() * 20 - 10 }
    ]);

    // Remove hearts after animation
    setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id && h.id !== id + 1));
    }, 800);

    // 4. Reset to a calm state after animation
    setTimeout(() => {
      setAction('sitting'); // Sit down contentedly
      isInteracting.current = false;
    }, 800);
  };

  const isFlipped = direction === 'left';
  const depthScale = 0.9 + (pos.y + 20) / 200; 
  
  // Interaction Logic: Happy if hovered or recently clicked (surprised)
  const isHappy = isHovered || action === 'surprised';

  // Tail Wag: Cycles every ~1 second (16 frames)
  // Simple 2-state wag for idle/sitting
  const tailWagOffset = (Math.floor(frame / 8) % 2 === 0) ? 0 : 2;

  // Pre-calculate offsets to avoid TypeScript narrowing issues in JSX
  const headOffset = (action === 'sitting' || action === 'surprised') ? 0 : 
                     (action === 'laying' || action === 'sleeping') ? 8 : 0;
                     
  const itemOffset = (action === 'sitting' || action === 'surprised') ? 1 : 
                     (action === 'laying' || action === 'sleeping') ? 7 : 0;

  return (
    <div 
      className="absolute transition-transform duration-75 ease-linear will-change-transform z-40 cursor-pointer group pointer-events-auto"
      style={{ 
        left: '50%',
        bottom: '80px', 
        transform: `translate3d(calc(-50% + ${pos.x}px), ${pos.y}px, 0) scale(${depthScale})`
      }}
      onClick={handleInteraction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible Hitbox Expander for easier hovering */}
      <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-transparent z-0" />

      {/* Floating Hearts Animation */}
      {hearts.map(h => (
        <div 
            key={h.id} 
            className="absolute -top-10 text-xl animate-float-up pointer-events-none z-50 select-none"
            style={{ left: `calc(50% + ${h.x}px)` }}
        >
            ❤️
        </div>
      ))}

      {/* Hover Heart Indicator */}
      <div className={`absolute -top-8 -right-4 transition-all duration-300 transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} pointer-events-none z-50`}>
          <div className="bg-white border-2 border-black rounded-full p-1 shadow-sm">
             <div className="text-xs leading-none">❤️</div>
          </div>
      </div>

      {/* Speech Bubble */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-48 flex justify-center"
      >
        {(message || isThinking) && (
          <div className="bg-white border-2 border-gray-900 px-3 py-2 text-center relative pixel-font animate-bounce-slight rounded-xl shadow-lg">
             <p className="text-gray-900 text-lg leading-none font-vt323 tracking-wide">
               {isThinking ? "..." : message}
             </p>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-gray-900 border-r-[6px] border-r-transparent"></div>
             <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-t-[4px] border-t-white border-r-[4px] border-r-transparent"></div>
          </div>
        )}
      </div>

      {/* Cat Sprite */}
      <div 
        className="w-16 h-16 relative z-10"
        style={{ transform: `scaleX(${isFlipped ? -1 : 1})` }}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md overflow-visible" shapeRendering="crispEdges">
          
          {/* --- BODY --- */}
          {(action === 'sitting' || action === 'surprised') && (
             <g>
               {/* Main Body Column */}
               <rect x="10" y="16" width="10" height="12" fill="white" />
               {/* Hind Haunch (Back Leg) */}
               <rect x="18" y="22" width="6" height="6" fill="white" />
               {/* Front Paws */}
               <rect x="10" y="28" width="3" height="2" fill="white" />
               <rect x="14" y="28" width="3" height="2" fill="white" />
               
               {/* Tail Wrap */}
               <g>
                 <rect x="24" y="26" width="2" height="2" fill="#DDD" />
                 <rect x="26" y="26" width="4" height="2" fill="#DDD" />
                 <rect x="28" y="24" width="2" height="2" fill="#DDD" />
               </g>
             </g>
          )}

          {(action === 'laying' || action === 'sleeping') && (
            <g>
               {/* Lower, longer body */}
               <rect x="6" y="22" width="20" height="8" fill="white" />
               <rect x="26" y="22" width="4" height="2" fill="white" />
               {/* Paws out */}
               <rect x="2" y="28" width="6" height="2" fill="white" />
               <rect x="24" y="28" width="6" height="2" fill="white" />
            </g>
          )}

          {(action === 'idle' || action === 'walking' || action === 'licking') && (
             <g>
               <rect x="6" y="16" width="20" height="12" fill="white" />
               
               {/* Legs Animation */}
               {action === 'walking' ? (
                 Math.floor(frame / 4) % 2 === 0 ? (
                   <g>
                     <rect x="8" y="28" width="4" height="4" fill="white" />
                     <rect x="20" y="28" width="4" height="4" fill="white" />
                   </g>
                 ) : (
                   <g>
                     <rect x="6" y="28" width="4" height="4" fill="white" />
                     <rect x="22" y="28" width="4" height="4" fill="white" />
                   </g>
                 )
               ) : (
                 // Standing still legs
                 <g>
                   <rect x="6" y="28" width="4" height="4" fill="white" />
                   <rect x="22" y="28" width="4" height="4" fill="white" />
                 </g>
               )}
               
               {/* Tail with Wag for Idle */}
               <g transform={action === 'idle' ? `translate(${tailWagOffset}, 0)` : ''}>
                 <rect x="26" y="14" width="2" height="6" fill="#DDD" />
                 <rect x="28" y="12" width="2" height="2" fill="#DDD" />
               </g>
             </g>
          )}

          {/* --- HEAD --- */}
          {/* Y position varies by action. If Happy (Hovered/Clicked), apply rotation tilt */}
          <g transform={`translate(0, ${headOffset}) ${isHappy ? 'rotate(15 16 12)' : ''}`}>
            
            <rect x="6" y="6" width="14" height="10" fill="white" />
            <rect x="4" y="8" width="2" height="6" fill="white" />
            <rect x="20" y="8" width="2" height="6" fill="white" />
            
            {/* Ears */}
            <rect x="6" y="4" width="2" height="2" fill="white" />
            <rect x="18" y="4" width="2" height="2" fill="white" />
            <rect x="8" y="2" width="2" height="2" fill="white" />
            <rect x="16" y="2" width="2" height="2" fill="white" />
            
            {/* Ear inner */}
            <rect x="8" y="6" width="2" height="2" fill="#FFCDD2" />
            <rect x="16" y="6" width="2" height="2" fill="#FFCDD2" />

            {/* Face Features Logic */}
            {(() => {
                if (action === 'sleeping') {
                    // Sleeping Eyes (Closed, lower)
                    return (
                        <g>
                            <rect x="8" y="11" width="2" height="1" fill="#333" />
                            <rect x="16" y="11" width="2" height="1" fill="#333" />
                            <rect x="12" y="12" width="2" height="1" fill="#F48FB1" />
                            <rect x="3" y="11" width="2" height="1" fill="#CCC" />
                            <rect x="21" y="11" width="2" height="1" fill="#CCC" />
                        </g>
                    );
                }
                
                // Prioritize "Happy" state for interactions
                if (isHappy) {
                     // Happy Face (Squinty Eyes + Blush + Blep)
                     // Lowered features for chibi cute effect
                    return (
                        <g>
                            {/* Left Eye ^ (Lowered) */}
                            <rect x="8" y="11" width="1" height="1" fill="#333" />
                            <rect x="9" y="10" width="1" height="1" fill="#333" />
                            <rect x="10" y="11" width="1" height="1" fill="#333" />
                            
                            {/* Right Eye ^ (Lowered) */}
                            <rect x="16" y="11" width="1" height="1" fill="#333" />
                            <rect x="17" y="10" width="1" height="1" fill="#333" />
                            <rect x="18" y="11" width="1" height="1" fill="#333" />

                            {/* Blush - slightly brighter/pinker */}
                            <rect x="6" y="12" width="2" height="1" fill="#FF80AB" opacity="0.6" />
                            <rect x="18" y="12" width="2" height="1" fill="#FF80AB" opacity="0.6" />

                            {/* Nose */}
                            <rect x="12" y="12" width="2" height="1" fill="#F48FB1" />
                            
                            {/* Blep (Tongue) instead of weird smile lines */}
                            <rect x="12" y="13" width="2" height="1" fill="#FF5252" />

                            {/* Whiskers - Adjusted y */}
                            <rect x="3" y="12" width="2" height="1" fill="#CCC" />
                            <rect x="21" y="12" width="2" height="1" fill="#CCC" />
                        </g>
                    );
                }

                // Default / Idle
                return (
                    <g>
                        {isBlinking ? (
                        <g>
                            <rect x="8" y="10" width="2" height="1" fill="#333" />
                            <rect x="16" y="10" width="2" height="1" fill="#333" />
                        </g>
                        ) : (
                        <g>
                            <rect x="8" y="9" width="2" height="2" fill="#333" />
                            <rect x="16" y="9" width="2" height="2" fill="#333" />
                        </g>
                        )}
                        <rect x="12" y="12" width="2" height="1" fill="#F48FB1" />
                        
                        {/* Whiskers */}
                        <rect x="3" y="11" width="2" height="1" fill="#CCC" />
                        <rect x="21" y="11" width="2" height="1" fill="#CCC" />

                        {action === 'licking' && (
                           <rect x="12" y="13" width="2" height="2" fill="#FF8A80" className="animate-pulse" />
                        )}
                    </g>
                );
            })()}
          </g>

          {/* --- ACCESSORIES --- */}
          {/* Apply same rotation/translation logic to accessories so they stay on head */}
          <g transform={`translate(0, ${headOffset}) ${isHappy ? 'rotate(15 16 12)' : ''}`}>
            {hat === 'santa-red' && (
              <g>
                <rect x="4" y="4" width="18" height="2" fill="#FFF" />
                <rect x="6" y="2" width="14" height="2" fill="#D32F2F" />
                <rect x="8" y="0" width="8" height="2" fill="#D32F2F" />
                <rect x="18" y="0" width="2" height="4" fill="#D32F2F" />
                <rect x="20" y="4" width="2" height="2" fill="#FFF" />
              </g>
            )}
            {hat === 'santa-green' && (
              <g>
                <rect x="4" y="4" width="18" height="2" fill="#FFF" />
                <rect x="6" y="2" width="14" height="2" fill="#2E7D32" />
                <rect x="8" y="0" width="8" height="2" fill="#2E7D32" />
                <rect x="12" y="-2" width="2" height="2" fill="#FFEB3B" />
              </g>
            )}
            {hat === 'reindeer' && (
              <g>
                <rect x="4" y="0" width="2" height="6" fill="#795548" />
                <rect x="20" y="0" width="2" height="6" fill="#795548" />
                <rect x="2" y="0" width="2" height="2" fill="#795548" />
                <rect x="22" y="0" width="2" height="2" fill="#795548" />
              </g>
            )}
          </g>

          {/* Item follows Body (Not Head) */}
          <g transform={`translate(0, ${itemOffset})`}>
            {accessory === 'scarf-red' && (
              <g>
                <rect x="8" y="14" width="10" height="2" fill="#D32F2F" />
                <rect x="16" y="14" width="2" height="6" fill="#D32F2F" />
              </g>
            )}
            {accessory === 'scarf-green' && (
              <g>
                <rect x="8" y="14" width="10" height="2" fill="#2E7D32" />
                <rect x="16" y="14" width="2" height="6" fill="#2E7D32" />
              </g>
            )}
            {accessory === 'bell' && (
              <g>
                <rect x="10" y="14" width="6" height="2" fill="#A1887F" />
                <rect x="12" y="16" width="2" height="2" fill="#FFD700" />
              </g>
            )}
          </g>

        </svg>
      </div>
      
      <style>{`
        @keyframes float-up {
           0% { transform: translateY(0) scale(1); opacity: 1; }
           100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
           animation: float-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};