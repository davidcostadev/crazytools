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
  description?: string;
  keywords?: string[];
  personal?: boolean;
};

export const tools: Tool[] = [
  { path: '/graphql-payload', name: 'GraphQL Payload', category: 'Formatters', icon: 'graphql', description: 'Prettify GraphQL queries & variables', keywords: ['graphql', 'prettier', 'query'] },
  { path: '/text-formatters', name: 'Text Formatters', category: 'Formatters', icon: 'text', description: 'Change case, encode & transform text', keywords: ['case', 'uppercase', 'lowercase', 'capitalize', 'base64'] },
  { path: '/json-formatter', name: 'JSON Formatter', category: 'Formatters', icon: 'braces', description: 'Format & validate JSON', keywords: ['json', 'prettify', 'beautify'] },
  { path: '/yaml-json', name: 'YAML ↔ JSON', category: 'Formatters', icon: 'swap', description: 'Convert between YAML and JSON', keywords: ['yaml', 'yml', 'json', 'convert'] },
  { path: '/sql-formatter', name: 'SQL Formatter', category: 'Formatters', icon: 'database', description: 'Beautify SQL queries', keywords: ['sql', 'query'] },
  { path: '/csv-json', name: 'CSV ↔ JSON', category: 'Formatters', icon: 'table', description: 'Convert between CSV and JSON', keywords: ['csv', 'json', 'convert'] },

  { path: '/jwt-decoder', name: 'JWT Decoder', category: 'Encode / Crypto', icon: 'key', description: 'Inspect JSON Web Tokens', keywords: ['jwt', 'token', 'jsonwebtoken'] },
  { path: '/hash-generator', name: 'Hash Generator', category: 'Encode / Crypto', icon: 'hash', description: 'MD5, SHA-1 & SHA-256 hashes', keywords: ['md5', 'sha1', 'sha256', 'hash'] },
  { path: '/uuid-generator', name: 'UUID Generator', category: 'Encode / Crypto', icon: 'fingerprint', description: 'Generate UUIDs / GUIDs', keywords: ['uuid', 'guid'] },
  { path: '/html-entities', name: 'HTML Entities', category: 'Encode / Crypto', icon: 'code', description: 'Encode & decode HTML entities', keywords: ['html', 'entities', 'encode', 'decode'] },

  { path: '/issue-finder', name: 'Issue Finder', category: 'Dev Tools', icon: 'link', description: 'Open Linear / Jira tickets fast', keywords: ['issue', 'linear', 'jira', 'ticket', 'eat', 'link'] },
  { path: '/regex-tester', name: 'Regex Tester', category: 'Dev Tools', icon: 'regex', description: 'Test regular expressions live', keywords: ['regex', 'regexp', 'pattern'] },
  { path: '/diff-viewer', name: 'Diff Viewer', category: 'Dev Tools', icon: 'diff', description: 'Compare two texts side by side', keywords: ['diff', 'compare'] },
  { path: '/cron-parser', name: 'Cron Parser', category: 'Dev Tools', icon: 'clock', description: 'Explain cron expressions', keywords: ['cron', 'schedule'] },
  { path: '/timestamp-converter', name: 'Timestamp', category: 'Dev Tools', icon: 'timer', description: 'Convert Unix timestamps & dates', keywords: ['timestamp', 'unix', 'epoch', 'date'] },
  { path: '/color-converter', name: 'Color Converter', category: 'Dev Tools', icon: 'palette', description: 'HEX, RGB & HSL conversions', keywords: ['color', 'hex', 'rgb', 'hsl'] },
  { path: '/log-insights', name: 'Log Insights', category: 'Dev Tools', icon: 'activity', description: 'Analyze access log traffic', keywords: ['log', 'logs', 'nginx', 'apache', 'access', 'analytics', 'insights', 'traffic'] },

  { path: '/password-generator', name: 'Password', category: 'Generators', icon: 'lock', description: 'Generate strong passwords', keywords: ['password', 'random', 'generator'] },
  { path: '/lorem-ipsum', name: 'Lorem Ipsum', category: 'Generators', icon: 'file-text', description: 'Placeholder text generator', keywords: ['lorem', 'ipsum', 'placeholder', 'text'] },
  { path: '/countdown', name: 'Countdown', category: 'Generators', icon: 'hourglass', description: 'Countdown timer', keywords: ['countdown', 'timer'] },

  { path: '/questions-formatter', name: 'Questions Formatter', category: 'Personal', icon: 'help', description: 'Format question lists', personal: true },
];
