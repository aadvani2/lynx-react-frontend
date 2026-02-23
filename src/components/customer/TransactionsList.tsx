import React from 'react';
import type { ParsedTransaction } from '../../types/transaction';
import TransactionItem from './TransactionItem';

interface TransactionsListProps {
  transactions: ParsedTransaction[];
  loading: boolean;
  onTransactionClick?: (transactionId: number) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, loading, onTransactionClick }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading transactions...</p>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="alert alert-info text-center" role="alert">
        <i className="uil uil-info-circle fs-4"></i>
        <p className="mt-2 mb-0">No transactions found.</p>
      </div>
    );
  }

  return (
    <ul className="transactions-card-list">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onTransactionClick={onTransactionClick}
        />
      ))}
    </ul>
  );
};

export default TransactionsList;
