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

  const waitForReceipt = async (txId: string): Promise<any> => {
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
    selectedAppId: string
  ): Promise<boolean> => {
    const batch = csvData.slice(startIndex, startIndex + TRANSACTION.BATCH_SIZE);
    const batchAmount = batch.reduce((sum, row) => sum + parseFloat(row.amount), 0);
    
    setPendingTransaction({
      addresses: batch.length,
      amount: batchAmount,
      startIndex,
      status: 'processing'
    });

    try {
      const clauses = batch.map(row => ({
        ...thor.account(TOKEN.CONTRACT_ADDRESS).method({
          "inputs": [
            { "name": "appId", "type": "bytes32" },
            { "name": "amount", "type": "uint256" },
            { "name": "receiver", "type": "address" },
            { "name": "reason", "type": "string" }
          ],
          "name": "distributeReward",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        })
        .asClause(
          selectedAppId,
          (BigInt(Math.floor(parseFloat(row.amount) * 1e18))).toString(),
          row.address,
          row.reason
        ),
        comment: `${row.amount} B3TR for ${row.address} (${row.reason})`
      }));

      const txResponse = await vendor
        .sign('tx', clauses)
        .comment('Distribute Rewards')
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
        processedAddresses: Math.min(startIndex + TRANSACTION.BATCH_SIZE, csvData.length),
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

  const processAllBatches = async (csvData: CSVRow[], selectedAppId: string, startFromIndex = 0) => {
    setIsProcessing(true);
    setShowSuccess(false);
    
    try {
      let currentIndex = startFromIndex;
      while (currentIndex < csvData.length) {
        const success = await processBatch(csvData, currentIndex, selectedAppId);
        if (!success) {
          break;
        }
        currentIndex += TRANSACTION.BATCH_SIZE;
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