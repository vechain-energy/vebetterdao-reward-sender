import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  valueClassName?: string;
}

export function StatsCard({ icon, label, value, valueClassName }: StatsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/10">
      <div className="flex items-center gap-4">
        <div className="bg-orange-500/20 rounded-full overflow-hidden">
          {icon}
        </div>
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className={`text-3xl font-bold text-white ${valueClassName}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}