import React from 'react';
import type { ParsedTransaction } from '../../types/transaction';

interface TransactionItemProps {
  transaction: ParsedTransaction;
  onTransactionClick?: (transactionId: number) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onTransactionClick }) => {
  const formatAmount = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert cents to dollars
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'bg-aqua text-primary';
      case 'requires_capture':
        return 'bg-warning text-dark';
      case 'failed':
        return 'bg-danger text-white';
      case 'canceled':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark';
    }
  };

  const getCardDetails = () => {
    if (transaction.parsedPaymentMethod?.card) {
      const card = transaction.parsedPaymentMethod.card;
      return {
        last4: card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      };
    }
    return null;
  };

  const cardDetails = getCardDetails();

  const handleClick = () => {
    if (onTransactionClick) {
      onTransactionClick(transaction.request_id);
    }
  };

  return (
    <li className="d-flex">
      <a 
        href="javascript:void(0)" 
        className="card lift manage-employees requestItem transactions-card-details w-100"
        data-type="transaction_history" 
        data-id={transaction.id} 
        data-currentpage="1"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="card-body p-3">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-12 d-flex text-body">
              <div className="desc">
                <div>
                  <h6 className="pr-2 mb-0">Transaction ID:</h6>
                  <span>{transaction.transaction_id}</span>
                </div>
                {cardDetails && (
                  <div>
                    <h6 className="pr-2 mb-0">Card Details:</h6>
                    <span>**** {cardDetails.last4} ({cardDetails.brand})</span>
                    <span className="expires">
                      <span className="fw-medium">Expires on</span> {cardDetails.expMonth}/{cardDetails.expYear}
                    </span>
                  </div>
                )}
                <div>{transaction.description}</div>
                <div>
                  <small className="text-muted">{formatDate(transaction.created_at)}</small>
                </div>
              </div>

              <div className="trans-card">
                <h6 className="pr-2 mb-0 fs-22">
                  {formatAmount(transaction.amount, transaction.currency)}
                </h6>
                <div className="name fw-medium">
                  {transaction.payment_method_types === 'card' ? 'Card' : transaction.payment_method_types}
                </div>
                <div className="mb-2">
                  <h6 className="pr-2 mb-0">Request ID:</h6>
                  #{transaction.request_id}
                </div>
                <div className={`position-relative badge rounded-pill text-uppercase px-3 py-2 status ${getStatusBadgeClass(transaction.status)}`}>
                  {transaction.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};

export default TransactionItem;
