import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const Wrapper = () => {
  return (
    <HelmetProvider>
      <Outlet />
      <Toaster />
    </HelmetProvider>
  );
};

export default Wrapper;
