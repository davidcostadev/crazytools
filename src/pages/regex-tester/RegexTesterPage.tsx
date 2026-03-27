import { useState, useMemo } from 'react';
import { DefaultLayout } from '../../layout/DefaultLayout';
import DynamicTextarea from '../../components/ui/DynamicTextarea';

type Match = {
  fullMatch: string;
  index: number;
  groups: string[];
};

function getMatches(pattern: string, flags: string, text: string): Match[] {
  if (!pattern || !text) return [];
  const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
  const matches: Match[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      fullMatch: match[0],
      index: match.index,
      groups: match.slice(1),
    });
    if (!match[0]) regex.lastIndex++;
  }
  return matches;
}

function highlightText(text: string, matches: Match[]): React.ReactNode[] {
  if (matches.length === 0) return [text];

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, i) => {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <mark key={i} className="bg-yellow-300 rounded px-0.5">
        {match.fullMatch}
      </mark>
    );
    lastIndex = match.index + match.fullMatch.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export const RegexTesterPage = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    try {
      setError('');
      return getMatches(pattern, flags, text);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex');
      return [];
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => highlightText(text, matches), [text, matches]);

  return (
    <DefaultLayout title="Regex Tester">
      <div className="space-y-5">
        <div className="flex gap-2 items-center">
          <span className="text-neutral-400 text-lg">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="pattern"
            className="border rounded px-3 py-2 flex-1 font-mono text-sm"
          />
          <span className="text-neutral-400 text-lg">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags"
            className="border rounded px-3 py-2 w-20 font-mono text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        <DynamicTextarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded px-4 py-2 w-full font-mono text-sm"
          placeholder="Test string..."
        />
        {text && pattern && (
          <>
            <div className="bg-neutral-100 rounded p-4 font-mono text-sm whitespace-pre-wrap break-all">
              {highlighted}
            </div>
            <div className="text-sm text-neutral-600">
              {matches.length} match{matches.length !== 1 ? 'es' : ''} found
            </div>
            {matches.some((m) => m.groups.length > 0) && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Capture Groups</h3>
                {matches.map((match, i) => (
                  <div key={i} className="bg-neutral-100 rounded p-2 font-mono text-xs">
                    <span className="text-neutral-500">Match {i + 1}:</span> {match.fullMatch}
                    {match.groups.map((group, j) => (
                      <div key={j} className="ml-4">
                        <span className="text-blue-500">Group {j + 1}:</span> {group}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
};
