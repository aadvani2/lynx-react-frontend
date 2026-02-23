import { useEffect, useMemo, useState } from 'react';
import { customerService } from '../services/customerServices/customerService';
import type { TransactionHistoryResponse, ParsedTransaction } from '../types/transaction';

export interface UseTransactionHistoryReturn {
  // State
  transactions: ParsedTransaction[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  perPage: number;
  
  // Actions
  loadTransactions: (page?: number) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useTransactionHistory = (): UseTransactionHistoryReturn => {
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
  }, []);

  const parsePaymentMethodDetails = (paymentMethodString: string) => {
    try {
      return JSON.parse(paymentMethodString);
    } catch (error) {
      console.error('Error parsing payment method details:', error);
      return null;
    }
  };

  const loadTransactions = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await customerService.getTransactionHistory({ 
        user_timezone: timezoneHours,
        page: page
      });
      
      const response = res as TransactionHistoryResponse;
      
      if (response.success && response.data) {
        const parsedTransactions: ParsedTransaction[] = response.data.allTransactions.map(transaction => ({
          ...transaction,
          parsedPaymentMethod: parsePaymentMethodDetails(transaction.payment_method_details)
        }));
        
        setTransactions(parsedTransactions);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotal(response.data.total);
        setPerPage(response.data.per_page);
      } else {
        setError('Failed to load transaction history');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [timezoneHours]);

  return {
    // State
    transactions,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    perPage,
    
    // Actions
    loadTransactions,
    setError,
  };
};
