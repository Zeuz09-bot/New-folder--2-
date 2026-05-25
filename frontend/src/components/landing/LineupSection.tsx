'use client';

import { motion } from 'framer-motion';
import { PERFORMERS } from '@/lib/constants';
import { Music, Mic2, Drum } from 'lucide-react';

export default function LineupSection() {
  const allPerformers = [
    {
      category: 'Headliner',
      icon: <Music className="w-5 h-5" />,
      names: [PERFORMERS.headliner],
      highlight: true,
    },
    {
      category: 'Guest Artists',
      icon: <Mic2 className="w-5 h-5" />,
      names: PERFORMERS.guestArtists,
      highlight: false,
    },
    {
      category: 'Official DJs',
      icon: <Music className="w-5 h-5" />,
      names: PERFORMERS.djs,
      highlight: false,
    },
    {
      category: 'Hype Policy',
      icon: <Mic2 className="w-5 h-5" />,
      names: PERFORMERS.hypemen,
      highlight: false,
    },
    {
      category: 'Drummer',
      icon: <Drum className="w-5 h-5" />,
      names: [PERFORMERS.drummer],
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allPerformers.map((group, groupIndex) => (
        <motion.div
          key={group.category}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: groupIndex * 0.1 }}
          className={`glass rounded-xl p-6 ${
            group.highlight
              ? 'md:col-span-2 lg:col-span-3 glass-gold glow-gold'
              : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gold">{group.icon}</span>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">
              {group.category}
            </h4>
          </div>

          <div className={`flex flex-wrap gap-2 ${group.highlight ? 'justify-center' : ''}`}>
            {group.names.map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: groupIndex * 0.1 + i * 0.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  group.highlight
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-black text-2xl sm:text-3xl font-bold font-[family-name:var(--font-poppins)] px-8 py-3'
                    : 'bg-white/5 text-zinc-300 border border-white/5 hover:border-gold/30 hover:text-gold'
                }`}
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
