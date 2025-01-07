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
      <nav className="flex mb-5">
        <MyNavLink to="/">Prettier Graphql Payload</MyNavLink>
        <MyNavLink to="/text-formatters">Text Formatters</MyNavLink>
        {personal && <MyNavLink to="/questions-formatter">Questions Formatter</MyNavLink>}
      </nav>
      {children}
    </div>
  );
};

const MyNavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "py-2 before:ml-4 before:mr-4 before:content-['/'] first-of-type:before:hidden before:text-black/50 text-sm",
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
