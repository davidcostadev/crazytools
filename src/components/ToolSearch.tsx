import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Tool, tools } from '../tools';
import { ToolIcon } from './icons/ToolIcon';
import { categoryStyles } from '../categoryStyles';
import { searchTools } from '../utils/search';
import { pushRecent } from '../utils/recent';

const MAX_RESULTS = 8;

/**
 * Compact autocomplete search box. Used in the page header so every tool page
 * keeps a quick jump-to box. Up/Down to move, Enter to open, Esc to dismiss.
 */
export const ToolSearch = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [personal, setPersonal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setPersonal(window.localStorage.getItem('personal') === 'true');
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const source = personal ? tools : tools.filter((t) => !t.personal);
    return searchTools(source, query).slice(0, MAX_RESULTS);
  }, [query, personal]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  const select = (tool: Tool) => {
    pushRecent(tool.path);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    if (location.pathname !== tool.path) navigate(tool.path);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const tool = results[activeIndex];
      if (tool) {
        e.preventDefault();
        select(tool);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder="Search tools..."
        aria-label="Search tools"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="tool-search-listbox"
        className="w-full rounded-lg border border-black/10 bg-white pl-9 pr-3 py-2 text-sm outline-none transition-colors hover:border-black/20 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
      />
      {showDropdown && (
        <ul
          id="tool-search-listbox"
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-xl"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-sm text-black/40">No tools found</li>
          ) : (
            results.map((tool, i) => {
              const style = categoryStyles[tool.category];
              return (
                <li
                  key={tool.path}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(tool);
                  }}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 cursor-pointer text-sm',
                    i === activeIndex ? 'bg-black/[0.04]' : ''
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
                      style.chip
                    )}
                  >
                    <ToolIcon name={tool.icon} width={15} height={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-black/90 truncate">{tool.name}</span>
                    {tool.description && (
                      <span className="block text-xs text-black/45 truncate">
                        {tool.description}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-[11px] text-black/35">{tool.category}</span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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
