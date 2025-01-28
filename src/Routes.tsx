import { RouterProvider, createHashRouter } from 'react-router-dom';

import Wrapper from './Wrapper';
import ErrorPage from './pages/ErrorPage';
import { PrettierGraphqlPayloadPage } from './pages/PrettierGraphqlPayloadPage';
import { TextFormattersPage } from './pages/TextFormattersPage';
import { QuestionsFormatterPage } from './pages/QuestionsFormatterPage';
import { CountdownPage } from './pages/CountdownPage';
import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <Wrapper />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <PrettierGraphqlPayloadPage />,
      },
      {
        path: '/text-formatters',
        element: <TextFormattersPage />,
      },
      {
        path: '/questions-formatter',
        element: <QuestionsFormatterPage />,
      },
      {
        path: '/countdown',
        element: <CountdownPage />,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
