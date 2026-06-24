import { WORDLISTS, WordLang } from './wordlists';

export type { WordLang } from './wordlists';
export { WORDLISTS } from './wordlists';

const CHARS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// Unbiased random integer in [0, max) using rejection sampling on crypto values.
function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const limit = Math.floor(0xffffffff / max) * max;
  const buf = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % max;
}

function pick<T>(arr: T[] | string): T | string {
  return arr[secureRandomInt(arr.length)];
}

// Leet substitutions: each mapped letter can be swapped for a lookalike symbol or
// digit. Substitution is decided independently per letter so it adds real entropy
// (a fixed a->@ everywhere would add none, since an attacker just applies it too).
const LEET_MAP: Record<string, string> = {
  a: '@', b: '8', e: '3', g: '9', i: '!', o: '0', s: '$', t: '7', z: '2',
};

function applyLeet(word: string): string {
  return Array.from(word, (ch) => {
    const lower = ch.toLowerCase();
    const swap = LEET_MAP[lower];
    // 50/50 per eligible letter: keep it readable while still adding entropy.
    return swap && secureRandomInt(2) === 0 ? swap : ch;
  }).join('');
}

// Average eligible letters per word in the bundled lists (~3.5), used to estimate
// the entropy that random leet substitution contributes (1 bit per eligible
// letter, since each is independently substituted or not).
const AVG_LEET_BITS_PER_WORD = 3.5;

export type RandomOptions = {
  letters: number;
  numbers: number;
  symbols: number;
  uppercase: boolean;
};

export function randomLength(opts: RandomOptions): number {
  return opts.letters + opts.numbers + opts.symbols;
}

// In-place Fisher-Yates shuffle using unbiased secure randomness.
function secureShuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// A separator is either a literal character or one of these tokens, which mean
// "use a freshly random character for each gap" — producing passwords like
// Velvet@Bola#Pixel7 that stay readable but add real entropy.
export const RANDOM_DIGIT = '\x00random-digit';
export const RANDOM_SYMBOL = '\x00random-symbol';
const SEPARATOR_SYMBOLS = '!@#$%^&*-_=+';

export type MemorableOptions = {
  words: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
  leet: boolean;
  language: WordLang;
};

function isRandomSeparator(sep: string): boolean {
  return sep === RANDOM_DIGIT || sep === RANDOM_SYMBOL;
}

function separatorChar(sep: string): string {
  if (sep === RANDOM_DIGIT) return secureRandomInt(10).toString();
  if (sep === RANDOM_SYMBOL) return pick(SEPARATOR_SYMBOLS) as string;
  return sep;
}

export type PinOptions = {
  length: number;
};

export function generateRandom(opts: RandomOptions): string {
  const letterSet = opts.uppercase ? CHARS.lowercase + CHARS.uppercase : CHARS.lowercase;
  const chars: string[] = [];
  for (let i = 0; i < opts.letters; i++) chars.push(pick(letterSet) as string);
  for (let i = 0; i < opts.numbers; i++) chars.push(pick(CHARS.numbers) as string);
  for (let i = 0; i < opts.symbols; i++) chars.push(pick(CHARS.symbols) as string);
  if (chars.length === 0) return '';
  return secureShuffle(chars).join('');
}

export function generateMemorable(opts: MemorableOptions): string {
  const list = WORDLISTS[opts.language] ?? WORDLISTS.en;
  const words = Array.from({ length: opts.words }, () => {
    let word = pick(list) as string;
    if (opts.capitalize) word = word.charAt(0).toUpperCase() + word.slice(1);
    if (opts.leet) word = applyLeet(word);
    return word;
  });
  let result = words.reduce((acc, word, i) =>
    i === 0 ? word : acc + separatorChar(opts.separator) + word
  );
  if (opts.includeNumber) {
    result += separatorChar(opts.separator) + secureRandomInt(100).toString().padStart(2, '0');
  }
  return result;
}

