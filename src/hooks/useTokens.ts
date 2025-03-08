import { useState, useEffect } from 'react';

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  desc: string;
  icon: string;
  totalSupply: string;
}

export function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('https://vechain.github.io/token-registry/main.json');
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        
        const data = await response.json();
        setTokens(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tokens'));
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return { tokens, loading, error };
} 