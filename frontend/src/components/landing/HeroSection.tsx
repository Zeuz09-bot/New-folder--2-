'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, Calendar, MapPin, Clock } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { EVENT } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with flyer overlay */}
      <div className="absolute inset-0">
        <Image
          src="/flyer.jpg"
          alt="ILEYA FEST with SAMAD"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark overlays for readability */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-radial" />
      </div>

      {/* Animated particles / dots pattern */}
      <div className="absolute inset-0 pattern-dots opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Presented by */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-zinc-400 uppercase tracking-[0.25em] mb-4"
        >
          GT Hotel and Event Center presents
        </motion.p>

        {/* Event Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-extrabold font-[family-name:var(--font-poppins)] mb-2 leading-none"
        >
          <span className="gold-text-shimmer">ILEYA</span>
          <br />
          <span className="text-white">FEST</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg sm:text-xl text-zinc-300 mb-2 font-[family-name:var(--font-poppins)]"
        >
          with{' '}
          <span className="text-gold font-bold text-2xl sm:text-3xl">SAMAD</span>
        </motion.p>

        {/* Event details pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10 mt-6"
        >
          <span className="glass-gold px-4 py-2 rounded-full flex items-center gap-2 text-sm text-zinc-300">
            <Calendar className="w-4 h-4 text-gold" />
            {EVENT.dateDisplay}
          </span>
          <span className="glass-gold px-4 py-2 rounded-full flex items-center gap-2 text-sm text-zinc-300">
            <Clock className="w-4 h-4 text-gold" />
            {EVENT.time} — {EVENT.timeEnd}
          </span>
          <span className="glass-gold px-4 py-2 rounded-full flex items-center gap-2 text-sm text-zinc-300">
            <MapPin className="w-4 h-4 text-gold" />
            {EVENT.venue}, Ikire
          </span>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="mb-10"
        >
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
            Event Starts In
          </p>
          <CountdownTimer />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/tickets"
            className="btn-gold px-8 py-4 rounded-full text-base font-bold animate-pulse-gold"
          >
            🎫 Get Your Tickets Now
          </Link>
          <a
            href="#tiers"
            className="btn-outline-gold px-8 py-4 rounded-full text-base font-semibold"
          >
            View Pricing
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
      >
        <a href="#about" className="text-gold/50 hover:text-gold transition-colors">
          <ArrowDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
}
