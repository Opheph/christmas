import React, { useState } from 'react';
// Calls server-side API at /api/gemini to keep API key on backend
import { HatType, AccessoryType } from '../types';

interface ChatInterfaceProps {
  onUserMessage: (msg: string) => void;
  onYancyMessage: (msg: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  currentHat: HatType;
  setHat: (hat: HatType) => void;
  currentAccessory: AccessoryType;
  setAccessory: (acc: AccessoryType) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onUserMessage, 
  onYancyMessage, 
  isLoading, 
  setLoading,
  currentHat,
  setHat,
  currentAccessory,
  setAccessory
}) => {
  const [inputText, setInputText] = useState('');
  const [showControls, setShowControls] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userText = inputText;
    onUserMessage(userText);
    setInputText('');
    setLoading(true);

    // POST to server API which will call Gemini with the API key
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = data?.error || data?.message || 'AI service returned an error';
        onYancyMessage(`Meow... (${errMsg})`);
      } else {
        const responseText = data?.text || '...';
        onYancyMessage(responseText);
      }
    } catch (err) {
      onYancyMessage('Meow... (unable to reach the cat planet)');
    }
    setLoading(false);
  };

  const toggleHat = () => {
    const hats: HatType[] = ['none', 'santa-red', 'santa-green', 'reindeer'];
    const currentIndex = hats.indexOf(currentHat);
    setHat(hats[(currentIndex + 1) % hats.length]);
  };

  const toggleAccessory = () => {
    const accs: AccessoryType[] = ['none', 'scarf-red', 'scarf-green', 'bell'];
    const currentIndex = accs.indexOf(currentAccessory);
    setAccessory(accs[(currentIndex + 1) % accs.length]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
      
      {/* Customization Controls (Mini Dock) */}
      <div className={`transition-all duration-300 transform ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none h-0'}`}>
         <div className="bg-gray-800/80 backdrop-blur-md rounded-full px-6 py-2 flex gap-4 border border-white/20 shadow-lg">
            <button onClick={toggleHat} className="flex flex-col items-center gap-1 group">
               <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                 🧢
               </div>
               <span className="text-[10px] uppercase tracking-wider text-white">Hat</span>
            </button>
            <button onClick={toggleAccessory} className="flex flex-col items-center gap-1 group">
               <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white group-hover:scale-110 transition-transform">
                 🧣
               </div>
               <span className="text-[10px] uppercase tracking-wider text-white">Item</span>
            </button>
         </div>
      </div>

      {/* Input Bar Area */}
      <form onSubmit={handleSend} className="w-full relative group">
        <div className="absolute -top-12 right-0">
           <button 
             type="button"
             onClick={() => setShowControls(!showControls)}
             className="text-white/70 hover:text-white text-xs bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
           >
             {showControls ? 'Hide Wardrobe' : 'Customize Yancy'}
           </button>
        </div>

        <div className="flex gap-0 shadow-2xl">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Talk to Yancy"
            className="flex-1 bg-gray-900/90 text-white border-2 border-r-0 border-white/50 p-4 focus:outline-none focus:border-white focus:bg-gray-800 transition-colors font-sans text-lg placeholder-gray-500 rounded-l-xl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-red-600 hover:bg-red-500 text-white border-2 border-white/50 border-l-0 px-8 py-2 font-sans font-bold text-lg uppercase transition-all disabled:opacity-50 disabled:hover:bg-red-600 rounded-r-xl"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};