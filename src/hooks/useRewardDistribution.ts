import { useState } from 'react';
import { useConnex } from '@vechain/dapp-kit-react';
import { CSVRow, TransactionProgress, Transaction, PendingTransaction } from '../types';
import { TRANSACTION, TOKEN } from '../config';

export function useRewardDistribution() {
  const { vendor, thor } = useConnex();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<TransactionProgress>({
    processedAddresses: 0,
    totalAddresses: 0,
    processedAmount: 0,
    totalAmount: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingTransaction, setPendingTransaction] = useState<PendingTransaction | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const waitForReceipt = async (txId: string): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkReceipt = async () => {
        try {
          const receipt = await thor.transaction(txId).getReceipt();
          if (receipt) {
            resolve(receipt);
          } else if (attempts < TRANSACTION.MAX_RECEIPT_ATTEMPTS) {
            attempts++;
            setTimeout(checkReceipt, TRANSACTION.RECEIPT_POLL_INTERVAL);
          } else {
            reject(new Error('Transaction receipt timeout'));
          }
        } catch (error) {
          reject(error);
        }
      };

      checkReceipt();
    });
  };

  const processBatch = async (
    csvData: CSVRow[],
    startIndex: number,
    selectedId: string,
    tokenSymbol: string = 'B3TR',
    isTokenTransfer: boolean = false
  ): Promise<boolean> => {
    // Use a larger batch size for token transfers
    const batchSize = isTokenTransfer ? TRANSACTION.TOKEN_BATCH_SIZE : TRANSACTION.BATCH_SIZE;
    const batch = csvData.slice(startIndex, startIndex + batchSize);
    const batchAmount = batch.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    setPendingTransaction({
      addresses: batch.length,
      amount: batchAmount,
      startIndex,
      status: 'processing'
    });

    try {
      let clauses;

      if (isTokenTransfer) {
        // Check if this is a VET transfer (native token)
        if (selectedId === "0x0000000000000000000000000000000000000000") {
          // Native VET transfer
          clauses = batch.map(row => ({
            to: row.address,
            value: (BigInt(Math.floor(parseFloat(row.amount) * 1e18))).toString(),
            data: '0x',
            comment: `${row.amount} VET to ${row.address}${row.reason ? ` (${row.reason})` : ''}`
          }));
        } else {
          // ERC20 token transfer
          clauses = batch.map(row => ({
            ...thor.account(selectedId).method({
              "inputs": [
                { "name": "recipient", "type": "address" },
                { "name": "amount", "type": "uint256" }
              ],
              "name": "transfer",
              "outputs": [
                { "name": "", "type": "bool" }
              ],
              "stateMutability": "nonpayable",
              "type": "function"
            })
              .asClause(
                row.address,
                (BigInt(Math.floor(parseFloat(row.amount) * 1e18))).toString()
              ),
            // Make reason optional for token transfers
            comment: `${row.amount} ${tokenSymbol} to ${row.address}${row.reason ? ` (${row.reason})` : ''}`
          }));
        }
      } else {
        // Original reward distribution
        clauses = batch.map(row => ({
          ...thor.account(TOKEN.CONTRACT_ADDRESS).method({
            "inputs": [
              { "name": "appId", "type": "bytes32" },
              { "name": "amount", "type": "uint256" },
              { "name": "receiver", "type": "address" },
              { "name": "reason", "type": "string" }
            ],
            "name": "distributeRewardDeprecated",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          })
            .asClause(
              selectedId,
              (BigInt(Math.floor(parseFloat(row.amount) * 1e18))).toString(),
              row.address,
              JSON.stringify({ version: 2, description: row.reason })
            ),
          comment: `${row.amount} ${tokenSymbol} for ${row.address} (${row.reason})`
        }));
      }

      const txResponse = await vendor
        .sign('tx', clauses)
        .comment(isTokenTransfer ? 'Transfer Tokens' : 'Distribute Rewards')
        .request();

      const receipt = await waitForReceipt(txResponse.txid);
      if (receipt.reverted) {
        throw new Error('Transaction reverted');
      }

      setTransactions(prev => [...prev, {
        id: txResponse.txid,
        amount: batchAmount,
        addresses: batch.length,
        rows: Array.from({ length: batch.length }, (_, k) => startIndex + k),
        status: 'success'
      }]);

      setProgress(prev => ({
        ...prev,
        processedAddresses: Math.min(startIndex + batchSize, csvData.length),
        processedAmount: batch.reduce((sum, row) => sum + parseFloat(row.amount), prev.processedAmount),
      }));

      setPendingTransaction(null);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setPendingTransaction(prev => prev ? { ...prev, error: errorMessage, status: 'error' } : null);
      return false;
    }
  };

  const processAllBatches = async (
    csvData: CSVRow[],
    selectedId: string,
    tokenSymbol: string = 'B3TR',
    startFromIndex = 0,
    isTokenTransfer = false
  ) => {
    setIsProcessing(true);
    setShowSuccess(false);

    // Set initial progress
    setProgress({
      processedAddresses: 0,
      totalAddresses: csvData.length,
      processedAmount: 0,
      totalAmount: csvData.reduce((sum, row) => sum + parseFloat(row.amount), 0)
    });

    try {
      let currentIndex = startFromIndex;
      const batchSize = isTokenTransfer ? TRANSACTION.TOKEN_BATCH_SIZE : TRANSACTION.BATCH_SIZE;
      
      while (currentIndex < csvData.length) {
        const success = await processBatch(
          csvData,
          currentIndex,
          selectedId,
          tokenSymbol,
          isTokenTransfer
        );
        
        if (!success) {
          break;
        }
        currentIndex += batchSize;
      }

      if (currentIndex >= csvData.length) {
        setShowSuccess(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    progress,
    transactions,
    pendingTransaction,
    showSuccess,
    processAllBatches,
    setProgress,
    setTransactions,
    setPendingTransaction,
    setShowSuccess
  };
}