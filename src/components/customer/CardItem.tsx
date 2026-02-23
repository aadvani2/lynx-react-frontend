import React from 'react';
import type { SavedCard } from '../../hooks/useSavedCards';

interface CardItemProps {
  card: SavedCard;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
  onDelete: (cardId: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  isSelected,
  onSelect,
  onDelete
}) => {
  // Utility function to capitalize first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  return (
    <div
      className="col-md-12 col-lg-12 col-xl-12 col-xxl-6 col-sm-12 payment-card"
      id={`card-${card.id}`}
      data-id={card.id}
    >
      <a
        href="javascript:void(0)"
        className={`card lift manage-employees manage-employees-mb ${isSelected ? 'selected' : ''}`}
        data-id={card.id}
        onClick={() => onSelect(card.id)}
      >
        <div className="card-body p-3" style={{ minHeight: '80px' }}>
          <span className="row justify-content-between align-items-center h-100">
            <span className="col-md-12 d-flex text-body">
              <div className="profile-image-container me-3">
                <span className="icon fs-lg"><i className="uil uil-card-atm"></i></span>
              </div>
              <div className="desc">
                <p className="mb-0 name fw-medium">{capitalizeFirstLetter(card.type)}</p>
                <p className="mb-0 name fw-medium">**** **** **** {card.last4}</p>
                <p className="mb-0 fs-14 email">
                  {card.exp_month}/{card.exp_year}
                  <span></span>
                </p>
              </div>
              <div className="edit-delete d-flex flex-column justify-content-between align-items-end" id={`default-card-${card.id}`} style={{ minHeight: '50px' }}>
                <span>
                  <i
                    className="uil uil-trash-alt text-danger fs-20 delete-card"
                    data-id={card.id}
                    data-default={card.is_default ? 1 : 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(card.id);
                    }}
                    style={{ cursor: 'pointer' }}
                  ></i>
                </span>
                {card.is_default && (
                  <span className="default-card">
                    <span className="badge bg-green rounded-pill primaryText text-primary">Primary</span>
                    <span className="badge-uil"><i className="uil uil-check-circle text-green fs-20 " data-id="'+cardId+'" /></span>
                  </span>
                )}
                {!card.is_default && (
                  <div style={{ height: '24px' }}></div>
                )}
              </div>
            </span>
          </span>
        </div>
      </a>
    </div>
  );
};

export default CardItem;
