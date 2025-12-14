import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface ChessGameProps {
  onYancyMessage: (msg: string) => void;
}

export const ChessGame: React.FC<ChessGameProps> = ({ onYancyMessage }) => {
  const [game, setGame] = useState(new Chess());
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  // Safety fallback: if Chessboard import failed or is undefined
  const SafeChessboard = (Chessboard as any) || (() => (
      <div className="w-full h-full flex items-center justify-center text-red-400 text-center p-4">
          Chessboard failed to load.<br/>(Library Error)
      </div>
  ));

  // Reset game when opening modal
  useEffect(() => {
    if (isOpen) {
        // Only restart if game was finished or empty
        if (game.isGameOver() || game.moveNumber() <= 1) {
            restartGame();
        }
    }
  }, [isOpen]);

  // AI Turn Effect: Watches game state and triggers Yancy if it's black's turn
  useEffect(() => {
    if (!isOpen || game.isGameOver()) return;

    // If it's Black's turn (Yancy), schedule a move
    if (game.turn() === 'b') {
        const timeoutId = setTimeout(() => {
            makeYancyMove();
        }, 1000 + Math.random() * 1000); // 1-2s thinking time

        return () => clearTimeout(timeoutId);
    }
  }, [game, isOpen]);

  const makeYancyMove = () => {
    // Safety check
    if (game.turn() !== 'b' || game.isGameOver()) return;

    const gameCopy = new Chess(game.fen());
    const possibleMoves = gameCopy.moves();

    if (possibleMoves.length === 0) return;

    // Yancy's Logic:
    // 1. Prefer captures (Aggressive Cat)
    // 2. Random otherwise
    const captures = possibleMoves.filter(m => m.includes('x'));
    let moveStr = '';
    
    // 40% chance to pick a capture if available, else random
    if (captures.length > 0 && Math.random() < 0.4) {
        moveStr = captures[Math.floor(Math.random() * captures.length)];
    } else {
        moveStr = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    try {
        const resultMove = gameCopy.move(moveStr);
        setGame(gameCopy);
        setHistory(prev => [...prev, `😼 Yancy: ${resultMove.san}`]);
        
        // Commentary
        if (gameCopy.isCheckmate()) {
            onYancyMessage("Checkmate! I win! Do I get a treat? 🐾");
            setResult("Yancy Wins!");
        } else if (gameCopy.isCheck()) {
            onYancyMessage("Check! Watch your paws! 😼");
        } else if (resultMove.san.includes('x')) {
            onYancyMessage("Swat! I took that piece.");
        } else if (gameCopy.isDraw()) {
            setResult("Draw!");
            onYancyMessage("A draw... acceptable.");
        }

    } catch (e) {
        console.error("Yancy failed to move:", e);
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    // Only allow move if it is White's turn
    if (game.turn() !== 'w' || game.isGameOver()) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to Queen for simplicity
      });

      if (move === null) return false;

      setGame(gameCopy);
      setHistory(prev => [...prev, `👤 You: ${move.san}`]);

      // Check User's Move Result
      if (gameCopy.isGameOver()) {
         if (gameCopy.isCheckmate()) {
             setResult("You Win!");
             onYancyMessage("Meow?! You won... impressive for a human.");
         } else if (gameCopy.isDraw()) {
             setResult("Draw!");
             onYancyMessage("It's a tie. Let's nap instead.");
         }
      } else {
         // Encouragement or reaction during game
         if (gameCopy.isCheck()) {
            onYancyMessage("Ouch! You put me in check!");
         }
      }

      return true;
    } catch (e) {
      return false;
    }
  };

  const restartGame = () => {
      const newGame = new Chess();
      setGame(newGame);
      setHistory([]);
      setResult(null);
      onYancyMessage("Let's play! You go first (White).");
  };

  return (
    <>
      {/* Chess Board Icon on Ground */}
      <div 
        className="absolute z-20 cursor-pointer group hover:scale-110 transition-transform"
        style={{ bottom: '40px', right: '30%' }}
        onClick={() => setIsOpen(true)}
      >
         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white text-black px-2 py-1 rounded pixel-font whitespace-nowrap pointer-events-none border border-black shadow-lg">
             Play Chess
         </div>
         {/* Pixel Art Chess Board Icon */}
         <svg width="40" height="30" viewBox="0 0 16 12" shapeRendering="crispEdges">
             <rect x="0" y="2" width="16" height="10" fill="#5D4037" />
             <rect x="1" y="3" width="14" height="8" fill="#3E2723" />
             <g fill="#D7CCC8">
                 <rect x="2" y="4" width="3" height="2" />
                 <rect x="8" y="4" width="3" height="2" />
                 <rect x="5" y="6" width="3" height="2" />
                 <rect x="11" y="6" width="3" height="2" />
                 <rect x="2" y="8" width="3" height="2" />
                 <rect x="8" y="8" width="3" height="2" />
             </g>
             <rect x="6" y="0" width="2" height="4" fill="#FFF" />
             <rect x="5" y="1" width="4" height="1" fill="#FFF" />
         </svg>
      </div>

      {/* Game Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-[#3E2723] w-full max-w-lg p-2 rounded-lg shadow-2xl border-4 border-[#8D6E63] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="w-full flex justify-between items-center px-2 mb-2">
                <div className="flex items-center gap-2">
                   <span className="text-2xl">♟️</span>
                   <h2 className="text-white pixel-font text-2xl tracking-widest">YOU vs YANCY</h2>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[#D7CCC8] hover:text-white font-bold text-xl">✕</button>
            </div>

            {/* Board Container */}
            <div className="w-full aspect-square max-w-[400px] border-4 border-[#2D1B15] bg-[#2D1B15]">
                {/* Render SafeChessboard with standard props, ignoring TS exact match for 'any' cast */}
                <SafeChessboard 
                    position={game.fen()} 
                    onPieceDrop={onDrop}
                    arePiecesDraggable={!result && game.turn() === 'w'} // Only User (White) can drag, and only if game isn't over
                    boardOrientation="white"
                    customDarkSquareStyle={{ backgroundColor: '#795548' }}
                    customLightSquareStyle={{ backgroundColor: '#D7CCC8' }}
                    animationDuration={300}
                />
            </div>

            {/* Controls & Status */}
            <div className="w-full mt-4 flex justify-between items-center px-2">
                <div className="text-[#D7CCC8] pixel-font text-lg">
                    {result ? (
                        <span className="text-yellow-400 animate-pulse font-bold">{result}</span>
                    ) : (
                        <span>
                            Turn: <span className={game.turn() === 'w' ? 'text-white font-bold' : 'text-gray-400'}>You</span> vs <span className={game.turn() === 'b' ? 'text-white font-bold' : 'text-gray-400'}>Yancy</span>
                            {game.turn() === 'b' && <span className="animate-pulse ml-2 text-xs">Thinking...</span>}
                        </span>
                    )}
                </div>
                <button 
                    onClick={restartGame}
                    className="bg-[#5D4037] hover:bg-[#6D4C41] text-white px-4 py-1 border-2 border-[#8D6E63] pixel-font active:translate-y-1"
                >
                    Restart
                </button>
            </div>

            {/* Mini Log */}
            <div className="w-full h-24 mt-2 bg-black/30 p-2 overflow-y-auto pixel-font text-sm text-[#BCAAA4] border border-[#5D4037] rounded custom-scrollbar">
                {history.length === 0 && <div className="text-center italic opacity-50 mt-4">Game started...</div>}
                {history.map((move, i) => (
                    <div key={i} className="border-b border-white/5 py-1">{move}</div>
                ))}
                {/* Auto-scroll anchor */}
                <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })} />
            </div>

          </div>
        </div>
      )}
    </>
  );
};