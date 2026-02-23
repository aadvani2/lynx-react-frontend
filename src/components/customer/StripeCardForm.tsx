import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { customerService } from '../../services/customerServices/customerService';

interface StripeCardFormProps {
  onSave: () => void;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const StripeCardForm: React.FC<StripeCardFormProps> = ({ 
  onSave, 
  onClose, 
  onSuccess, 
  onError 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!stripe || !elements) {
      console.log('Stripe or elements not available, returning');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentError) {
        const msg = paymentError.message || 'Payment failed';
        setError(msg);
        onError(msg);
        setIsProcessing(false);
        return;
      }

      if (paymentMethod?.id) {
        try {
          const response = await customerService.saveCard(paymentMethod.id);
          console.log('Save card API response:', response);
          onSuccess();
          onSave();
        } catch (apiError) {
          console.error('Save card API error:', apiError);
          const msg = 'Failed to save card. Please try again.';
          setError(msg);
          onError(msg);
          setIsProcessing(false);
          return;
        }
      }
    } catch (err) {
      const msg = 'An unexpected error occurred';
      setError(msg);
      onError(msg);
      console.error('Payment error:', err);
    }

    setIsProcessing(false);
  };

  return (
    <div className="card-body border-bottom-custom" id="addNewCard">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="card-title mb-0">Add New Cards</h4>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        >
          <i className="uil uil-times fs-4"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="text-start position-relative" id="form-save-card">
        <div className="mb-3">
          <div
            id="card-element"
            className="border border-black border-opacity-10 px-3 py-3 rounded-3 shadow-sm"
            style={{ minHeight: '50px' }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-icon mb-3" role="alert">
            <i className="uil uil-exclamation-circle" />
            {error}
          </div>
        )}

        <div className="d-flex justify-content-end w-100">
          <button
            type="button"
            className="btn btn-sm btn-primary rounded-pill btn-login"
            id="save-card"
            disabled={!stripe || isProcessing}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e as React.FormEvent);
            }}
          >
            {isProcessing ? 'Processing...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripeCardForm;
