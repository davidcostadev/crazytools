import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';

import { Tool, ToolCategory, tools } from '../tools';

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

  const grouped = useMemo(() => {
    const source = personal ? tools : tools.filter((t) => !t.personal);
    const byCategory = new Map<ToolCategory, Tool[]>();
    source.forEach((tool) => {
      const list = byCategory.get(tool.category) ?? [];
      list.push(tool);
      byCategory.set(tool.category, list);
    });
    return Array.from(byCategory.entries());
  }, [personal]);

  return (
    <div className="p-5">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <h1 className="text-2xl  mb-5 font-normal text-black text-opacity-50">
        Crazytools / <span className="text-black text-opacity-100 font-bold">{title}</span>
      </h1>
      <nav className="flex mb-5 flex-wrap gap-y-1">
        {grouped.map(([category, categoryTools]) => (
          <NavCategory key={category} label={category}>
            {categoryTools.map((tool) => (
              <MyNavLink key={tool.path} to={tool.path}>
                {tool.name}
              </MyNavLink>
            ))}
          </NavCategory>
        ))}
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