export function generatePin(opts: PinOptions): string {
  return Array.from({ length: opts.length }, () => secureRandomInt(10).toString()).join('');
}

// --- Strength estimation -------------------------------------------------

export type Strength = {
  bits: number;
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string; // tailwind bg- class for the meter
  textColor: string; // tailwind text- class for the label
};

export function entropyForRandom(opts: RandomOptions): number {
  let size = 0;
  if (opts.letters > 0) size += opts.uppercase ? 52 : 26;
  if (opts.numbers > 0) size += 10;
  if (opts.symbols > 0) size += CHARS.symbols.length;
  const length = randomLength(opts);
  return size > 0 ? length * Math.log2(size) : 0;
}

export function entropyForMemorable(opts: MemorableOptions): number {
  const list = WORDLISTS[opts.language] ?? WORDLISTS.en;
  const wordBits = opts.words * Math.log2(list.length);
  const numberBits = opts.includeNumber ? Math.log2(100) : 0;

  // Random separators contribute entropy: one per gap between words, plus one
  // before a trailing number.
  let separatorBits = 0;
  if (isRandomSeparator(opts.separator)) {
    const gaps = opts.words - 1 + (opts.includeNumber ? 1 : 0);
    const perGap = opts.separator === RANDOM_DIGIT ? Math.log2(10) : Math.log2(SEPARATOR_SYMBOLS.length);
    separatorBits = gaps * perGap;
  }

  // Each randomly-substituted letter adds ~1 bit; estimated from the average
  // number of eligible letters per word.
  const leetBits = opts.leet ? opts.words * AVG_LEET_BITS_PER_WORD : 0;

  return wordBits + numberBits + separatorBits + leetBits;
}

export function entropyForPin(opts: PinOptions): number {
  return opts.length * Math.log2(10);
}

export function strengthFromEntropy(bits: number): Strength {
  if (bits < 36) {
    return { bits, score: 1, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
  }
  if (bits < 60) {
    return { bits, score: 2, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500' };
  }
  if (bits < 90) {
    return { bits, score: 3, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' };
  }
  return {
    bits,
    score: 4,
    label: 'Very strong',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-600',
  };
}

// --- Crack time estimation ----------------------------------------------

// Offline attack on a fast-hashed password: ~10 billion guesses/second is a
// reasonable mid-range estimate for a determined attacker with GPUs.
const GUESSES_PER_SECOND = 1e10;

const TIME_UNITS: { label: string; seconds: number }[] = [
  { label: 'century', seconds: 60 * 60 * 24 * 365 * 100 },
  { label: 'year', seconds: 60 * 60 * 24 * 365 },
  { label: 'month', seconds: 60 * 60 * 24 * 30 },
  { label: 'day', seconds: 60 * 60 * 24 },
  { label: 'hour', seconds: 60 * 60 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
];

export function crackTime(bits: number): string {
  if (bits <= 0) return 'instantly';
  // Average number of guesses is half the keyspace.
  const seconds = Math.pow(2, bits - 1) / GUESSES_PER_SECOND;

  if (seconds < 1) return 'instantly';
  if (seconds < 60) return 'a few seconds';

  // Very large numbers: report in centuries with a readable magnitude.
  const centuries = seconds / TIME_UNITS[0].seconds;
  if (centuries >= 1e6) return 'effectively forever';
  if (centuries >= 1000) {
    return `${Math.round(centuries).toLocaleString('en-US')} centuries`;
  }

  for (const unit of TIME_UNITS) {
    const value = seconds / unit.seconds;
    if (value >= 1) {
      const rounded = Math.round(value);
      if (rounded === 1) return `1 ${unit.label}`;
      const plural = unit.label === 'century' ? 'centuries' : `${unit.label}s`;
      return `${rounded.toLocaleString('en-US')} ${plural}`;
    }
  }
  return 'instantly';
}
