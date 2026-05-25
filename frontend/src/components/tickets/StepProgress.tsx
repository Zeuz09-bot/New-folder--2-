import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-dark-300 z-0" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gold transition-all duration-500 ease-in-out z-0"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Steps */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="relative z-10 flex flex-col items-center">
              <div 
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300',
                  isCompleted ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 
                  isCurrent ? 'bg-gold text-black border-4 border-dark-100 shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-110' : 
                  'bg-dark-300 text-zinc-500 border-2 border-dark-100'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : stepNumber}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between mt-3 px-1 sm:px-2">
        <span className={cn('text-[10px] sm:text-xs font-medium transition-colors', currentStep >= 1 ? 'text-gold' : 'text-zinc-500')}>Select Tier</span>
        <span className={cn('text-[10px] sm:text-xs font-medium transition-colors', currentStep >= 2 ? 'text-gold' : 'text-zinc-500')}>Details</span>
        <span className={cn('text-[10px] sm:text-xs font-medium transition-colors', currentStep >= 3 ? 'text-gold' : 'text-zinc-500')}>Review</span>
      </div>
    </div>
  );
}
