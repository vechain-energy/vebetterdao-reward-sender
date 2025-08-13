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

/**
 * Gets a specific token from the tokens list by contract address or symbol
 * @param identifier The contract address or symbol of the token to find
 * @returns The token or undefined if not found
 */
export function useToken(identifier: string) {
    const { tokens, loading, error } = useTokens();

    const token = tokens.find(token => 
        token.address.toLowerCase() === identifier.toLowerCase() ||
        token.symbol.toLowerCase() === identifier.toLowerCase()
    );

    return { token, loading, error };
} 