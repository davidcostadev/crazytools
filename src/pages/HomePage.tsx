import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import clsx from 'clsx';

import { Tool, ToolCategory, tools } from '../tools';
import { ToolIcon } from '../components/icons/ToolIcon';
import { categoryStyles } from '../categoryStyles';
import { pushRecent, readRecent } from '../utils/recent';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const matches = (tool: Tool, q: string) => {
  if (!q) return true;
  const haystack = [tool.name, tool.category, tool.description, ...(tool.keywords ?? [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q.toLowerCase().trim());
};

export const HomePage = () => {
  const [query, setQuery] = useState('');
  const [personal, setPersonal] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPersonal(window.localStorage.getItem('personal') === 'true');
    setRecent(readRecent());
  }, []);

  // Focus the search box with "/" like editors/search UIs.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA)$/.test(target.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const visible = useMemo(
    () => (personal ? tools : tools.filter((t) => !t.personal)).filter((t) => matches(t, query)),
    [personal, query]
  );

  const recentTools = useMemo(() => {
    if (query.trim()) return [];
    const byPath = new Map(visible.map((t) => [t.path, t]));
    return recent.map((p) => byPath.get(p)).filter((t): t is Tool => Boolean(t));
  }, [recent, visible, query]);

  const grouped = useMemo(() => {
    const byCategory = new Map<ToolCategory, Tool[]>();
    visible.forEach((tool) => {
      const list = byCategory.get(tool.category) ?? [];
      list.push(tool);
      byCategory.set(tool.category, list);
    });
    return Array.from(byCategory.entries());
  }, [visible]);

  const onCardClick = (tool: Tool) => () => pushRecent(tool.path);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-6xl mx-auto">
      <Helmet>
        <title>CrazyTools</title>
      </Helmet>

      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">CrazyTools</h1>
        <p className="mt-1 text-black/50 text-sm sm:text-base">
          A fast little toolbox for everyday dev tasks.
        </p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-black/40">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setQuery('');
            }}
            placeholder="Search tools..."
            aria-label="Search tools"
            className="w-full rounded-xl border border-black/10 bg-white pl-11 pr-16 py-3 text-base shadow-sm outline-none transition-colors hover:border-black/20 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-3 sm:flex">
            <kbd className="text-[11px] text-black/40 border border-black/15 rounded px-1.5 py-0.5">
              /
            </kbd>
          </span>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-20 text-center text-black/40">
          <p className="text-lg">No tools match "{query}"</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-3 text-sm text-blue-500 underline cursor-pointer hover:text-opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {recentTools.length > 0 && (
            <Section label="Recent">
              <ToolGrid tools={recentTools} onCardClick={onCardClick} />
            </Section>
          )}
          {grouped.map(([category, categoryTools]) => (
            <Section key={category} label={category}>
              <ToolGrid tools={categoryTools} onCardClick={onCardClick} />
            </Section>
          ))}
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-black/30">
        Press <kbd className="border border-black/15 rounded px-1">/</kbd> to search,{' '}
        <kbd className="border border-black/15 rounded px-1">{isMac ? '⌘' : 'Ctrl'}</kbd>
        <kbd className="border border-black/15 rounded px-1 ml-0.5">K</kbd> for the command palette.
      </footer>
    </div>
  );
};

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <section>
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-black/40">{label}</h2>
    {children}
  </section>
);

const ToolGrid = ({
  tools: list,
  onCardClick,
}: {
  tools: Tool[];
  onCardClick: (tool: Tool) => () => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
    {list.map((tool) => (
      <ToolCard key={tool.path} tool={tool} onClick={onCardClick(tool)} />
    ))}
  </div>
);

const ToolCard = ({ tool, onClick }: { tool: Tool; onClick: () => void }) => {
  const style = categoryStyles[tool.category];
  return (
    <Link
      to={tool.path}
      onClick={onClick}
      className={clsx(
        'group flex items-start gap-4 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm',
        'cursor-pointer transition-all',
        'hover:shadow-md hover:-translate-y-0.5',
        'active:translate-y-0 active:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2',
        style.borderHover
      )}
    >
      <span
        className={clsx(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors',
          style.chip,
          style.chipHover
        )}
      >
        <ToolIcon name={tool.icon} width={28} height={28} />
      </span>
      <span className="min-w-0 pt-0.5">
        <span className="block font-semibold text-sm text-black/90 truncate">{tool.name}</span>
        {tool.description && (
          <span className="block text-xs text-black/50 mt-0.5 line-clamp-2">
            {tool.description}
          </span>
        )}
      </span>
    </Link>
  );
};

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
