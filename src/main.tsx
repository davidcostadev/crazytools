import React from 'react';
import ReactDOM from 'react-dom/client';

import { Routes } from './Routes.tsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
