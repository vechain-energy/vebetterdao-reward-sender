import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Download, FileDown, Users, Wallet, ArrowLeft, CircleDollarSign } from 'lucide-react';
import Papa from 'papaparse';
import { CSVTable } from './components/CSVTable';
import { ProgressBar } from './components/ProgressBar';
import { AppSelect } from './components/AppSelect';
import { Modal } from './components/Modal';
import { StatsCard } from './components/StatsCard';
import { WizardStep } from './components/WizardStep';
import { TransactionList } from './components/TransactionList';
import { PendingTransactionCard } from './components/PendingTransactionCard';
import { SuccessScreen } from './components/SuccessScreen';
import { ConnectWallet } from './components/ConnectWallet';
import { Background } from './components/Background';
import { useApps } from './hooks/useApps';
import { useRewardDistribution } from './hooks/useRewardDistribution';
import { CSVRow } from './types';
import { useWallet } from '@vechain/dapp-kit-react';
import { convertIpfsUrl } from './utils/ipfs';
import { TOKEN } from './config';
import clsx from 'clsx';
import Footer from './components/Footer';

function App() {
  const { account } = useWallet();
  const { apps } = useApps();
  const {
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
  } = useRewardDistribution();

  const [currentStep, setCurrentStep] = useState(1);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const selectedApp = apps.find(app => app.id === selectedAppId);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data
            .filter((row: any) => row.address && row.amount && row.reason)
            .map((row: any) => ({
              address: row.address,
              amount: row.amount,
              reason: row.reason,
            }));
          setCsvData(data);
        },
        header: true,
      });
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data
            .filter((row: any) => row.address && row.amount && row.reason)
            .map((row: any) => ({
              address: row.address,
              amount: row.amount,
              reason: row.reason,
            }));
          setCsvData(data);
        },
        header: true,
      });
    }
  };

  const handleDownloadExample = () => {
    const exampleData = [
      { address: '0x1234...', amount: '100', reason: 'Community contribution' },
      { address: '0x5678...', amount: '50', reason: 'Bug bounty' },
    ];
    const csv = Papa.unparse(exampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSendRewards = async () => {
    if (!account || !selectedAppId || csvData.length === 0) return;
    setCurrentStep(5);
    setProgress({
      processedAddresses: 0,
      totalAddresses: csvData.length,
      processedAmount: 0,
      totalAmount: csvData.reduce((sum, row) => sum + parseFloat(row.amount), 0),
    });
    setTransactions([]);
    setPendingTransaction(null);
    setShowSuccess(false);
    await processAllBatches(csvData, selectedAppId);
  };

  const handleRetryTransaction = async () => {
    if (!pendingTransaction) return;
    await processAllBatches(csvData, selectedAppId, pendingTransaction.startIndex);
  };

  const handleDownloadCSV = () => {
    const processedRows = transactions.flatMap(tx => 
      tx.rows.map(rowIndex => ({
        ...csvData[rowIndex],
        transaction: `https://vechainstats.com/transactions/${tx.id}`
      }))
    );
    
    const csv = Papa.unparse(processedRows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed_transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (account) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [account]);

  useEffect(() => {
    if (account && selectedAppId) {
      setCurrentStep(3);
    }
  }, [selectedAppId, account]);

  useEffect(() => {
    if (account && selectedAppId && csvData.length > 0) {
      setCurrentStep(4);
    }
  }, [csvData, account, selectedAppId]);

  useEffect(() => {
    if (showSuccess) {
      setCurrentStep(6);
    }
  }, [showSuccess]);

  const uniqueAddresses = new Set(csvData.map(row => row.address)).size;
  const totalAmount = csvData.reduce((sum, row) => sum + parseFloat(row.amount), 0);

  return (
    <div className="bg-gradient-dark">
      <Background />
      <div 
        className="min-h-screen p-8 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg border border-white/10 text-center">
              <Upload className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Drop your CSV file here</h3>
              <p className="text-white/60">Release to update the reward distribution list</p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            {selectedApp ? (
              <div className="flex items-center gap-3">
                {selectedApp?.metadata?.logoUrl ? (
                  <img
                    src={convertIpfsUrl(selectedApp.metadata.logoUrl)}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <CircleDollarSign className="w-6 h-6 text-orange-400" />
                  </div>
                )}
                <h1 className="text-3xl font-bold text-white">
                  {selectedApp.name}
                </h1>
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-white">VeBetterDAO Reward Distribution</h1>
            )}
            <ConnectWallet variant="header" />
          </div>

          <WizardStep step={1} currentStep={currentStep} title="Connect Wallet">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-6 text-center">
                <p className="text-white/80 text-lg">Connect your wallet to get started with reward distribution</p>
              </div>
              <ConnectWallet />
            </div>
          </WizardStep>

          <WizardStep step={2} currentStep={currentStep} title="Select Application">
            <AppSelect
              apps={apps}
              value={selectedAppId}
              onChange={setSelectedAppId}
            />
          </WizardStep>

          <WizardStep step={3} currentStep={currentStep} title="Upload CSV">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-orange-400 mx-auto mb-4 floating" />
              <p className="text-white/80 mb-2">
                Drag and drop your CSV file here
              </p>
              <p className="text-white/80 mb-4">
                or
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                Choose File
              </label>
              <p className="text-sm text-white/60 mt-4">
                File should contain columns: address, amount, reason
              </p>
              <button
                onClick={handleDownloadExample}
                className="text-orange-400 hover:text-orange-300 text-sm mt-4 flex items-center gap-1 mx-auto"
              >
                <Download className="w-4 h-4" />
                Download Example CSV
              </button>
            </div>
          </WizardStep>

          <WizardStep step={4} currentStep={currentStep} title="Review and Send">
            <>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <StatsCard
                  icon={
                    <div className="bg-orange-500/20 rounded-full p-2">
                      <Users className="w-12 h-12 text-orange-400" />
                    </div>
                  }
                  label="Unique Recipients"
                  value={uniqueAddresses}
                />
                <StatsCard
                  icon={
                    <div className="bg-orange-500/20 rounded-full p-0">
                      <img 
                        src={TOKEN.B3TR_ICON_URL} 
                        alt="B3TR"
                        className="w-14 h-14"
                      />
                    </div>
                  }
                  label="Total B3TR"
                  value={totalAmount.toFixed(2)}
                />
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Review Data</h2>
                    <p className="text-sm text-white/60 mt-1">
                      Drop a new CSV file anywhere to replace the current data
                    </p>
                  </div>
                  <button
                    onClick={handleSendRewards}
                    disabled={!account || !selectedAppId}
                    className={clsx(
                      "px-4 py-2 rounded-lg",
                      "flex items-center gap-2",
                      account && selectedAppId
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    )}
                  >
                    Send Rewards
                    {!account && <span className="text-sm">(Connect Wallet)</span>}
                    {!selectedAppId && <span className="text-sm">(Select App)</span>}
                  </button>
                </div>
                <CSVTable
                  data={csvData}
                  globalFilter={searchTerm}
                  setGlobalFilter={setSearchTerm}
                />
              </div>
            </>
          </WizardStep>

          <WizardStep step={5} currentStep={currentStep} title="Processing Rewards">
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Processing Rewards</h3>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Review
                  </button>
                </div>
                <ProgressBar progress={progress} />
              </div>

              {pendingTransaction && (
                <div className="mb-6">
                  <PendingTransactionCard
                    transaction={pendingTransaction}
                    onRetry={handleRetryTransaction}
                  />
                </div>
              )}

              {transactions.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">Processed Transactions</h4>
                    <button
                      onClick={handleDownloadCSV}
                      className="text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <FileDown className="w-4 h-4" />
                      Download CSV
                    </button>
                  </div>
                  <TransactionList transactions={transactions} />
                </div>
              )}
            </>
          </WizardStep>

          <WizardStep step={6} currentStep={currentStep} title="Distribution Complete">
            <SuccessScreen
              totalAmount={totalAmount}
              totalUsers={uniqueAddresses}
              onDownload={handleDownloadCSV}
            />
          </WizardStep>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;