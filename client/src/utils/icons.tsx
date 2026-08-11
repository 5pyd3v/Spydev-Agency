import * as LucideIcons from 'lucide-react';
import { Sparkles, type LucideIcon } from 'lucide-react';

function kebabToPascal(input: string): string {
  return input
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Resolves a kebab-case icon name (e.g. "code-2") to its lucide-react component. */
export function getIcon(name: string | undefined): LucideIcon {
  if (!name) return Sparkles;
  const pascal = kebabToPascal(name);
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[pascal];
  return icon ?? Sparkles;
}
