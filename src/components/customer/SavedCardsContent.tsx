import React, { Suspense, lazy } from 'react';
import Swal from 'sweetalert2';
import { useSavedCards } from '../../hooks/useSavedCards';
import CardsList from './CardsList';

const StripeElementsWrapper = lazy(() => import('../public/booking/StripeElementsWrapper'));
const StripeCardForm = lazy(() => import('./StripeCardForm'));

interface SavedCardsContentProps {
  setActivePage: (page: string) => void;
}

// Main Component - Pure UI with Hook Integration
const SavedCardsContent: React.FC<SavedCardsContentProps> = ({ setActivePage }) => {
  // All functionality comes from the custom hook
  const {
    cards,
    loading,
    error,
    selectedCard,
    showAddCard,
    handleAddCard,
    handleCloseAddCard,
    handleSaveCard,
    handleDeleteCard,
    handleCardSelect,
    setError,
  } = useSavedCards();

  return (
    <div id="loadView">
      <div className="card">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button
              className="btn btn-primary btn-sm rounded-pill"
              onClick={() => setActivePage("dashboard")}
            >
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Saved Cards</h4>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary rounded-pill"
            id="add_card_btn"
            onClick={handleAddCard}
          >
            <i className="uil uil-plus" />&nbsp;Add New Card
          </button>
        </div>

        {showAddCard && (
          <Suspense fallback={null}>
            <StripeElementsWrapper>
              <StripeCardForm 
                onSave={handleSaveCard} 
                onClose={handleCloseAddCard} 
                onSuccess={() => {
                  Swal.fire({
                    title: 'Success!',
                    text: 'Card saved successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                }} 
                onError={(msg) => setError(msg)} 
              />
            </StripeElementsWrapper>
          </Suspense>
        )}

        <div className="card-body">
          {!showAddCard && error && <div className="alert alert-danger">{error}</div>}
          
          <div className="row" id="card-list">
            <div className="alert alert-primary alert-icon" role="alert">
              <i className="uil uil-card-atm"></i>Select card and click set as primary button to set card as primary card
            </div>

            <CardsList
              cards={cards}
              loading={loading}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              onDeleteCard={handleDeleteCard}
            />

            <div className="alert alert-warning alert-icon mt-4" role="alert">
              <i className="uil uil-info-circle"></i>Note! You can set only one card as primary card. For subscription
              renewal, primary card will be charged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCardsContent;
