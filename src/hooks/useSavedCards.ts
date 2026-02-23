import { useCallback, useEffect, useMemo, useState } from 'react';
import { customerService } from '../services/customerServices/customerService';
import Swal from '../lib/swal';

export interface SavedCard {
  type: string;
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default?: boolean;
}

interface SavedCardsResponseShape {
  cards?: SavedCard[];
  allCards?: SavedCard[];
  data?: { cards?: SavedCard[]; allCards?: SavedCard[] } | SavedCard[];
}

function extractCards(raw: unknown): SavedCard[] {
  if (typeof raw !== 'object' || raw === null) return [];
  const obj = raw as SavedCardsResponseShape;
  if (Array.isArray(obj.cards)) return obj.cards;
  if (Array.isArray(obj.allCards)) return obj.allCards;
  if (Array.isArray(obj.data)) return obj.data;
  if (obj.data && typeof obj.data === 'object') {
    const inData = obj.data as { cards?: SavedCard[]; allCards?: SavedCard[] };
    if (Array.isArray(inData.cards)) return inData.cards;
    if (Array.isArray(inData.allCards)) return inData.allCards;
  }
  return [];
}

export interface UseSavedCardsReturn {
  // State
  cards: SavedCard[];
  loading: boolean;
  error: string | null;
  success: string | null;
  selectedCard: string | null;
  showAddCard: boolean;
  
  // Actions
  loadCards: () => Promise<void>;
  handleAddCard: () => void;
  handleCloseAddCard: () => void;
  handleSaveCard: () => void;
  handleDeleteCard: (cardId: string) => Promise<void>;
  handleSetAsPrimary: (cardId: string) => Promise<void>;
  handleCardSelect: (cardId: string) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

export const useSavedCards = (): UseSavedCardsReturn => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  // SweetAlert styling utility
  const addSweetAlertStyles = useCallback(() => {
    const style = document.createElement('style');
    style.textContent = `
      .swal2-close {
        font-family: "Unicons", "Arial", sans-serif !important;
        font-size: 0 !important;
        position: absolute !important;
        top: 0.7rem !important;
        right: 0.7rem !important;
        width: 1.8rem !important;
        height: 1.8rem !important;
        background: rgba(0, 0, 0, 0.08) !important;
        border-radius: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        color: #0d6efd !important;
        border: none !important;
        cursor: pointer !important;
        transition: background 0.2s ease-in-out !important;
      }
      .swal2-close:before {
        content: "×" !important;
        font-size: 1.2rem !important;
        font-weight: bold !important;
        line-height: 1 !important;
      }
      .swal2-close:hover {
        background: rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
    return style;
  }, []);

  const removeSweetAlertStyles = useCallback((style: HTMLStyleElement) => {
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await customerService.getSavedCards({ user_timezone: timezoneHours });
      const raw = (res && (res as unknown as { data?: unknown }).data) ?? res;
      const list = extractCards(raw);
      setCards(Array.isArray(list) ? list : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load saved cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [timezoneHours]);

  const handleAddCard = () => {
    setShowAddCard(true);
    setSuccess(null);
    setError(null);
  };

  const handleCloseAddCard = () => {
    setShowAddCard(false);
  };

  const handleSaveCard = () => {
    setShowAddCard(false);
    loadCards();
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      // Find the card to check if it's the primary/default card
      const card = cards.find(c => c.id === cardId);
      
      // Client-side validation: Prevent deleting primary card
      if (card?.is_default) {
        const style = addSweetAlertStyles();
        
        Swal.fire({
          icon: 'error',
          title: 'Cannot Delete Primary Card',
          text: "You can't delete default payment method. Please set another card as primary first.",
          timer: 3000,
          showConfirmButton: false,
          showCloseButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        
        removeSweetAlertStyles(style);
        return;
      }

      const style = addSweetAlertStyles();
      
      const result = await Swal.fire({
        imageUrl: '',
        imageWidth: 77,
        imageHeight: 77,
        title: 'Delete Payment Method',
        text: 'Are you sure you want to delete this payment method?',
        showCancelButton: false,
        showDenyButton: false,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary rounded-pill w-20'
        },
        showCloseButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      removeSweetAlertStyles(style);

      if (result.isConfirmed) {
        const isDefault = card?.is_default ? "1" : "0";
        
        await customerService.deleteCard(cardId, isDefault);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Card has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        loadCards();
      }
    } catch (error: unknown) {
      console.error('Error deleting card:', error);
      
      // Handle server-side validation response
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { success?: boolean; message?: string } } };
        if (axiosError.response?.data?.success === false && axiosError.response?.data?.message) {
          Swal.fire({
            title: 'Cannot Delete Card',
            text: axiosError.response.data.message,
            icon: 'warning'
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete card.',
            icon: 'error'
          });
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete card.',
          icon: 'error'
        });
      }
    }
  };

  const handleSetAsPrimary = async (cardId: string) => {
    try {
      await customerService.setPrimaryCard(cardId);
      
      Swal.fire({
        title: 'Success!',
        text: 'Card set as primary successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      loadCards();
    } catch (error) {
      console.error('Error setting primary card:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to set card as primary.',
        icon: 'error'
      });
    }
  };

  const handleCardSelect = async (cardId: string) => {
    setSelectedCard(selectedCard === cardId ? null : cardId);
    
    // Show the modal asking if user wants to set this card as primary
    try {
      const style = addSweetAlertStyles();
      
      const result = await Swal.fire({
        imageUrl: '',
        imageWidth: 77,
        imageHeight: 77,
        title: 'Default/Primary Card',
        text: 'Would you like to make this card your default payment method?',
        showCancelButton: false,
        showDenyButton: false,
        confirmButtonText: 'Yes, set as primary',
        customClass: {
          confirmButton: 'btn btn-primary rounded-pill w-20'
        },
        showCloseButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      removeSweetAlertStyles(style);

      if (result.isConfirmed) {
        await handleSetAsPrimary(cardId);
      }
    } catch (error) {
      console.error('Error showing modal:', error);
    }
  };

  return {
    // State
    cards,
    loading,
    error,
    success,
    selectedCard,
    showAddCard,
    
    // Actions
    loadCards,
    handleAddCard,
    handleCloseAddCard,
    handleSaveCard,
    handleDeleteCard,
    handleSetAsPrimary,
    handleCardSelect,
    setError,
    setSuccess,
  };
};
