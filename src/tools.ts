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
  keywords?: string[];
  personal?: boolean;
};

export const tools: Tool[] = [
  { path: '/', name: 'GraphQL Payload', category: 'Formatters', keywords: ['graphql', 'prettier', 'query'] },
  { path: '/text-formatters', name: 'Text Formatters', category: 'Formatters', keywords: ['case', 'uppercase', 'lowercase', 'capitalize', 'base64'] },
  { path: '/json-formatter', name: 'JSON Formatter', category: 'Formatters', keywords: ['json', 'prettify', 'beautify'] },
  { path: '/yaml-json', name: 'YAML ↔ JSON', category: 'Formatters', keywords: ['yaml', 'yml', 'json', 'convert'] },
  { path: '/sql-formatter', name: 'SQL Formatter', category: 'Formatters', keywords: ['sql', 'query'] },
  { path: '/csv-json', name: 'CSV ↔ JSON', category: 'Formatters', keywords: ['csv', 'json', 'convert'] },

  { path: '/jwt-decoder', name: 'JWT Decoder', category: 'Encode / Crypto', keywords: ['jwt', 'token', 'jsonwebtoken'] },
  { path: '/hash-generator', name: 'Hash Generator', category: 'Encode / Crypto', keywords: ['md5', 'sha1', 'sha256', 'hash'] },
  { path: '/uuid-generator', name: 'UUID Generator', category: 'Encode / Crypto', keywords: ['uuid', 'guid'] },
  { path: '/html-entities', name: 'HTML Entities', category: 'Encode / Crypto', keywords: ['html', 'entities', 'encode', 'decode'] },

  { path: '/regex-tester', name: 'Regex Tester', category: 'Dev Tools', keywords: ['regex', 'regexp', 'pattern'] },
  { path: '/diff-viewer', name: 'Diff Viewer', category: 'Dev Tools', keywords: ['diff', 'compare'] },
  { path: '/cron-parser', name: 'Cron Parser', category: 'Dev Tools', keywords: ['cron', 'schedule'] },
  { path: '/timestamp-converter', name: 'Timestamp', category: 'Dev Tools', keywords: ['timestamp', 'unix', 'epoch', 'date'] },
  { path: '/color-converter', name: 'Color Converter', category: 'Dev Tools', keywords: ['color', 'hex', 'rgb', 'hsl'] },

  { path: '/password-generator', name: 'Password', category: 'Generators', keywords: ['password', 'random', 'generator'] },
  { path: '/lorem-ipsum', name: 'Lorem Ipsum', category: 'Generators', keywords: ['lorem', 'ipsum', 'placeholder', 'text'] },
  { path: '/countdown', name: 'Countdown', category: 'Generators', keywords: ['countdown', 'timer'] },

  { path: '/questions-formatter', name: 'Questions Formatter', category: 'Personal', personal: true },
];
