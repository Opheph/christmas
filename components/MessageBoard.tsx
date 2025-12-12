import React, { useState, useEffect } from 'react';
import { GuestBookEntry } from '../types';
import { subscribeToGuestbook, addGuestbookMessage } from '../services/guestbookService';

export const MessageBoard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GuestBookEntry[]>([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToGuestbook((updatedMessages) => {
      setMessages(updatedMessages);
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
        await addGuestbookMessage(newName, newMessage);
        setNewMessage('');
        // Keep name for convenience
    } catch (error) {
        console.error("Failed to send message", error);
        alert("Failed to sign guestbook. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Signpost Icon on Ground (Left side) */}
      <div 
        className="absolute z-20 cursor-pointer group hover:scale-110 transition-transform"
        style={{ bottom: '110px', left: '20%' }}
        onClick={() => setIsOpen(true)}
      >
         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white text-black px-2 py-1 rounded pixel-font whitespace-nowrap pointer-events-none border border-black shadow-lg">
             Guestbook
         </div>
         <svg width="40" height="50" viewBox="0 0 20 25" shapeRendering="crispEdges">
             {/* Pole */}
             <rect x="9" y="10" width="2" height="15" fill="#3E2723" />
             {/* Sign Board */}
             <rect x="2" y="4" width="16" height="8" fill="#5D4037" />
             <rect x="3" y="5" width="14" height="6" fill="#795548" />
             {/* Nails */}
             <rect x="4" y="6" width="1" height="1" fill="#3E2723" opacity="0.5" />
             <rect x="15" y="6" width="1" height="1" fill="#3E2723" opacity="0.5" />
             {/* Text lines */}
             <rect x="5" y="7" width="10" height="1" fill="#3E2723" opacity="0.3" />
             <rect x="5" y="9" width="7" height="1" fill="#3E2723" opacity="0.3" />
         </svg>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-[#D7CCC8] text-gray-900 w-full max-w-md relative p-1 shadow-2xl pixel-font border-4 border-[#5D4037] flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ 
                boxShadow: '10px 10px 0px rgba(0,0,0,0.5)',
                imageRendering: 'pixelated'
            }}
          >
             {/* Header */}
             <div className="bg-[#5D4037] text-[#D7CCC8] p-4 flex justify-between items-center">
                <h2 className="text-2xl uppercase tracking-widest">Guestbook</h2>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-300">✖</button>
             </div>

             {/* Message List */}
             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#EFEBE9]">
                
                {/* 🎅 SPECIAL SANTA MESSAGE (PINNED) */}
                <div className="bg-[#FFF8E1] p-3 border-4 border-[#FFC107] shadow-md relative animate-pulse-slow">
                    <div className="flex justify-between items-baseline mb-1 border-b border-dashed border-orange-300 pb-1">
                       <span className="font-bold text-[#D32F2F] text-xl flex items-center gap-1">
                         🎅 Santa Claus
                       </span>
                       <span className="text-xs text-[#F57F17]">Dec 25</span>
                    </div>
                    <p className="text-lg leading-snug text-[#3E2723] break-words font-medium">
                       Ho ho ho! Merry Christmas, Yancy! 🐾 You've been a very good cat. I left some magic in the tree for you and Lexi! 🎄✨
                    </p>
                    {/* Tiny visual deco for santa msg */}
                    <div className="absolute -top-2 -right-2 text-xl">🎁</div>
                </div>

                {messages.length === 0 && <p className="text-center text-gray-500 mt-4">No other messages yet. Be the first!</p>}
                
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white p-3 border-2 border-[#A1887F] shadow-sm relative">
                    <div className="flex justify-between items-baseline mb-1 border-b border-dashed border-gray-300 pb-1">
                       <span className="font-bold text-[#5D4037] text-lg truncate max-w-[70%]">{msg.name}</span>
                       <span className="text-xs text-gray-500">{formatDate(msg.timestamp)}</span>
                    </div>
                    <p className="text-lg leading-snug text-gray-800 break-words">{msg.message}</p>
                  </div>
                ))}
             </div>

             {/* Input Form */}
             <div className="p-4 bg-[#D7CCC8] border-t-4 border-[#5D4037]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                   <input 
                      type="text" 
                      placeholder="Your Name" 
                      maxLength={20}
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      className="p-2 border-2 border-[#A1887F] bg-white focus:outline-none focus:border-[#5D4037] font-sans text-sm"
                      disabled={isSubmitting}
                   />
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Leave a message..." 
                        maxLength={60}
                        required
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        className="flex-1 p-2 border-2 border-[#A1887F] bg-white focus:outline-none focus:border-[#5D4037] font-sans text-sm"
                        disabled={isSubmitting}
                      />
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#5D4037] text-white px-4 py-2 hover:bg-[#3E2723] transition-colors border-2 border-black font-bold uppercase disabled:opacity-50"
                      >
                        {isSubmitting ? '...' : 'Sign'}
                      </button>
                   </div>
                </form>
             </div>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #D7CCC8; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8D6E63; border: 1px solid #5D4037; }
        @keyframes pulse-slow {
            0%, 100% { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transform: scale(1); }
            50% { box-shadow: 0 10px 15px -3px rgba(255, 193, 7, 0.3); transform: scale(1.01); }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
};