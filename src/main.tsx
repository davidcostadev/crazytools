import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import ErrorPage from './pages/ErrorPage';
import { PrettierGraphqlPayload } from './pages/PrettierGraphqlPayload';
import { TextFormatters } from './pages/TextFormatters.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <PrettierGraphqlPayload />,
      },
      {
        path: '/text-formatters',
        element: <TextFormatters />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
