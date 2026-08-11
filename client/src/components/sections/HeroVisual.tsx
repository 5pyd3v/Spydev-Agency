import { motion } from 'framer-motion';
import { Bot, Cpu, Lock, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SpyDevMark } from '@/components/brand/SpyDevMark';

const CHIPS = [
  { label: 'AI Agents', icon: Bot, className: 'left-[2%] top-[10%]', tone: 'accent' as const },
  { label: 'Encrypted', icon: Lock, className: 'right-[0%] top-[6%]', tone: 'secondary' as const },
  { label: 'Automation', icon: Cpu, className: 'left-[-2%] bottom-[14%]', tone: 'secondary' as const },
  { label: 'Engineered', icon: Sparkles, className: 'right-[2%] bottom-[6%]', tone: 'accent' as const },
];

export function HeroVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      {/* Single soft glow, off-center — quiet enough to stay premium rather than busy. */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]"
        animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-6 rounded-[3rem] border border-border bg-surface/80" />

      <div className="absolute inset-6 flex items-center justify-center overflow-hidden rounded-[3rem] border border-border">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative flex h-32 w-32 items-center justify-center rounded-[2rem] bg-background shadow-glow sm:h-36 sm:w-36">
          <SpyDevMark size={72} />
        </div>
      </div>

      {CHIPS.map((chip, i) => (
        <motion.div
          key={chip.label}
          className={`glass absolute flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-foreground shadow-soft ${chip.className}`}
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        >
          <chip.icon className={`h-3.5 w-3.5 ${chip.tone === 'accent' ? 'text-accent' : 'text-secondary'}`} />
          {chip.label}
        </motion.div>
      ))}
    </div>
  );
}
