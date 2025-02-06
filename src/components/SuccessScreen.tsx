import React from 'react';
import { CheckCircle2, Download, Users } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { TOKEN } from '../config';

interface SuccessScreenProps {
  totalAmount: number;
  totalUsers: number;
  onDownload: () => void;
}

export function SuccessScreen({ totalAmount, totalUsers, onDownload }: SuccessScreenProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-lg p-8">
      <div className="absolute inset-0 bg-success-pattern opacity-5" />
      
      <div className="relative">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="absolute inset-0 animate-pulse bg-emerald-400/20 rounded-full blur-2xl" />
          </div>
        </div>

        <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-3">
          Distribution Complete!
        </h3>
        
        <p className="text-white/80 text-center mb-8 text-lg">
          All rewards have been successfully distributed to your community
        </p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <StatsCard
            icon={
              <div className="bg-emerald-500/20 rounded-full p-2">
                <Users className="w-12 h-12 text-emerald-400" />
              </div>
            }
            label="Recipients"
            value={totalUsers}
          />
          <StatsCard
            icon={
              <div className="bg-emerald-500/20 rounded-full p-0">
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

        <button
          onClick={onDownload}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Transaction Report
        </button>
      </div>
    </div>
  );
}