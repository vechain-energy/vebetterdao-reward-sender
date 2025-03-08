import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Token } from '../hooks/useTokens';
import clsx from 'clsx';

interface TokenSelectProps {
  tokens: Token[];
  value: string;
  onChange: (value: string) => void;
}

export function TokenSelect({ tokens, value, onChange }: TokenSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedToken = tokens.find(token => token.address === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full px-4 py-2 text-left border rounded-lg bg-white",
          "flex items-center justify-between",
          "focus:outline-none focus:ring-2 focus:ring-orange-500",
          isOpen ? "ring-2 ring-orange-500" : ""
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {selectedToken ? (
            <>
              {selectedToken.icon && (
                <img
                  src={`https://vechain.github.io/token-registry/assets/${selectedToken.icon}`}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <span>{selectedToken.name} ({selectedToken.symbol})</span>
            </>
          ) : (
            <span className="text-gray-500">Select a token...</span>
          )}
        </div>
        <ChevronDown className={clsx(
          "w-5 h-5 transition-transform",
          isOpen ? "transform rotate-180" : ""
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2 sticky top-0 bg-white border-b">
            <input
              type="text"
              placeholder="Search tokens..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <ul
            role="listbox"
            className="py-1"
          >
            {filteredTokens.map((token) => (
              <li
                key={token.address}
                role="option"
                aria-selected={token.address === value}
                onClick={() => {
                  onChange(token.address);
                  setIsOpen(false);
                }}
                className={clsx(
                  "px-4 py-2 flex items-center gap-2 cursor-pointer",
                  "hover:bg-orange-50",
                  token.address === value ? "bg-orange-50" : ""
                )}
              >
                {token.icon && (
                  <img
                    src={`https://vechain.github.io/token-registry/assets/${token.icon}`}
                    alt=""
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <div>{token.name}</div>
                  <div className="text-xs text-gray-500">{token.symbol}</div>
                </div>
              </li>
            ))}
            {filteredTokens.length === 0 && (
              <li className="px-4 py-2 text-gray-500">No tokens found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
} 