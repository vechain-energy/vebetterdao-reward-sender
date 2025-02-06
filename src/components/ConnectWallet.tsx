import React from 'react';
import { useWallet, useWalletModal } from '@vechain/dapp-kit-react';
import { Wallet } from 'lucide-react';
import clsx from 'clsx';

interface ConnectWalletProps {
  className?: string;
  variant?: 'default' | 'header';
}

export function ConnectWallet({ className, variant = 'default' }: ConnectWalletProps) {
  const { account, accountDomain } = useWallet();
  const modal = useWalletModal();

  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account && variant === 'header') {
    return null;
  }

  if (account && variant === 'header') {
    return (
      <button
        onClick={() => modal.open()}
        className={clsx(
          "px-4 py-2 rounded-lg",
          "bg-white/10 hover:bg-white/20",
          "text-white/80 hover:text-white",
          "flex items-center gap-2 text-sm",
          "transition-all duration-200",
          className
        )}
      >
        <Wallet className="w-4 h-4" />
        {accountDomain || shortenAddress(account)}
      </button>
    );
  }

  if (account) return null;

  return (
    <button
      onClick={() => modal.open()}
      className={clsx(
        "px-8 py-4 rounded-lg",
        "bg-orange-500 hover:bg-orange-600",
        "text-white font-semibold text-lg",
        "flex items-center gap-3",
        "transition-all duration-200",
        "shadow-lg hover:shadow-orange-500/25",
        "transform hover:-translate-y-0.5",
        className
      )}
    >
      <Wallet className="w-6 h-6" />
      Connect Wallet
    </button>
  );
}