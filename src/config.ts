// Network Configuration
export const NETWORK = {
  NODE_URL: 'https://testnet.vechain.org/',
  GENESIS: 'test' as const,
  EXPLORER_URL: 'https://explore-testnet.vechain.org',
} as const;

// Token Configuration
export const TOKEN = {
  B3TR_ICON_URL: 'https://vechain.github.io/token-registry/assets/3d55edb42b09a634f7f2f26756a02571de901a5b.png',
  CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000',
} as const;

// API Configuration
export const API = {
  SUBGRAPH_URL: 'https://graph.vet/subgraphs/name/vebetter/dao',
} as const;

// Transaction Configuration
export const TRANSACTION = {
  BATCH_SIZE: 50,
  MAX_RECEIPT_ATTEMPTS: 20,
  RECEIPT_POLL_INTERVAL: 3000, // 3 seconds
} as const;