import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { PendingTransaction } from '../types';
import clsx from 'clsx';

interface PendingTransactionCardProps {
  transaction: PendingTransaction;
  onRetry: () => void;
}

export function PendingTransactionCard({ transaction, onRetry }: PendingTransactionCardProps) {
  return (
    <div className={clsx(
      "p-6 rounded-xl",
      "backdrop-blur-lg border",
      "transition-all duration-300",
      transaction.status === 'processing' 
        ? "bg-blue-500/5 border-blue-500/20" 
        : "bg-red-500/5 border-red-500/20"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className={clsx(
            "text-lg font-semibold mb-1",
            transaction.status === 'processing' ? "text-blue-400" : "text-red-400"
          )}>
            {transaction.status === 'processing' ? 'Processing Batch' : 'Transaction Failed'}
          </h4>
          <p className="text-white/80">
            {transaction.addresses} addresses • {transaction.amount.toFixed(2)} B3TR
          </p>
          {transaction.error && (
            <p className="text-red-400/80 text-sm mt-2 font-medium">
              Error: {transaction.error}
            </p>
          )}
        </div>
        {transaction.status === 'processing' ? (
          <div className="relative">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <div className="absolute inset-0 animate-pulse bg-blue-400/20 rounded-full blur-xl" />
          </div>
        ) : (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Batch
          </button>
        )}
      </div>
    </div>
  );
}