import type { IconName } from './components/icons/ToolIcon';

export type ToolCategory =
  | 'Formatters'
  | 'Encode / Crypto'
  | 'Dev Tools'
  | 'Generators'
  | 'Personal';

export type Tool = {
  path: string;
  name: string;
  category: ToolCategory;
  icon: IconName;
  keywords?: string[];
  personal?: boolean;
};

export const tools: Tool[] = [
  { path: '/', name: 'GraphQL Payload', category: 'Formatters', icon: 'graphql', keywords: ['graphql', 'prettier', 'query'] },
  { path: '/text-formatters', name: 'Text Formatters', category: 'Formatters', icon: 'text', keywords: ['case', 'uppercase', 'lowercase', 'capitalize', 'base64'] },
  { path: '/json-formatter', name: 'JSON Formatter', category: 'Formatters', icon: 'braces', keywords: ['json', 'prettify', 'beautify'] },
  { path: '/yaml-json', name: 'YAML ↔ JSON', category: 'Formatters', icon: 'swap', keywords: ['yaml', 'yml', 'json', 'convert'] },
  { path: '/sql-formatter', name: 'SQL Formatter', category: 'Formatters', icon: 'database', keywords: ['sql', 'query'] },
  { path: '/csv-json', name: 'CSV ↔ JSON', category: 'Formatters', icon: 'table', keywords: ['csv', 'json', 'convert'] },

  { path: '/jwt-decoder', name: 'JWT Decoder', category: 'Encode / Crypto', icon: 'key', keywords: ['jwt', 'token', 'jsonwebtoken'] },
  { path: '/hash-generator', name: 'Hash Generator', category: 'Encode / Crypto', icon: 'hash', keywords: ['md5', 'sha1', 'sha256', 'hash'] },
  { path: '/uuid-generator', name: 'UUID Generator', category: 'Encode / Crypto', icon: 'fingerprint', keywords: ['uuid', 'guid'] },
  { path: '/html-entities', name: 'HTML Entities', category: 'Encode / Crypto', icon: 'code', keywords: ['html', 'entities', 'encode', 'decode'] },

  { path: '/regex-tester', name: 'Regex Tester', category: 'Dev Tools', icon: 'regex', keywords: ['regex', 'regexp', 'pattern'] },
  { path: '/diff-viewer', name: 'Diff Viewer', category: 'Dev Tools', icon: 'diff', keywords: ['diff', 'compare'] },
  { path: '/cron-parser', name: 'Cron Parser', category: 'Dev Tools', icon: 'clock', keywords: ['cron', 'schedule'] },
  { path: '/timestamp-converter', name: 'Timestamp', category: 'Dev Tools', icon: 'timer', keywords: ['timestamp', 'unix', 'epoch', 'date'] },
  { path: '/color-converter', name: 'Color Converter', category: 'Dev Tools', icon: 'palette', keywords: ['color', 'hex', 'rgb', 'hsl'] },

  { path: '/password-generator', name: 'Password', category: 'Generators', icon: 'lock', keywords: ['password', 'random', 'generator'] },
  { path: '/lorem-ipsum', name: 'Lorem Ipsum', category: 'Generators', icon: 'file-text', keywords: ['lorem', 'ipsum', 'placeholder', 'text'] },
  { path: '/countdown', name: 'Countdown', category: 'Generators', icon: 'hourglass', keywords: ['countdown', 'timer'] },

  { path: '/questions-formatter', name: 'Questions Formatter', category: 'Personal', icon: 'help', personal: true },
];
