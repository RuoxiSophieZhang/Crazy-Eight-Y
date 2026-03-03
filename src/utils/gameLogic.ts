import { Suit, Rank, CardData } from '../types';

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
      });
    });
  });
  return shuffle(deck);
};

export const shuffle = (deck: CardData[]): CardData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const canPlayCard = (card: CardData, topCard: CardData, wildSuit: Suit | null): boolean => {
  // 8 is always playable
  if (card.rank === '8') return true;

  const targetSuit = wildSuit || topCard.suit;
  
  // Match suit or rank
  return card.suit === targetSuit || card.rank === topCard.rank;
};

export const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};

export const getSuitColor = (suit: Suit): string => {
  switch (suit) {
    case 'hearts': return 'text-[#a64b2a]'; // Mineral Red
    case 'diamonds': return 'text-[#d4ad60]'; // Gold/Ochre
    case 'clubs': return 'text-[#4e6c50]'; // Mineral Green
    case 'spades': return 'text-[#1a374d]'; // Lapis Blue
    default: return 'text-gray-900';
  }
};
