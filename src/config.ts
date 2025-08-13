// Network Configuration
export const NETWORK = {
  NODE_URL: 'https://mainnet.vechain.org/',
  GENESIS: 'main' as const,
  EXPLORER_URL: 'https://vechainstats.com',
} as const;

// Token Configuration
export const TOKEN = {
  B3TR_ADDRESS: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
  CONTRACT_ADDRESS: '0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631',
} as const;

// API Configuration
export const API = {
  SUBGRAPH_URL: 'https://graph.vet/subgraphs/name/vebetter/dao',
} as const;

// Transaction Configuration
export const TRANSACTION = {
  BATCH_SIZE: 50,
  TOKEN_BATCH_SIZE: 200, // Larger batch size for token transfers
  MAX_RECEIPT_ATTEMPTS: 20,
  RECEIPT_POLL_INTERVAL: 3000, // 3 seconds
} as const;