import React from 'react';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import TransactionsList from './TransactionsList';
import TransactionPagination from './TransactionPagination';

interface TransactionHistoryContentProps {
  setActivePage: (page: string) => void;
}

const TransactionHistoryContent: React.FC<TransactionHistoryContentProps> = ({ setActivePage }) => {
  const {
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    loadTransactions,
    setError,
  } = useTransactionHistory();

  const handlePageChange = (page: number) => {
    loadTransactions(page);
  };

  const handleTransactionClick = (transactionId: number) => {
    // Redirect to existing RequestDetailsPage with transaction_history type
    const targetPage = `request_details_${transactionId}_transaction_history_1`;
    setActivePage(targetPage);
  };

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
            <h4 className="card-title mb-0">Transactions</h4>
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger alert-icon" role="alert">
              <i className="uil uil-exclamation-circle" />
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <TransactionsList
            transactions={transactions}
            loading={loading}
            onTransactionClick={handleTransactionClick}
          />

          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryContent;
