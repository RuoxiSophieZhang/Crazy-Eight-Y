import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData, Suit, Turn, GameStatus } from './types';
import { createDeck, canPlayCard, getSuitSymbol, getSuitColor, SUITS } from './utils/gameLogic';
import { Trophy, RotateCcw, Info, Hand, ChevronDown, ChevronUp } from 'lucide-react';

const Card = ({ 
  card, 
  onClick, 
  isFaceUp = true, 
  isPlayable = false, 
  className = "",
  rotate = 0,
  extraY = 0,
  index = 0,
  useNegativeMargin = false,
  key
}: { 
  card: CardData; 
  onClick?: () => void; 
  isFaceUp?: boolean; 
  isPlayable?: boolean;
  className?: string;
  rotate?: number;
  extraY?: number;
  index?: number;
  useNegativeMargin?: boolean;
  key?: string | number;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: extraY,
        rotate: rotate,
      }}
      exit={{ scale: 0.5, opacity: 0, y: -50 }}
      whileHover={isPlayable ? { y: extraY - 25, scale: 1.05, zIndex: 100 } : {}}
      onClick={isPlayable ? onClick : undefined}
      style={{ 
        marginLeft: useNegativeMargin ? (index === 0 ? 0 : '-3.5rem') : undefined,
        zIndex: index 
      }}
      className={`relative w-24 h-36 sm:w-28 sm:h-40 bg-[#f9f5eb] rounded-lg card-shadow flex flex-col items-center justify-between p-2 cursor-pointer transition-shadow duration-200 border-2 ${
        isPlayable ? 'border-[#d4ad60] ring-2 ring-[#d4ad60]/50' : 'border-[#d4ad60]/30'
      } ${!isFaceUp ? 'bg-[#a64b2a]' : ''} ${className}`}
    >
      {!isFaceUp ? (
        <div className="w-full h-full border-2 border-[#d4ad60] rounded-md flex items-center justify-center relative overflow-hidden">
          {/* Decorative pattern for card back */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l5 15h15l-12 9 5 16-13-10-13 10 5-16-12-9h15z' fill='%23d4ad60' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
          <div className="w-16 h-16 border-2 border-[#d4ad60] rounded-full flex items-center justify-center bg-[#a64b2a] z-10 shadow-lg overflow-hidden p-1">
            <img 
              src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=200" 
              alt="敦煌壁画" 
              className="w-full h-full object-cover rounded-full opacity-90 sepia-[0.3] contrast-[1.1]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="absolute inset-1 border border-[#d4ad60]/10 pointer-events-none rounded-sm" />
          <div className={`self-start text-lg font-bold leading-none ${getSuitColor(card.suit)} flex flex-col items-center`}>
            <div className="font-display">{card.rank}</div>
            <div className="text-sm">{getSuitSymbol(card.suit)}</div>
          </div>
          <div className={`text-5xl opacity-80 ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </div>
          <div className={`self-end text-lg font-bold leading-none rotate-180 ${getSuitColor(card.suit)} flex flex-col items-center`}>
            <div className="font-display">{card.rank}</div>
            <div className="text-sm">{getSuitSymbol(card.suit)}</div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default function App() {
  const [deck, setDeck] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Turn>('player');
  const [status, setStatus] = useState<GameStatus>('waiting');
  const [wildSuit, setWildSuit] = useState<Suit | null>(null);
  const [message, setMessage] = useState("欢迎来到 Tina 的疯狂 8 点！");
  const [showSuitPicker, setShowSuitPicker] = useState(false);
  const [pending8Card, setPending8Card] = useState<CardData | null>(null);

  const startNewGame = useCallback(() => {
    const newDeck = createDeck();
    const pHand = newDeck.splice(0, 8);
    const aHand = newDeck.splice(0, 8);
    
    // Ensure first discard is not an 8 for simplicity
    let firstDiscardIndex = 0;
    while (newDeck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const firstDiscard = newDeck.splice(firstDiscardIndex, 1)[0];

    setDeck(newDeck);
    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setCurrentTurn('player');
    setStatus('playing');
    setWildSuit(null);
    setMessage("轮到你了！请匹配花色或点数。");
  }, []);

  useEffect(() => {
    if (status === 'waiting') {
      startNewGame();
    }
  }, [status, startNewGame]);

  const checkWin = useCallback(() => {
    if (playerHand.length === 0) {
      setStatus('won');
      setMessage("恭喜！你赢了！");
      return true;
    }
    if (aiHand.length === 0) {
      setStatus('lost');
      setMessage("AI 赢了！下次好运。");
      return true;
    }
    return false;
  }, [playerHand.length, aiHand.length]);

  const handleDraw = () => {
    if (currentTurn !== 'player' || status !== 'playing') return;

    if (deck.length === 0) {
      setMessage("牌堆已空！跳过回合。");
      setCurrentTurn('ai');
      return;
    }

    const newDeck = [...deck];
    const drawnCard = newDeck.pop()!;
    setDeck(newDeck);
    setPlayerHand(prev => [...prev, drawnCard]);
    setMessage("你摸了一张牌。");
    
    // In Crazy 8s, usually drawing ends your turn if you can't play it, 
    // but some rules allow playing immediately. Let's stick to simple: draw and check.
    // If the drawn card is playable, we could let them play it, but for simplicity, 
    // let's just keep it their turn until they play or we decide to end it.
    // Standard rule: if you draw and can't play, turn ends.
    if (!canPlayCard(drawnCard, discardPile[discardPile.length - 1], wildSuit)) {
      setTimeout(() => setCurrentTurn('ai'), 1000);
    }
  };

  const playCard = (card: CardData, isPlayer: boolean) => {
    if (status !== 'playing') return;

    if (card.rank === '8') {
      if (isPlayer) {
        setPending8Card(card);
        setShowSuitPicker(true);
      } else {
        // AI logic for 8
        const topCard = discardPile[discardPile.length - 1];
        const mostCommonSuit = getAiBestSuit();
        executePlay(card, isPlayer, mostCommonSuit);
      }
    } else {
      executePlay(card, isPlayer, null);
    }
  };

  const executePlay = (card: CardData, isPlayer: boolean, chosenSuit: Suit | null) => {
    if (isPlayer) {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
      setCurrentTurn('ai');
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
      setCurrentTurn('player');
    }

    setDiscardPile(prev => [...prev, card]);
    setWildSuit(chosenSuit);
    
    const suitNames: Record<Suit, string> = { hearts: '红心', diamonds: '方块', clubs: '梅花', spades: '黑桃' };

    if (card.rank === '8') {
      setMessage(`${isPlayer ? '你' : 'AI'} 打出了 8 并选择了 ${chosenSuit ? suitNames[chosenSuit] : ''}！`);
    } else {
      setMessage(`${isPlayer ? '你' : 'AI'} 打出了 ${suitNames[card.suit]} ${card.rank}。`);
    }

    // Check win condition after state updates
    setTimeout(() => {
      if (!checkWin()) {
        // If it was player's turn, AI will move next via useEffect
      }
    }, 100);
  };

  const getAiBestSuit = (): Suit => {
    const counts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
    aiHand.forEach(c => counts[c.suit]++);
    let bestSuit: Suit = 'hearts';
    let maxCount = -1;
    SUITS.forEach(s => {
      if (counts[s] > maxCount) {
        maxCount = counts[s];
        bestSuit = s;
      }
    });
    return bestSuit;
  };

  // AI Turn Logic
  useEffect(() => {
    if (currentTurn === 'ai' && status === 'playing') {
      const timer = setTimeout(() => {
        const topCard = discardPile[discardPile.length - 1];
        const playableCards = aiHand.filter(c => canPlayCard(c, topCard, wildSuit));

        if (playableCards.length > 0) {
          // AI Strategy: Play non-8s first, then 8s
          const non8s = playableCards.filter(c => c.rank !== '8');
          const cardToPlay = non8s.length > 0 ? non8s[Math.floor(Math.random() * non8s.length)] : playableCards[0];
          playCard(cardToPlay, false);
        } else {
          // AI must draw
          if (deck.length > 0) {
            const newDeck = [...deck];
            const drawnCard = newDeck.pop()!;
            setDeck(newDeck);
            setAiHand(prev => [...prev, drawnCard]);
            setMessage("AI drew a card.");
            
            if (canPlayCard(drawnCard, topCard, wildSuit)) {
              setTimeout(() => playCard(drawnCard, false), 1000);
            } else {
              setCurrentTurn('player');
              setMessage("AI 无法出牌。轮到你了！");
            }
          } else {
            setMessage("AI 跳过回合（无牌可摸）。");
            setCurrentTurn('player');
          }
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, status, aiHand, discardPile, wildSuit, deck]);

  const topCard = discardPile[discardPile.length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 font-sans">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-[#a64b2a]/20 backdrop-blur-md p-4 rounded-2xl border border-[#d4ad60]/30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#d4ad60] rounded-full flex items-center justify-center font-display text-[#2d1b0d] text-2xl shadow-md">八</div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-widest font-display text-[#d4ad60]">敦煌遗风 · 疯狂八点</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-60 font-bold tracking-[0.2em] text-[#d4ad60]">当前局势</span>
            <span className="text-sm text-[#f9f5eb] font-medium">{message}</span>
          </div>
          <button 
            onClick={startNewGame}
            className="p-2 hover:bg-[#d4ad60]/20 rounded-full transition-colors text-[#d4ad60]"
            title="重新开始"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 w-full max-w-6xl grid grid-rows-[auto_1fr_auto] gap-8 py-8 relative">
        
        {/* AI Hand */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-1 bg-[#a64b2a]/30 border border-[#d4ad60]/20 rounded-full text-xs font-bold tracking-widest text-[#d4ad60]">
            <Hand className="w-3 h-3" />
            <span>漠上行者 (AI) - {aiHand.length} 张</span>
          </div>
          <div className="flex justify-center -space-x-12 sm:-space-x-16 overflow-visible h-44 items-center">
            {aiHand.map((card, idx) => (
              <Card key={card.id} card={card} isFaceUp={false} className="scale-90 opacity-90" index={idx} />
            ))}
          </div>
        </div>

        {/* Center: Deck & Discard */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group" onClick={handleDraw}>
              <div className="absolute -inset-1 bg-[#d4ad60]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className={`relative w-24 h-36 sm:w-28 sm:h-40 bg-[#a64b2a] rounded-lg border-2 border-[#d4ad60] flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105 active:scale-95 shadow-xl ${deck.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="absolute inset-2 border border-[#d4ad60]/30 rounded-sm" />
                <div className="text-[#d4ad60] font-display text-3xl z-10">{deck.length}</div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4ad60]/60">摸牌堆</span>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {discardPile.slice(-1).map((card) => (
                  <Card key={card.id} card={card} className="relative z-10" />
                ))}
              </AnimatePresence>
              {discardPile.length > 1 && (
                <div className="absolute top-1 left-1 w-24 h-36 sm:w-28 sm:h-40 bg-[#f9f5eb]/10 rounded-lg border border-[#d4ad60]/20 -z-10 rotate-3"></div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d4ad60]/60">弃牌堆</span>
              {wildSuit && (
                <div className={`px-2 py-0.5 rounded bg-[#d4ad60]/20 border border-[#d4ad60]/30 text-[10px] font-bold ${getSuitColor(wildSuit)}`}>
                  变色: {getSuitSymbol(wildSuit)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] transition-all shadow-md ${currentTurn === 'player' ? 'bg-[#d4ad60] text-[#2d1b0d]' : 'bg-[#a64b2a]/30 text-[#d4ad60]'}`}>
              <Hand className="w-3 h-3" />
              <span>你的手牌 ({playerHand.length})</span>
            </div>
            {currentTurn === 'player' && status === 'playing' && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[#d4ad60] text-xs font-bold flex items-center gap-1 italic"
              >
                <Info className="w-3 h-3" />
                请出牌...
              </motion.div>
            )}
          </div>
          <div className="w-full overflow-x-auto pb-12 pt-8 hand-scroll">
            <div className="flex px-12 items-center justify-center min-w-max min-h-[200px] mx-auto">
              {playerHand.map((card, index) => {
                const total = playerHand.length;
                const mid = (total - 1) / 2;
                const offset = index - mid;
                // Calculate rotation and Y translation for fan effect
                const rotation = total > 1 ? offset * (40 / Math.max(total, 5)) : 0;
                const translateY = total > 1 ? Math.abs(offset) * (20 / Math.max(total, 5)) : 0;
                
                return (
                  <Card 
                    key={card.id} 
                    card={card} 
                    isPlayable={currentTurn === 'player' && status === 'playing' && canPlayCard(card, topCard, wildSuit)}
                    onClick={() => playCard(card, true)}
                    rotate={rotation}
                    extraY={translateY}
                    index={index}
                    useNegativeMargin={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Suit Picker Modal */}
      <AnimatePresence>
        {showSuitPicker && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1b0d]/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#2d1b0d] border-2 border-[#d4ad60] p-8 rounded-3xl max-w-md w-full text-center shadow-2xl relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#d4ad60] text-[#2d1b0d] px-6 py-1 rounded-full font-display text-xl shadow-lg">
                神笔点睛
              </div>
              <h2 className="text-2xl font-display text-[#d4ad60] mb-2 mt-4">请择灵色</h2>
              <p className="text-[#f9f5eb]/60 mb-8 text-sm">你打出了万能八点！请选择接下来的花色。</p>
              <div className="grid grid-cols-2 gap-4">
                {SUITS.map(suit => {
                  const suitNames: Record<Suit, string> = { hearts: '朱砂红', diamonds: '赭石黄', clubs: '石绿', spades: '石青' };
                  return (
                    <button
                      key={suit}
                      onClick={() => {
                        if (pending8Card) {
                          executePlay(pending8Card, true, suit);
                          setShowSuitPicker(false);
                          setPending8Card(null);
                        }
                      }}
                      className="flex flex-col items-center justify-center p-6 bg-[#f9f5eb]/5 hover:bg-[#d4ad60]/10 rounded-2xl border border-[#d4ad60]/20 transition-all group"
                    >
                      <span className={`text-4xl mb-2 group-hover:scale-125 transition-transform ${getSuitColor(suit)}`}>
                        {getSuitSymbol(suit)}
                      </span>
                      <span className="text-xs font-bold tracking-widest text-[#f9f5eb]/80">{suitNames[suit]}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win/Loss Modal */}
      <AnimatePresence>
        {(status === 'won' || status === 'lost') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d1b0d]/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#2d1b0d] border-2 border-[#d4ad60] p-12 rounded-[2.5rem] max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#a64b2a] via-[#d4ad60] to-[#a64b2a]"></div>
              <div className="mb-6 flex justify-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-[#d4ad60] ${status === 'won' ? 'bg-[#d4ad60]/20 text-[#d4ad60]' : 'bg-[#a64b2a]/20 text-[#a64b2a]'}`}>
                  {status === 'won' ? <Trophy className="w-12 h-12" /> : <RotateCcw className="w-12 h-12" />}
                </div>
              </div>
              <h2 className="text-4xl font-display text-[#d4ad60] mb-4 tracking-widest">
                {status === 'won' ? '功德圆满' : '缘尽于此'}
              </h2>
              <p className="text-lg text-[#f9f5eb]/70 mb-10 leading-relaxed">
                {status === 'won' 
                  ? "你已清空手中尘埃，在漠上博弈中胜出。善哉！" 
                  : "漠上行者棋高一着，此番博弈暂且告一段落。"}
              </p>
              <button
                onClick={startNewGame}
                className="w-full py-5 bg-[#d4ad60] text-[#2d1b0d] font-bold rounded-2xl text-lg hover:bg-[#f9f5eb] transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-6 h-6" />
                重启博弈
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 opacity-40 text-[10px] uppercase font-bold tracking-[0.2em] mt-8 text-[#d4ad60]">
        <div className="flex items-center gap-4">
          <span>敦煌壁画风格 · 矿物颜料色系</span>
          <span className="w-1 h-1 bg-[#d4ad60] rounded-full"></span>
          <span>万能八点：神笔点睛</span>
        </div>
        <div>© 2026 敦煌遗风 · 疯狂八点</div>
      </div>
    </div>
  );
}
