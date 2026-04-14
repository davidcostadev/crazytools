import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

import { CommandPalette } from './components/CommandPalette';

const Wrapper = () => {
  return (
    <HelmetProvider>
      <Outlet />
      <CommandPalette />
      <Toaster />
    </HelmetProvider>
  );
};

export default Wrapper;
