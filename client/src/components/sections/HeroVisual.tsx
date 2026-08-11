import { motion } from 'framer-motion';
import { Bot, Cpu, Lock, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const CHIPS = [
  { label: 'AI Agents', icon: Bot, className: 'left-[6%] top-[14%]' },
  { label: 'Encrypted', icon: Lock, className: 'right-[4%] top-[8%]' },
  { label: 'Automation', icon: Cpu, className: 'left-[2%] bottom-[18%]' },
  { label: 'Engineered', icon: Sparkles, className: 'right-[8%] bottom-[10%]' },
];

export function HeroVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      <div
        className="absolute inset-0 rounded-[3rem] border border-border bg-surface/60"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--border) 60%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--border) 60%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[80px]"
        animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-8 flex items-center justify-center rounded-[2.5rem] border border-accent/20 bg-gradient-to-br from-surface to-background shadow-glow">
        <span className="font-display text-6xl font-bold text-gradient">SD</span>
      </div>

      {CHIPS.map((chip, i) => (
        <motion.div
          key={chip.label}
          className={`glass absolute flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-foreground shadow-soft ${chip.className}`}
          animate={reduced ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <chip.icon className="h-3.5 w-3.5 text-accent" />
          {chip.label}
        </motion.div>
      ))}
    </div>
  );
}
