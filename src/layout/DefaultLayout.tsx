import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';

export const DefaultLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const personalUrl = new URLSearchParams(window.location.search).get('personal');
  const [personal, setPersonal] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (personalUrl) {
      window.localStorage.setItem('personal', personalUrl);
      setPersonal(personalUrl === 'true');
    } else {
      if (window.localStorage.getItem('personal')) {
        setPersonal(window.localStorage.getItem('personal') === 'true');
      }
    }
  }, [personalUrl]);

  return (
    <div className="p-5">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <h1 className="text-2xl  mb-5 font-normal text-black text-opacity-50">
        Crazytools / <span className="text-black text-opacity-100 font-bold">{title}</span>
      </h1>
      <nav className="flex mb-5 flex-wrap gap-y-1">
        <NavCategory label="Formatters">
          <MyNavLink to="/">GraphQL Payload</MyNavLink>
          <MyNavLink to="/text-formatters">Text Formatters</MyNavLink>
          <MyNavLink to="/json-formatter">JSON Formatter</MyNavLink>
          <MyNavLink to="/yaml-json">YAML ↔ JSON</MyNavLink>
          <MyNavLink to="/sql-formatter">SQL Formatter</MyNavLink>
          <MyNavLink to="/csv-json">CSV ↔ JSON</MyNavLink>
        </NavCategory>
        <NavCategory label="Encode / Crypto">
          <MyNavLink to="/jwt-decoder">JWT Decoder</MyNavLink>
          <MyNavLink to="/hash-generator">Hash Generator</MyNavLink>
          <MyNavLink to="/uuid-generator">UUID Generator</MyNavLink>
          <MyNavLink to="/html-entities">HTML Entities</MyNavLink>
        </NavCategory>
        <NavCategory label="Dev Tools">
          <MyNavLink to="/regex-tester">Regex Tester</MyNavLink>
          <MyNavLink to="/diff-viewer">Diff Viewer</MyNavLink>
          <MyNavLink to="/cron-parser">Cron Parser</MyNavLink>
          <MyNavLink to="/timestamp-converter">Timestamp</MyNavLink>
          <MyNavLink to="/color-converter">Color Converter</MyNavLink>
        </NavCategory>
        <NavCategory label="Generators">
          <MyNavLink to="/password-generator">Password</MyNavLink>
          <MyNavLink to="/lorem-ipsum">Lorem Ipsum</MyNavLink>
          <MyNavLink to="/countdown">Countdown</MyNavLink>
        </NavCategory>
        {personal && (
          <NavCategory label="Personal">
            <MyNavLink to="/questions-formatter">Questions Formatter</MyNavLink>
          </NavCategory>
        )}
      </nav>
      {children}
    </div>
  );
};

const NavCategory = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <div className="flex items-center mr-4 mb-1">
      <span className="text-xs text-black/40 font-medium uppercase mr-1">{label}:</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
};

const MyNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "py-1 before:ml-2 before:mr-2 before:content-['/'] first-of-type:before:hidden before:text-black/30 text-xs",
          {
            'text-black/50': isActive,
            'text-blue-500  hover:text-opacity-80 active:text-opacity-100 ': !isActive,
          }
        )
      }
    >
      {children}
    </NavLink>
  );
};
