import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { Tool, tools } from '../tools';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

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
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const personal = usePersonal();

  const results = useMemo(() => {
    const source = personal ? tools : tools.filter((t) => !t.personal);
    return source
      .map((tool) => ({ tool, s: score(tool, query) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ tool }) => tool);
  }, [query, personal]);

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
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const select = (tool: Tool) => {
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
              <li
                key={tool.path}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => select(tool)}
                className={clsx(
                  'flex items-center justify-between px-4 py-2 cursor-pointer text-sm',
                  i === activeIndex ? 'bg-blue-500 text-white' : 'text-black/80'
                )}
              >
                <span className="font-medium">{tool.name}</span>
                <span
                  className={clsx(
                    'text-xs',
                    i === activeIndex ? 'text-white/80' : 'text-black/40'
                  )}
                >
                  {tool.category}
                </span>
              </li>
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
