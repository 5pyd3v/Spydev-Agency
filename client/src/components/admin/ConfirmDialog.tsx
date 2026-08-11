import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  isLoading,
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${danger ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'}`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h2>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                variant={danger ? 'primary' : 'primary'}
                size="sm"
                onClick={onConfirm}
                disabled={isLoading}
                className={danger ? 'bg-danger text-white hover:shadow-none' : ''}
              >
                {isLoading ? 'Please wait…' : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
