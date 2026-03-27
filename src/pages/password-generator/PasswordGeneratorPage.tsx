import { useState } from 'react';
import toast from 'react-hot-toast';
import { DefaultLayout } from '../../layout/DefaultLayout';
import { BaselineContentCopy } from '../../components/icons/BaselineContentCopy';

const CHARS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(
  length: number,
  options: { lowercase: boolean; uppercase: boolean; numbers: boolean; symbols: boolean }
): string {
  let charset = '';
  if (options.lowercase) charset += CHARS.lowercase;
  if (options.uppercase) charset += CHARS.uppercase;
  if (options.numbers) charset += CHARS.numbers;
  if (options.symbols) charset += CHARS.symbols;
  if (!charset) return '';

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => charset[n % charset.length]).join('');
}

function getStrength(password: string): { label: string; color: string; width: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
  if (score <= 3) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
  if (score <= 4) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
}

export const PasswordGeneratorPage = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() =>
    generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true })
  );

  const handleGenerate = () => {
    setPassword(generatePassword(length, options));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    toast.success('Copied to clipboard');
  };

  const strength = password ? getStrength(password) : null;

  return (
    <DefaultLayout title="Password Generator">
      <div className="space-y-5">
        <div className="flex gap-4 items-center flex-wrap">
          <label className="text-sm flex items-center gap-2">
            Length:
            <input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-32"
            />
            <span className="font-mono text-sm w-6">{length}</span>
          </label>
        </div>
        <div className="flex gap-4 flex-wrap">
          {(Object.keys(options) as (keyof typeof options)[]).map((key) => (
            <label key={key} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Generate
        </button>
        {password && (
          <>
            <div className="flex items-center gap-2 bg-neutral-200 rounded px-4 py-3 font-mono text-sm">
              <span className="flex-1 break-all select-all">{password}</span>
              <button
                onClick={handleCopy}
                className="text-black hover:text-opacity-80 active:text-opacity-100 inline-flex gap-1 items-center shrink-0"
              >
                <BaselineContentCopy className="w-3 h-3" />
                <span className="text-xs">copy</span>
              </button>
            </div>
            {strength && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Strength</span>
                  <span>{strength.label}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded h-2">
                  <div className={`h-2 rounded ${strength.color} ${strength.width} transition-all`} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
};
