import React from 'react';
import clsx from 'clsx';

interface WizardStepProps {
  step: number;
  currentStep: number;
  title: string;
  children: React.ReactNode;
}

export function WizardStep({ step, currentStep, title, children }: WizardStepProps) {
  const isActive = step === currentStep;
  const isPast = step < currentStep;

  return (
    <div className={clsx(
      "transition-all duration-300",
      isActive ? "opacity-100" : "opacity-0 hidden"
    )}>
      <div className="flex items-center gap-4 mb-6">
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
          isPast ? "bg-orange-500 text-white" : "bg-white/10 text-white"
        )}>
          {step}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6">
        {children}
      </div>
    </div>
  );
}