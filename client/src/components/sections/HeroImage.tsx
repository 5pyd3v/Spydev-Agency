import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function HeroImage({ src }: { src: string }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-lg sm:aspect-square">
      <motion.div
        className="absolute -right-6 -top-6 h-56 w-56 rounded-full bg-accent/25 blur-[90px]"
        animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-border shadow-glow">
        <img src={src} alt="" className="h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <div className="glass absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground">Security-first engineering</p>
            <p className="text-[11px] text-muted-foreground">Every build reviewed before it ships</p>
          </div>
        </div>
      </div>
    </div>
  );
}
