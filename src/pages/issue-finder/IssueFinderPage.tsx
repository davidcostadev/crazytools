import { useMemo, useState } from 'react';

import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

type SortOrder = 'asc' | 'desc';

const DEFAULT_PREFIX = 'EAT';
const DEFAULT_BASE_URL = 'https://linear.app/eats2seats-platform/issue/';

const extractIssues = (input: string, prefix: string): number[] => {
  if (!prefix) return [];
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(?<![A-Za-z])${escaped}-(\\d+)`, 'g');
  const found = new Set<number>();
  for (const match of input.matchAll(pattern)) {
    found.add(Number(match[1]));
  }
  return Array.from(found);
};

export const IssueFinderPage = () => {
  const [input, setInput] = useState('');
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const output = useMemo(() => {
    const numbers = extractIssues(input, prefix.trim());
    numbers.sort((a, b) => (sortOrder === 'asc' ? a - b : b - a));
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return numbers.map((n) => `${base}${prefix.trim()}-${n}`).join('\n');
  }, [input, prefix, baseUrl, sortOrder]);

  const count = output ? output.split('\n').length : 0;

  return (
    <DefaultLayout title="Issue Finder">
      <div className="space-y-5">
        <WordCounter
          value={input}
          onChange={(e) => setInput(e.target.value)}
          minHeight={280}
        />

        <div className="flex flex-wrap gap-3 items-end">
          <label className="flex flex-col text-xs text-black/60">
            <span className="mb-1">Prefix</span>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="border rounded px-2 py-1 font-mono text-sm w-28"
              placeholder="EAT"
            />
          </label>
          <label className="flex flex-col text-xs text-black/60 flex-grow min-w-[240px]">
            <span className="mb-1">Base URL</span>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="border rounded px-2 py-1 font-mono text-sm w-full"
              placeholder="https://linear.app/org/issue/"
            />
          </label>
          <label className="flex flex-col text-xs text-black/60">
            <span className="mb-1">Sort</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>

        <p className="text-xs text-black/50">
          Found {count} unique {count === 1 ? 'issue' : 'issues'}
        </p>

        <OutputPlan title="Issues" text={output} />
      </div>
    </DefaultLayout>
  );
};
