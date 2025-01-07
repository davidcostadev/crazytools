import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

const Wrapper = () => {
  return (
    <HelmetProvider>
      <Outlet />
      <Toaster />
    </HelmetProvider>
  );
};

export default Wrapper;
