'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTimeRemaining } from '@/lib/utils';
import { EVENT } from '@/lib/constants';

export default function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getTimeRemaining> | null>(null);

  useEffect(() => {
    setTime(getTimeRemaining(EVENT.date));
    const interval = setInterval(() => {
      setTime(getTimeRemaining(EVENT.date));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show loading placeholder during SSR/hydration
  if (!time) {
    return (
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
          <div key={label} className="flex items-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center">
              <div className="glass-gold rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center glow-gold">
                <span className="text-2xl sm:text-3xl font-bold text-gold font-[family-name:var(--font-poppins)]">
                  --
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-zinc-500 mt-2 uppercase tracking-wider">
                {label}
              </span>
            </div>
            {i < 3 && (
              <span className="text-gold/40 text-xl sm:text-2xl font-light mt-[-1rem]">:</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (time.expired) {
    return (
      <div className="text-center">
        <p className="text-gold text-xl font-bold font-[family-name:var(--font-poppins)]">
          🎉 The Event Is Live!
        </p>
      </div>
    );
  }

  const blocks = [
    { value: time.days, label: 'Days' },
    { value: time.hours, label: 'Hours' },
    { value: time.minutes, label: 'Mins' },
    { value: time.seconds, label: 'Secs' },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="glass-gold rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center glow-gold">
              <span className="text-2xl sm:text-3xl font-bold text-gold font-[family-name:var(--font-poppins)]">
                {block.value.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-zinc-500 mt-2 uppercase tracking-wider">
              {block.label}
            </span>
          </motion.div>
          {i < blocks.length - 1 && (
            <span className="text-gold/40 text-xl sm:text-2xl font-light mt-[-1rem]">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
