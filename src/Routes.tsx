import { RouterProvider, createHashRouter } from 'react-router-dom';

import Wrapper from './Wrapper';
import ErrorPage from './pages/ErrorPage';
import { PrettierGraphqlPayloadPage } from './pages/PrettierGraphqlPayloadPage';
import { TextFormattersPage } from './pages/text-formatters/TextFormattersPage';
import { QuestionsFormatterPage } from './pages/QuestionsFormatterPage';
import { CountdownPage } from './pages/CountdownPage';
import { JsonFormatterPage } from './pages/json-formatter/JsonFormatterPage';
import { YamlJsonPage } from './pages/yaml-json/YamlJsonPage';
import { SqlFormatterPage } from './pages/sql-formatter/SqlFormatterPage';
import { CsvJsonPage } from './pages/csv-json/CsvJsonPage';
import { JwtDecoderPage } from './pages/jwt-decoder/JwtDecoderPage';
import { HashGeneratorPage } from './pages/hash-generator/HashGeneratorPage';
import { UuidGeneratorPage } from './pages/uuid-generator/UuidGeneratorPage';
import { HtmlEntitiesPage } from './pages/html-entities/HtmlEntitiesPage';
import { IssueFinderPage } from './pages/issue-finder/IssueFinderPage';
import { RegexTesterPage } from './pages/regex-tester/RegexTesterPage';
import { DiffViewerPage } from './pages/diff-viewer/DiffViewerPage';
import { CronParserPage } from './pages/cron-parser/CronParserPage';
import { TimestampConverterPage } from './pages/timestamp-converter/TimestampConverterPage';
import { ColorConverterPage } from './pages/color-converter/ColorConverterPage';
import { PasswordGeneratorPage } from './pages/password-generator/PasswordGeneratorPage';
import { LoremIpsumPage } from './pages/lorem-ipsum/LoremIpsumPage';
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
        path: '/json-formatter',
        element: <JsonFormatterPage />,
      },
      {
        path: '/yaml-json',
        element: <YamlJsonPage />,
      },
      {
        path: '/sql-formatter',
        element: <SqlFormatterPage />,
      },
      {
        path: '/csv-json',
        element: <CsvJsonPage />,
      },
      {
        path: '/jwt-decoder',
        element: <JwtDecoderPage />,
      },
      {
        path: '/hash-generator',
        element: <HashGeneratorPage />,
      },
      {
        path: '/uuid-generator',
        element: <UuidGeneratorPage />,
      },
      {
        path: '/html-entities',
        element: <HtmlEntitiesPage />,
      },
      {
        path: '/issue-finder',
        element: <IssueFinderPage />,
      },
      {
        path: '/regex-tester',
        element: <RegexTesterPage />,
      },
      {
        path: '/diff-viewer',
        element: <DiffViewerPage />,
      },
      {
        path: '/cron-parser',
        element: <CronParserPage />,
      },
      {
        path: '/timestamp-converter',
        element: <TimestampConverterPage />,
      },
      {
        path: '/color-converter',
        element: <ColorConverterPage />,
      },
      {
        path: '/password-generator',
        element: <PasswordGeneratorPage />,
      },
      {
        path: '/lorem-ipsum',
        element: <LoremIpsumPage />,
      },
      {
        path: '/countdown',
        element: <CountdownPage />,
      },
      {
        path: '/questions-formatter',
        element: <QuestionsFormatterPage />,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
