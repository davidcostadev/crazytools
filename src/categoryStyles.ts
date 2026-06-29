import type { ToolCategory } from './tools';

// Full, static class strings so Tailwind can detect them at build time.
export type CategoryStyle = {
  chip: string; // resting icon chip (tinted bg + text)
  chipHover: string; // solid fill on card hover
  borderHover: string; // card border / focus accent
};

export const categoryStyles: Record<ToolCategory, CategoryStyle> = {
  Formatters: {
    chip: 'bg-blue-500/10 text-blue-600',
    chipHover: 'group-hover:bg-blue-500 group-hover:text-white',
    borderHover:
      'hover:border-blue-500/40 focus-visible:border-blue-500 focus-visible:ring-blue-500/30',
  },
  'Encode / Crypto': {
    chip: 'bg-violet-500/10 text-violet-600',
    chipHover: 'group-hover:bg-violet-500 group-hover:text-white',
    borderHover:
      'hover:border-violet-500/40 focus-visible:border-violet-500 focus-visible:ring-violet-500/30',
  },
  'Dev Tools': {
    chip: 'bg-emerald-500/10 text-emerald-600',
    chipHover: 'group-hover:bg-emerald-500 group-hover:text-white',
    borderHover:
      'hover:border-emerald-500/40 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30',
  },
  Generators: {
    chip: 'bg-amber-500/10 text-amber-600',
    chipHover: 'group-hover:bg-amber-500 group-hover:text-white',
    borderHover:
      'hover:border-amber-500/40 focus-visible:border-amber-500 focus-visible:ring-amber-500/30',
  },
  Personal: {
    chip: 'bg-rose-500/10 text-rose-600',
    chipHover: 'group-hover:bg-rose-500 group-hover:text-white',
    borderHover:
      'hover:border-rose-500/40 focus-visible:border-rose-500 focus-visible:ring-rose-500/30',
  },
};
