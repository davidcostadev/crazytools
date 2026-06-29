import { NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { ToolSearch } from '../components/ToolSearch';

export const DefaultLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to all tools"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-black/10 text-black/60 cursor-pointer transition-colors hover:border-black/20 hover:bg-black/[0.03] hover:text-black/80 active:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <ArrowLeftIcon />
          </button>
          <h1 className="text-xl sm:text-2xl font-normal text-black/50 truncate">
            <NavLink
              to="/"
              className="rounded hover:text-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            >
              Crazytools
            </NavLink>{' '}
            / <span className="font-bold text-black">{title}</span>
          </h1>
        </div>
        <ToolSearch className="w-full sm:w-72 sm:shrink-0" />
      </header>

      {children}
    </div>
  );
};

const ArrowLeftIcon = () => (
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
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);
