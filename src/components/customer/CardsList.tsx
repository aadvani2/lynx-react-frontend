import React from 'react';
import type { SavedCard } from '../../hooks/useSavedCards';
import CardItem from './CardItem';

interface CardsListProps {
  cards: SavedCard[];
  loading: boolean;
  selectedCard: string | null;
  onCardSelect: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
}

const CardsList: React.FC<CardsListProps> = ({ 
  cards, 
  loading, 
  selectedCard, 
  onCardSelect, 
  onDeleteCard 
}) => {
  if (loading) {
    return <div className="text-center py-3">Loading...</div>;
  }

  if (!cards.length) {
    return (
      <div className="alert alert-warning alert-icon mt-4" role="alert">
        <i className="uil uil-info-circle"></i>No saved cards found.
      </div>
    );
  }

  return (
    <>
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          isSelected={selectedCard === card.id}
          onSelect={onCardSelect}
          onDelete={onDeleteCard}
        />
      ))}
    </>
  );
};

export default CardsList;
