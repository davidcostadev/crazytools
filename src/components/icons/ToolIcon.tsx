import { SVGProps } from 'react';

export type IconName =
  | 'graphql'
  | 'text'
  | 'braces'
  | 'swap'
  | 'database'
  | 'table'
  | 'key'
  | 'hash'
  | 'fingerprint'
  | 'code'
  | 'regex'
  | 'diff'
  | 'clock'
  | 'timer'
  | 'palette'
  | 'lock'
  | 'file-text'
  | 'hourglass'
  | 'help';

const Base = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

const paths: Record<IconName, JSX.Element> = {
  graphql: (
    <>
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="12" cy="20" r="1.5" />
      <circle cx="5" cy="8" r="1.5" />
      <circle cx="19" cy="8" r="1.5" />
      <circle cx="5" cy="16" r="1.5" />
      <circle cx="19" cy="16" r="1.5" />
      <path d="M12 6v4M6.5 9l3.7 2M17.5 9l-3.7 2M6.5 15l3.7-2M17.5 15l-3.7-2M12 14v4" />
    </>
  ),
  text: (
    <>
      <path d="M4 6h16M4 12h10M4 18h16" />
    </>
  ),
  braces: (
    <>
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </>
  ),
  swap: (
    <>
      <path d="M17 3l4 4-4 4" />
      <path d="M21 7H9" />
      <path d="M7 21l-4-4 4-4" />
      <path d="M3 17h12" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
      <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),
  key: (
    <>
      <circle cx="7.5" cy="15.5" r="3.5" />
      <path d="m10 13 8-8M15 8l2 2M19 4l2 2" />
    </>
  ),
  hash: (
    <>
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M6 6a9 9 0 0 1 12 0" />
      <path d="M4 10a12 12 0 0 1 16 0" />
      <path d="M8 12a6 6 0 0 1 8 0v2a6 6 0 0 1-6 6" />
      <path d="M12 12v4a4 4 0 0 1-4 4" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </>
  ),
  regex: (
    <>
      <path d="M17 3v10M12.67 5.5l8.66 5M12.67 10.5l8.66-5" />
      <circle cx="6" cy="19" r="2" />
      <path d="M5 8h3M5 13h3" />
    </>
  ),
  diff: (
    <>
      <path d="M12 3v18" />
      <path d="M6 8h3M6 16h3M15 8h3M15 16h3" />
      <path d="M6 12h12" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  timer: (
    <>
      <path d="M10 2h4M12 14l3-3" />
      <circle cx="12" cy="14" r="8" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10z" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  'file-text': (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M8 13h8M8 17h6" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 3h12M6 21h12M18 3v3a6 6 0 0 1-12 0V3M18 21v-3a6 6 0 0 0-12 0v3" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 2-2.5 2-2.5 3.5" />
      <path d="M12 17h.01" />
    </>
  ),
};

export const ToolIcon = ({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) => (
  <Base {...props}>{paths[name]}</Base>
);
