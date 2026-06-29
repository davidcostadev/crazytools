import { Tool } from '../tools';

export const scoreTool = (tool: Tool, q: string): number => {
  if (!q) return 1;
  const haystack = [tool.name, tool.category, tool.description, ...(tool.keywords ?? [])]
    .join(' ')
    .toLowerCase();
  const query = q.toLowerCase().trim();
  if (tool.name.toLowerCase().startsWith(query)) return 3;
  if (haystack.includes(query)) return 2;
  let i = 0;
  for (const ch of haystack) {
    if (ch === query[i]) i++;
    if (i === query.length) return 1;
  }
  return 0;
};

export const searchTools = (source: Tool[], q: string): Tool[] =>
  source
    .map((tool) => ({ tool, s: scoreTool(tool, q) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .map(({ tool }) => tool);
