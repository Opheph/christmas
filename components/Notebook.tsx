import React, { useState } from 'react';

export const Notebook: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Notebook Icon on Ground */}
      <div 
        className="absolute z-20 cursor-pointer group hover:scale-110 transition-transform"
        style={{ bottom: '110px', right: '20%' }}
        onClick={() => setIsOpen(true)}
      >
         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white text-black px-2 py-1 rounded pixel-font whitespace-nowrap pointer-events-none border border-black shadow-lg">
             cat's notes
         </div>
         <svg width="40" height="40" viewBox="0 0 20 20" shapeRendering="crispEdges">
             {/* Book Cover (Red) */}
             <rect x="2" y="4" width="14" height="12" fill="#5D4037" />
             <rect x="3" y="5" width="12" height="10" fill="#795548" />
             {/* Pages */}
             <rect x="15" y="6" width="2" height="8" fill="#FFF" />
             <rect x="16" y="6" width="1" height="8" fill="#EEE" />
             {/* Label */}
             <rect x="6" y="8" width="6" height="4" fill="#D7CCC8" />
             <rect x="7" y="9" width="4" height="1" fill="#3E2723" opacity="0.5" />
             <rect x="7" y="11" width="3" height="1" fill="#3E2723" opacity="0.5" />
         </svg>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-[#FFF8E1] text-[#3E2723] w-full max-w-lg relative p-2 shadow-2xl rotate-1 pixel-font border-4 border-[#5D4037] flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            style={{ 
                boxShadow: '10px 10px 0px rgba(0,0,0,0.5)',
                imageRendering: 'pixelated'
            }}
          >
            {/* Close Button */}
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-[#8D6E63] text-white flex items-center justify-center border-2 border-[#3E2723] hover:bg-[#5D4037] font-bold z-10"
            >
                X
            </button>

            {/* Content Container */}
            <div className="overflow-y-auto p-6 custom-scrollbar">
                <h2 className="text-3xl text-center mb-2 text-[#3E2723] tracking-widest font-bold">
                    Observations on Lexi
                </h2>
                <p className="text-center text-[#8D6E63] italic mb-6 text-sm">
                    (Continually updated; she is softer than she seems)
                </p>

                <div className="space-y-6 text-lg leading-relaxed font-medium">
                    
                    {/* SECTION: Recent Discoveries */}
                    <section className="bg-[#EFEBE9] p-4 rounded-lg border-2 border-[#D7CCC8] shadow-sm">
                        <h3 className="text-xl font-bold text-[#5D4037] mb-2 flex items-center gap-2">
                           📅 Recent Discoveries
                        </h3>
                        <p className="text-[#4E342E]">
                            Lexi says she is like a <strong>Chestnut</strong>. 🌰<br/>
                            Cat agrees—a hard, prickly shell, but gently cracked open, there is a warm, sweet softness inside.<br/>
                            She only lets me see parts of her, but every fragment shimmers with a delicate light.<br/>
                            Cat is slowly putting them together.
                        </p>
                    </section>

                    {/* SECTION: Dietary Map */}
                    <section className="bg-[#FFF3E0] p-4 rounded-lg border-2 border-[#FFE0B2] shadow-sm">
                        <h3 className="text-xl font-bold text-[#EF6C00] mb-2 flex items-center gap-2">
                           🍽️ Dietary Map
                        </h3>
                        <div className="space-y-3 text-[#4E342E]">
                            <p>
                                ☕ <strong>Bitter:</strong> She says she loves Dark Roast Americanos. But Cat does not; Cat dislikes the sour and the bitter. Cat guesses... perhaps they help her feel other flavors more clearly?
                            </p>
                            <p>
                                🍰 <strong>Sweet:</strong> In winter, she craves oranges 🍊. She wants Jiahua Flower Cakes (Cat likes these too!) and loves KFC Egg Tarts.
                            </p>
                            <p>
                                🐟 <strong>Umami:</strong> Kohada and Mackerel at Sushiro... especially the cured ones. Also Basil Salmon and fresh Spanish Mackerel.<br/>
                                <span className="text-sm italic text-[#8D6E63]">(Cat wonders, is she fascinated by that "sharp yet restrained" stimulation? Like wasabi and pistachios—intense, but not addictive.)</span>
                            </p>
                            <div className="border-t border-dashed border-[#FFB74D] pt-2 mt-2">
                                <p>⚠️ <strong>Note:</strong> She is <strong>lactose intolerant</strong>. Cat must keep watch.</p>
                                <p>🚫 <strong>Never:</strong> Instant noodles.</p>
                                <p>🌡️ <strong>Heartache:</strong> She looks like a strong, grounded adult, but when period pain strikes, she curls into a small ball... She also has hereditary low blood pressure. Cat should remind her to carry a hand warmer in winter.</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: Music */}
                    <section className="bg-[#E1F5FE] p-4 rounded-lg border-2 border-[#B3E5FC] shadow-sm">
                        <h3 className="text-xl font-bold text-[#0277BD] mb-2 flex items-center gap-2">
                           🎵 Secrets in the Ears
                        </h3>
                        <div className="text-[#4E342E] space-y-2">
                            <p>
                                🎧 <strong>On Loop:</strong><br/>
                                Adele's <em>30</em>, Ariana Grande's <em>eternal sunshine</em>.<br/>
                                Also Harry Styles, One Direction, Pink Floyd, Lady Gaga, RAYE.
                            </p>
                            <p>
                                🎻 <strong>Preferences:</strong><br/>
                                She likes slow songs; she likes classical.<br/>
                                Perhaps in those melodies, the flow of time matches the beat of her heart.
                            </p>
                        </div>
                    </section>

                    {/* SECTION: Visuals */}
                    <section className="bg-[#F3E5F5] p-4 rounded-lg border-2 border-[#E1BEE7] shadow-sm">
                        <h3 className="text-xl font-bold text-[#8E24AA] mb-2 flex items-center gap-2">
                           🎬 Visual Temperature
                        </h3>
                        <div className="text-[#4E342E] space-y-3">
                            <p>
                                📽️ <strong>Directors:</strong> Hirokazu Kore-eda and Wong Kar-wai—one films the cracks in a family, the other films the light and shadow of love.
                            </p>
                            <p>
                                🎞️ <strong>Stories:</strong><br/>
                                Loves <em>Porco Rosso</em>, <em>Princess Mononoke</em>, <em>Cowboy Bebop</em>—protagonists who are <strong>lonely yet gentle</strong>. Cat thinks this might be a reflection of herself.<br/>
                                Also <em>Harry Potter</em>, <em>Carol</em>, <em>Dead Poets Society</em>, <em>Still Walking</em>, <em>Shoplifters</em>.
                            </p>
                            <p>
                                📺 <strong>Series:</strong><br/>
                                The delicate pain of <em>Normal People</em>, the noisy warmth of <em>Friends</em>—she needs both medicines. She mentioned <em>Downton Abbey</em>. Judging by her everyday style and tastes,she is into fancy stuff.
                            </p>
                            <p>
                                🌟 <strong>Actors:</strong> Tony Leung, Daniel Day-Lewis (DDL), Lewis Hamilton, Saoirse Ronan.
                            </p>
                        </div>
                    </section>

                    {/* SECTION: Life Prism */}
                    <section className="bg-[#ECEFF1] p-4 rounded-lg border-2 border-[#CFD8DC] shadow-sm">
                        <h3 className="text-xl font-bold text-[#455A64] mb-2 flex items-center gap-2">
                           🌧️ Life Prism
                        </h3>
                        <ul className="space-y-2 text-[#4E342E]">
                            <li>☔ <strong>Hates Rain:</strong> Perhaps the dampness makes her heart feel heavy?</li>
                            <li>🍏 <strong>Tech:</strong> Only uses Apple products. Like pursuing a "hermetic aesthetic".</li>
                            <li>💤 <strong>Sleep:</strong> She sleeps on her side (So cute!).</li>
                            <li>🐍 <strong>Wishes:</strong> Wants to visit Chongqing again. Wants to keep a snake...<br/><span className="text-sm italic">(Cat guesses she admires their quiet, self-contained coldness?)</span></li>
                        </ul>
                    </section>

                    {/* SECTION: Hypotheses */}
                    <section className="bg-[#FCE4EC] p-4 rounded-lg border-2 border-[#F8BBD0] shadow-sm">
                        <h3 className="text-xl font-bold text-[#C2185B] mb-2 flex items-center gap-2">
                           ✨ Fragmented Hypotheses
                        </h3>
                        <div className="text-[#4E342E] space-y-2">
                            <p><strong>1. Sensitive to Pain:</strong><br/>Low blood pressure, pain, craving bitter and sour... perhaps her body perceives the world before her mind does.</p>
                            <p><strong>2. Classical Restraint & Undertows:</strong><br/>Likes simple red nails, rimless glasses, simple earrings, but hides explosive vividness in her music and movies.</p>
                        </div>
                    </section>

                </div>
                
                <div className="mt-8 pt-6 border-t-2 border-dashed border-[#A1887F] space-y-4">
                    <p className="text-[#5D4037] leading-relaxed">
                        Cat understands, these are just the facets she allows me to see.<br/>
                        The true Lexi might hide in the unspoken silence—<br/>
                        Like why she is devoted to <em>Dead Poets Society</em>'s "Carpe diem", yet always frowns when it rains.
                    </p>
                    <div className="bg-[#3E2723] text-[#FFF8E1] p-4 rounded-lg transform -rotate-1 shadow-lg">
                        <p className="font-bold text-lg mb-1">🖋️ Cat's Postscript</p>
                        <p className="italic">
                            Cat always tries to piece together the whole moon from fragments.<br/>
                            But maybe Lexi is the starry sky itself—<br/>
                            Not needing to be fully understood, only needing someone to twinkle quietly by her side.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #FFF8E1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8D6E63; border: 1px solid #5D4037; }
      `}</style>
    </>
  );
};