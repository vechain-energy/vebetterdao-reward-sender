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

// Hard-coded VET token
const VET_TOKEN: Token = {
    name: "VeChain",
    symbol: "VET",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000", // Address(0) for native VET
    desc: "Native token of the VeChain blockchain",
    icon: `${window.location.href}/assets/vet-logo.png`,
    totalSupply: "86712634466"
};

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
                // Add VET as the first token in the list
                setTokens([VET_TOKEN, ...data]);
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