export interface PaymentMethodDetails {
  id: string;
  object: string;
  allow_redisplay: string;
  billing_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string | null;
    name: string | null;
    phone: string | null;
    tax_id: string | null;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string;
      cvc_check: string;
    };
    country: string;
    display_brand: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    generated_from: string | null;
    last4: string;
    networks: {
      available: string[];
      preferred: string | null;
    };
    regulated_status: string;
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: string | null;
  };
  created: number;
  customer: string;
  livemode: boolean;
  metadata: any[];
  type: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  request_id: number;
  type: string;
  refunded: boolean;
  refund_id: string | null;
  amount: number;
  credit_amount: number;
  canceled_at: string | null;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created_date: string;
  payment_method_details: string; // JSON string
  receipt_url: string | null;
  description: string;
  currency: string;
  transaction_id: string;
  payment_id: string;
  livemode: string;
  payment_method_types: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionHistoryResponse {
  success: boolean;
  data: {
    page: string;
    seo_title: string;
    menu: string;
    allTransactions: Transaction[];
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
  };
  getPage: any[];
  isAccepted: number;
  version: string;
}

export interface ParsedTransaction extends Transaction {
  parsedPaymentMethod?: PaymentMethodDetails;
}
