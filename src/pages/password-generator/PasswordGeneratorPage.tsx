import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { DefaultLayout } from '../../layout/DefaultLayout';
import { BaselineContentCopy } from '../../components/icons/BaselineContentCopy';
import { BaselineRefresh } from '../../components/icons/BaselineRefresh';
import {
  MemorableOptions,
  PinOptions,
  RANDOM_DIGIT,
  RANDOM_SYMBOL,
  RandomOptions,
  WordLang,
  crackTime,
  entropyForMemorable,
  entropyForPin,
  entropyForRandom,
  generateMemorable,
  generatePin,
  generateRandom,
  randomLength,
  strengthFromEntropy,
} from './passwordUtils';

type Mode = 'random' | 'memorable' | 'pin';

const MODES: { id: Mode; label: string }[] = [
  { id: 'random', label: 'Random' },
  { id: 'memorable', label: 'Memorable' },
  { id: 'pin', label: 'PIN' },
];

const SEPARATORS: { id: string; label: string }[] = [
  { id: '-', label: 'Hyphen -' },
  { id: '_', label: 'Underscore _' },
  { id: '.', label: 'Period .' },
  { id: ' ', label: 'Space' },
  { id: RANDOM_DIGIT, label: 'Random digit (0-9)' },
  { id: RANDOM_SYMBOL, label: 'Random symbol (!@#)' },
];

const LANGUAGES: { id: WordLang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Portugues' },
];

