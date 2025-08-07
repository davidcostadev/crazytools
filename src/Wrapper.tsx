import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { useLastVisitedPage } from './hooks/useLastVisitedPage';

const Wrapper = () => {
  const { redirectToLastVisitedPage } = useLastVisitedPage();

  useEffect(() => {
    redirectToLastVisitedPage();
  }, [redirectToLastVisitedPage]);

  return (
    <HelmetProvider>
      <Outlet />
      <Toaster />
    </HelmetProvider>
  );
};

export default Wrapper;
