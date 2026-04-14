import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { Tool, tools } from '../tools';
import { ToolIcon } from './icons/ToolIcon';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const RECENT_KEY = 'commandPalette.recent';
const RECENT_MAX = 8;

const readRecent = (): string[] => {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === 'string') : [];
  } catch {
    return [];
  }
};

const writeRecent = (paths: string[]) => {
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(paths));
};

const usePersonal = () => {
  const [personal, setPersonal] = useState(false);
  useEffect(() => {
    setPersonal(window.localStorage.getItem('personal') === 'true');
  }, []);
  return personal;
};

const score = (tool: Tool, q: string) => {
  if (!q) return 1;
  const haystack = [tool.name, tool.category, ...(tool.keywords ?? [])].join(' ').toLowerCase();
  const query = q.toLowerCase().trim();
  if (tool.name.toLowerCase().startsWith(query)) return 3;
  if (haystack.includes(query)) return 2;
  let i = 0;
  for (const ch of haystack) {
    if (ch === query[i]) i++;
    if (i === query.length) return 1;
  }
  return 0;
};

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const personal = usePersonal();

  const { results, recentCount } = useMemo(() => {
    const source = personal ? tools : tools.filter((t) => !t.personal);
    const byPath = new Map(source.map((t) => [t.path, t]));

    if (!query.trim()) {
      const recentTools = recent
        .map((path) => byPath.get(path))
        .filter((t): t is Tool => Boolean(t));
      const recentPaths = new Set(recentTools.map((t) => t.path));
      const rest = source.filter((t) => !recentPaths.has(t.path));
      return { results: [...recentTools, ...rest], recentCount: recentTools.length };
    }

    const ranked = source
      .map((tool) => ({ tool, s: score(tool, query) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ tool }) => tool);
    return { results: ranked, recentCount: 0 };
  }, [query, personal, recent]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setRecent(readRecent());
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const select = (tool: Tool) => {
    const next = [tool.path, ...recent.filter((p) => p !== tool.path)].slice(0, RECENT_MAX);
    writeRecent(next);
    setRecent(next);
    setOpen(false);
    if (location.pathname !== tool.path) navigate(tool.path);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const tool = results[activeIndex];
      if (tool) select(tool);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm pt-[15vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-black/10 px-4">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search tools…"
            className="flex-1 py-3 px-3 text-base outline-none bg-transparent"
          />
          <kbd className="text-[10px] text-black/40 border border-black/15 rounded px-1.5 py-0.5">
            esc
          </kbd>
        </div>
        {results.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-black/40">No tools found</div>
        ) : (
          <ul ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
            {results.map((tool, i) => (
              <Fragment key={tool.path}>
                {recentCount > 0 && i === 0 && <SectionLabel>Recent</SectionLabel>}
                {recentCount > 0 && i === recentCount && <SectionLabel>All tools</SectionLabel>}
                <li
                  data-idx={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => select(tool)}
                  className={clsx(
                    'flex items-center justify-between px-4 py-2 cursor-pointer text-sm gap-3',
                    i === activeIndex ? 'bg-blue-500 text-white' : 'text-black/80'
                  )}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <ToolIcon
                      name={tool.icon}
                      width={16}
                      height={16}
                      className={clsx(
                        'shrink-0',
                        i === activeIndex ? 'text-white/90' : 'text-black/50'
                      )}
                    />
                    <span className="font-medium truncate">{tool.name}</span>
                  </span>
                  <span
                    className={clsx(
                      'text-xs shrink-0',
                      i === activeIndex ? 'text-white/80' : 'text-black/40'
                    )}
                  >
                    {tool.category}
                  </span>
                </li>
              </Fragment>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 border-t border-black/10 px-4 py-2 text-[11px] text-black/40">
          <span>
            <kbd className="border border-black/15 rounded px-1">↑</kbd>
            <kbd className="border border-black/15 rounded px-1 ml-0.5">↓</kbd> navigate
          </span>
          <span>
            <kbd className="border border-black/15 rounded px-1">↵</kbd> open
          </span>
          <span className="ml-auto">
            <kbd className="border border-black/15 rounded px-1">
              {isMac ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="border border-black/15 rounded px-1 ml-0.5">K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <li className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-black/40 pointer-events-none">
    {children}
  </li>
);

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
    className="text-black/40"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
