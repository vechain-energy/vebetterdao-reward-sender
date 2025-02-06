import React from 'react';
import { TransactionProgress } from '../types';
import clsx from 'clsx';

interface ProgressBarProps {
  progress: TransactionProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const percentage = (progress.processedAddresses / progress.totalAddresses) * 100;

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between text-sm font-medium">
        <span className="text-white/80">
          {progress.processedAddresses}/{progress.totalAddresses} addresses
        </span>
        <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent font-semibold">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="relative w-full bg-white/5 rounded-full h-6 p-1 overflow-hidden">
        {/* Progress bar */}
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-700",
            "bg-gradient-to-r from-orange-400 to-orange-500",
            "relative overflow-hidden"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
        
        {/* Glowing orb */}
        <div 
          className={clsx(
            "absolute top-1/2 -translate-y-1/2",
            "w-4 h-4 rounded-full",
            "bg-orange-400",
            "animate-progress-orb",
            "blur-[2px]",
            "shadow-lg shadow-orange-500/50"
          )}
          style={{
            left: `${Math.min(Math.max(percentage - 2, 0), 96)}%`,
            transition: 'left 0.7s ease-in-out'
          }}
        />
      </div>
      <div className="mt-3 text-sm text-white/60">
        Amount: {progress.processedAmount.toFixed(2)}/{progress.totalAmount.toFixed(2)} B3TR
      </div>
    </div>
  );
}