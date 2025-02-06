import React from 'react';
import { CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Transaction } from '../types';
import clsx from 'clsx';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.map(tx => (
        <div
          key={tx.id}
          className={clsx(
            "p-4 rounded-xl backdrop-blur-lg border",
            "transition-all duration-300",
            tx.status === 'success' 
              ? "bg-emerald-500/5 border-emerald-500/20" 
              : "bg-red-500/5 border-red-500/20"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-lg font-medium mb-1">
                {tx.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={tx.status === 'success' ? "text-emerald-400" : "text-red-400"}>
                  {tx.addresses} addresses • {tx.amount.toFixed(2)} B3TR
                </span>
              </p>
              <p className="text-white/60 text-sm">
                Transaction ID: {tx.id.slice(0, 8)}...{tx.id.slice(-6)}
              </p>
            </div>
            <a
              href={`https://explore-testnet.vechain.org/transactions/${tx.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-sm"
            >
              View
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}