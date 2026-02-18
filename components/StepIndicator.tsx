import React from 'react';
import { AppStep } from '../types';
import { Bot, Copy, LayoutDashboard } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: AppStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 'prompt', label: '1. Generate Prompt', icon: Copy },
    { id: 'input', label: '2. Input Data', icon: Bot },
    { id: 'dashboard', label: '3. Analysis', icon: LayoutDashboard },
  ];

  return (
    <div className="flex justify-center mb-8 w-full">
      <div className="flex items-center space-x-2 md:space-x-4 bg-slate-800/80 backdrop-blur-md p-2 rounded-full border border-slate-700">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isDone = steps.findIndex(s => s.id === currentStep) > idx;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <div 
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                  ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 
                    isDone ? 'bg-slate-700 text-slate-300' : 'text-slate-500'}
                `}
              >
                <Icon size={16} />
                <span className="text-sm font-medium hidden md:inline">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-4 h-0.5 bg-slate-700 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};