export const PasswordGeneratorPage = () => {
  const [mode, setMode] = useState<Mode>('random');

  const [random, setRandom] = useState<RandomOptions>({
    letters: 12,
    numbers: 3,
    symbols: 3,
    uppercase: true,
  });
  const [memorable, setMemorable] = useState<MemorableOptions>({
    words: 4,
    separator: RANDOM_SYMBOL,
    capitalize: true,
    includeNumber: true,
    leet: false,
    language: 'en',
  });
  const [pin, setPin] = useState<PinOptions>({ length: 6 });

  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    if (mode === 'random') return setPassword(generateRandom(random));
    if (mode === 'memorable') return setPassword(generateMemorable(memorable));
    return setPassword(generatePin(pin));
  }, [mode, random, memorable, pin]);

  // Regenerate whenever the mode or any option changes.
  useEffect(() => {
    generate();
  }, [generate]);

  const entropy = useMemo(() => {
    if (mode === 'random') return entropyForRandom(random);
    if (mode === 'memorable') return entropyForMemorable(memorable);
    return entropyForPin(pin);
  }, [mode, random, memorable, pin]);

  const strength = strengthFromEntropy(entropy);
  const noCharset = mode === 'random' && randomLength(random) === 0;

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast.success('Copied to clipboard');
  };

  return (
    <DefaultLayout title="Password Generator">
      <div className="max-w-2xl">
        <p className="text-sm text-black/50 mb-5">Generate strong, unique passwords.</p>

        {/* Password display */}
        <div
          className={clsx(
            'flex items-stretch gap-2 rounded-lg border bg-white overflow-hidden transition-colors',
            noCharset ? 'border-red-300' : 'border-neutral-300'
          )}
        >
          <span
            aria-hidden
            className={clsx('w-1 shrink-0 transition-colors', noCharset ? 'bg-red-400' : strength.color)}
          />
          <output
            aria-label="Generated password"
            className="flex-1 px-3 py-4 font-mono text-base sm:text-lg break-all select-all leading-relaxed min-w-0"
          >
            {noCharset ? (
              <span className="text-red-500 text-sm font-sans">
                Add at least one character below.
              </span>
            ) : (
              password
            )}
          </output>
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <ActionButton onClick={generate} variant="secondary">
            <BaselineRefresh className="w-4 h-4" />
            New password
          </ActionButton>
          <ActionButton onClick={handleCopy} disabled={noCharset} variant="primary">
            <BaselineContentCopy className="w-4 h-4" />
            Copy
          </ActionButton>
        </div>

        {/* Strength meter */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 flex-1 min-w-[8rem]" role="presentation">
            {[1, 2, 3, 4].map((seg) => (
              <span
                key={seg}
                className={clsx(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  !noCharset && strength.score >= seg ? strength.color : 'bg-neutral-200'
                )}
              />
            ))}
          </div>
          <span className={clsx('text-sm font-medium', noCharset ? 'text-red-500' : strength.textColor)}>
            {noCharset ? 'No password' : strength.label}
          </span>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs text-black/45">
          <span>{noCharset ? '0 bits of entropy' : `${Math.round(entropy)} bits of entropy`}</span>
          <span
            className="cursor-help decoration-dotted underline-offset-2 underline decoration-black/25"
            title="Estimated time for an offline attacker guessing 10 billion passwords per second (fast GPU on a poorly-hashed leak). On a well-protected service it would take far longer."
          >
            Time to crack:{' '}
            <span className="font-medium text-black/60">{noCharset ? 'instantly' : crackTime(entropy)}</span>
          </span>
        </div>

        {/* Mode tabs */}
        <div className="mt-6 inline-flex w-full sm:w-auto rounded-lg bg-neutral-100 p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={clsx(
                'flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm cursor-pointer transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                mode === m.id
                  ? 'bg-white text-black shadow-sm font-medium'
                  : 'text-black/55 hover:text-black/80'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="mt-4 rounded-lg border border-neutral-200 p-4 sm:p-5 space-y-5">
          {mode === 'random' && (
            <>
              <Slider
                label="Letters"
                hint="a-z"
                min={0}
                max={40}
                value={random.letters}
                onChange={(letters) => setRandom((r) => ({ ...r, letters }))}
              />
              <Slider
                label="Numbers"
                hint="0-9"
                min={0}
                max={40}
                value={random.numbers}
                onChange={(numbers) => setRandom((r) => ({ ...r, numbers }))}
              />
              <Slider
                label="Symbols"
                hint="!@#$"
                min={0}
                max={40}
                value={random.symbols}
                onChange={(symbols) => setRandom((r) => ({ ...r, symbols }))}
              />
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <Toggle
                  label="Include uppercase"
                  hint="A-Z"
                  checked={random.uppercase}
                  onChange={(uppercase) => setRandom((r) => ({ ...r, uppercase }))}
                />
                <span className="text-xs text-black/45">
                  Total length:{' '}
                  <span className="font-mono font-medium text-black/70">{randomLength(random)}</span>
                </span>
              </div>
            </>
          )}

          {mode === 'memorable' && (
            <>
              <Slider
                label="Words"
                min={1}
                max={10}
                value={memorable.words}
                onChange={(words) => setMemorable((m) => ({ ...m, words }))}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  id="language"
                  label="Language"
                  value={memorable.language}
                  onChange={(language) =>
                    setMemorable((m) => ({ ...m, language: language as WordLang }))
                  }
                  options={LANGUAGES}
                />
                <Select
                  id="separator"
                  label="Separator"
                  value={memorable.separator}
                  onChange={(separator) => setMemorable((m) => ({ ...m, separator }))}
                  options={SEPARATORS}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Toggle
                  label="Capitalize"
                  hint="Title-case words"
                  checked={memorable.capitalize}
                  onChange={(capitalize) => setMemorable((m) => ({ ...m, capitalize }))}
                />
                <Toggle
                  label="Add number"
                  hint="Append digits"
                  checked={memorable.includeNumber}
                  onChange={(includeNumber) => setMemorable((m) => ({ ...m, includeNumber }))}
                />
                <Toggle
                  label="Leet letters"
                  hint="a@ e3 o0 s$"
                  checked={memorable.leet}
                  onChange={(leet) => setMemorable((m) => ({ ...m, leet }))}
                />
              </div>
            </>
          )}

          {mode === 'pin' && (
            <Slider
              label="Digits"
              min={3}
              max={12}
              value={pin.length}
              onChange={(length) => setPin({ length })}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

const ActionButton = ({
  onClick,
  disabled,
  variant,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      'flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
      disabled && 'opacity-40 cursor-not-allowed',
      !disabled && 'cursor-pointer',
      variant === 'primary'
        ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        : 'border border-neutral-300 text-black/70 hover:bg-neutral-100 hover:text-black active:bg-neutral-200'
    )}
  >
    {children}
  </button>
);

const Slider = ({
  label,
  hint,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label htmlFor={`slider-${label}`} className="text-sm font-medium flex items-baseline gap-1.5">
        {label}
        {hint && <span className="text-xs text-black/40 font-mono">{hint}</span>}
      </label>
      <span className="font-mono text-sm tabular-nums px-2 py-0.5 rounded bg-neutral-100 min-w-[2.5rem] text-center">
        {value}
      </span>
    </div>
    <input
      id={`slider-${label}`}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full cursor-pointer accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded"
    />
  </div>
);

const Select = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
}) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm cursor-pointer hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex items-center gap-2.5 cursor-pointer group select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-neutral-300 text-blue-500 cursor-pointer accent-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    />
    <span className="flex items-baseline gap-1.5 min-w-0">
      <span className="text-sm group-hover:text-black/80">{label}</span>
      {hint && <span className="text-xs text-black/40 font-mono truncate">{hint}</span>}
    </span>
  </label>
);
