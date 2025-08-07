import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LAST_VISITED_PAGE_KEY = 'lastVisitedPage';

export const useLastVisitedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't store the page if it's the root path
    if (location.pathname !== '/') {
      localStorage.setItem(LAST_VISITED_PAGE_KEY, location.pathname);
    }
  }, [location]);

  const redirectToLastVisitedPage = () => {
    const lastVisitedPage = localStorage.getItem(LAST_VISITED_PAGE_KEY);
    if (lastVisitedPage && location.pathname === '/') {
      navigate(lastVisitedPage);
    }
  };

  return { redirectToLastVisitedPage };
};
