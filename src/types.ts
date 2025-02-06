export interface CSVRow {
  address: string;
  amount: string;
  reason: string;
  transaction?: string;
}

export interface AppData {
  id: string;
  name: string;
  metadata: {
    logoUrl: string;
  };
}

export interface TransactionProgress {
  processedAddresses: number;
  totalAddresses: number;
  processedAmount: number;
  totalAmount: number;
}

export interface Transaction {
  id: string;
  amount: number;
  addresses: number;
  rows: number[];
  status?: 'success' | 'error';
  error?: string;
}

export interface PendingTransaction {
  addresses: number;
  amount: number;
  startIndex: number;
  status: 'processing' | 'error';
  error?: string;
}