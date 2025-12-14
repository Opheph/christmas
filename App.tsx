import React, { useState, useEffect } from 'react';
import { PixelTree } from './components/PixelTree';
import { PixelCat } from './components/PixelCat';
import { ChatInterface } from './components/ChatInterface';
import { Snowfall } from './components/Snowfall';
import { Notebook } from './components/Notebook';
import { MessageBoard } from './components/MessageBoard';
import { FloatingLetter } from './components/FloatingLetter';
import { ChessGame } from './components/ChessGame';
import { initializeChat } from './services/geminiService';
import { HatType, AccessoryType } from './types';

const App: React.FC = () => {
  const [yancyMessage, setYancyMessage] = useState<string | null>(null);
  const [userSubtitle, setUserSubtitle] = useState<string>("");
  const [isLoading, setLoading] = useState(false);

  // Customization State
  const [hat, setHat] = useState<HatType>('santa-red');
  const [accessory, setAccessory] = useState<AccessoryType>('scarf-green');

  useEffect(() => {
    initializeChat();
  }, []);

  const handleUserMessage = (msg: string) => {
    setUserSubtitle(msg);
  };

  const handleYancyMessage = (msg: string) => {
    setYancyMessage(msg);
  };

  return (
    <div className="min-h-screen bg-[#1a1c2c] flex flex-col relative overflow-hidden font-vt323 text-white">
      <Snowfall />
      
      {/* Floating Elements Layer */}
      <FloatingLetter />

      {/* Main Scene Layer */}
      <main className="flex-1 flex flex-col items-center justify-end relative z-10 w-full pb-32 sm:pb-40">
        
        {/* Title */}
        <div className="absolute top-6 sm:top-8 w-full text-center z-20 pointer-events-none px-4">
          <h1 className="text-4xl sm:text-6xl text-yellow-400 drop-shadow-md pixel-font tracking-widest">
            Merry Christmas, Lexi
          </h1>
        </div>

        {/* The Scene Composition - A grounded stage */}
        {/* Adjusted height and scale for mobile visibility */}
        <div className="relative w-full max-w-4xl h-[400px] sm:h-[500px] flex justify-center items-end mb-4 sm:mb-10">
            
            {/* Ground Shadow/Glow */}
            <div className="absolute bottom-10 w-3/4 h-12 bg-white opacity-5 rounded-[100%] blur-xl z-0 pointer-events-none"></div>

            {/* Tree Container - Scaled down on mobile to fit */}
            <div className="relative z-10 transform scale-90 sm:scale-125 origin-bottom">
              <PixelTree />
            </div>

            {/* Notebook Component (Right Side) */}
            <Notebook />

            {/* Message Board Component (Left Side) */}
            <MessageBoard />

            {/* Chess Game Component (New) */}
            <ChessGame onYancyMessage={handleYancyMessage} />

            {/* Cat Layer - Shares the same coordinate context as the tree essentially, but overlaid */}
            <div className="absolute bottom-0 w-full h-full pointer-events-none">
               {/* Pointer events enabled on the cat specific div inside component */}
               {/* Passed 'scale-90 sm:scale-100' logic indirectly by parent container constraints, 
                   but Cat positions itself relative to center. */}
               <PixelCat 
                  message={yancyMessage} 
                  hat={hat} 
                  accessory={accessory}
                  isThinking={isLoading}
               />
            </div>
        </div>

        {/* User Subtitle Display - Positioned just above the input box */}
        {/* Z-index increased to 60 to sit above footer gradient. Bottom spacing increased for desktop. */}
        <div className="absolute bottom-32 sm:bottom-48 w-full flex justify-center z-[60] px-4 pointer-events-none">
           {userSubtitle && (
             <div className="bg-black/60 px-6 py-2 rounded-lg backdrop-blur-sm border-2 border-white/20 animate-fade-in max-w-[90%] sm:max-w-2xl">
               <p className="text-lg text-yellow-100 text-center tracking-wide leading-tight">
                 "{userSubtitle}"
               </p>
             </div>
           )}
        </div>

      </main>

      {/* Footer Interface Layer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 z-50 bg-gradient-to-t from-[#0f1019] via-[#0f1019]/90 to-transparent">
        <ChatInterface 
          onUserMessage={handleUserMessage}
          onYancyMessage={handleYancyMessage}
          isLoading={isLoading} 
          setLoading={setLoading}
          currentHat={hat}
          setHat={setHat}
          currentAccessory={accessory}
          setAccessory={setAccessory}
        />
      </footer>

      <style>{`
        .pixel-font { font-family: 'VT323', monospace; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Slight bounce for speech bubble */
        @keyframes bounce-slight {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-slight {
          animation: bounce-slight 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;