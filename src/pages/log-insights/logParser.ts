export type LogEntry = {
  ip: string;
  date: Date | null;
  rawDate: string;
  method: string;
  path: string;
  protocol: string;
  status: number;
  size: number;
  referer: string;
  userAgent: string;
  malformed: boolean;
  raw: string;
};

export type ParseResult = {
  entries: LogEntry[];
  totalLines: number;
  parsedLines: number;
  skippedLines: number;
};

// Common / combined nginx log line:
// IP - - [date] "request" status size "referer" "user-agent"
const LINE_RE =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"((?:[^"\\]|\\.)*)"\s+(\d{3})\s+(\S+)(?:\s+"((?:[^"\\]|\\.)*)"\s+"((?:[^"\\]|\\.)*)")?/;

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

// 23/Jun/2026:13:15:19 +0000
function parseDate(raw: string): Date | null {
  const m = raw.match(
    /^(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})\s+([+-]\d{4})$/
  );
  if (!m) return null;
  const [, day, mon, year, h, min, s, tz] = m;
  const month = MONTHS[mon];
  if (month === undefined) return null;
  // Build a UTC timestamp then adjust by the timezone offset.
  const base = Date.UTC(+year, month, +day, +h, +min, +s);
  const sign = tz[0] === '-' ? -1 : 1;
  const tzMinutes = sign * (parseInt(tz.slice(1, 3), 10) * 60 + parseInt(tz.slice(3, 5), 10));
  return new Date(base - tzMinutes * 60_000);
}

function parseRequest(request: string): { method: string; path: string; protocol: string; malformed: boolean } {
  const parts = request.split(' ');
  if (parts.length >= 2 && /^[A-Z]+$/.test(parts[0])) {
    return {
      method: parts[0],
      path: parts.slice(1, parts.length - 1).join(' ') || parts[1],
      protocol: parts.length >= 3 ? parts[parts.length - 1] : '',
      malformed: false,
    };
  }
  // Garbage / TLS handshake / probes that are not valid HTTP requests.
  return { method: '-', path: request, protocol: '', malformed: true };
}

export function parseLogs(text: string): ParseResult {
  const lines = text.split(/\r?\n/);
  const entries: LogEntry[] = [];
  let totalLines = 0;
  let skippedLines = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    totalLines++;
    const m = line.match(LINE_RE);
    if (!m) {
      skippedLines++;
      continue;
    }
    const [, ip, rawDate, request, status, sizeRaw, referer, userAgent] = m;
    const req = parseRequest(request);
    entries.push({
      ip,
      date: parseDate(rawDate),
      rawDate,
      method: req.method,
      path: req.path,
      protocol: req.protocol,
      status: parseInt(status, 10),
      size: sizeRaw === '-' ? 0 : parseInt(sizeRaw, 10) || 0,
      referer: referer ?? '-',
      userAgent: userAgent ?? '-',
      malformed: req.malformed,
      raw: line,
    });
  }

  return {
    entries,
    totalLines,
    parsedLines: entries.length,
    skippedLines,
  };
}

// ---------- Aggregations ----------

export type Counter = { key: string; count: number };

export function countBy<T>(items: T[], getKey: (item: T) => string): Counter[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = getKey(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export type TimeBucket = { time: number; label: string; count: number; errors: number };

const NICE_STEPS_SECONDS = [
  1, 5, 10, 30,
  60, 300, 600, 1800,
  3600, 7200, 21600, 43200,
  86400,
];

function pad(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function formatBucketLabel(d: Date, stepSeconds: number): string {
  if (stepSeconds >= 86400) {
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }
  if (stepSeconds >= 3600) {
    return `${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:00`;
  }
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}${
    stepSeconds < 60 ? ':' + pad(d.getUTCSeconds()) : ''
  }`;
}

export function buildTimeSeries(entries: LogEntry[], targetBuckets = 60): {
  buckets: TimeBucket[];
  stepSeconds: number;
} {
  const dated = entries.filter((e) => e.date).map((e) => e.date!.getTime());
  if (dated.length === 0) return { buckets: [], stepSeconds: 0 };

  const min = Math.min(...dated);
  const max = Math.max(...dated);
  const spanSeconds = Math.max((max - min) / 1000, 1);
  const idealStep = spanSeconds / targetBuckets;
  const stepSeconds =
    NICE_STEPS_SECONDS.find((s) => s >= idealStep) ?? NICE_STEPS_SECONDS[NICE_STEPS_SECONDS.length - 1];
  const stepMs = stepSeconds * 1000;

  const start = Math.floor(min / stepMs) * stepMs;
  const map = new Map<number, TimeBucket>();
  for (const e of entries) {
    if (!e.date) continue;
    const bucketTime = Math.floor(e.date.getTime() / stepMs) * stepMs;
    let bucket = map.get(bucketTime);
    if (!bucket) {
      bucket = {
        time: bucketTime,
        label: formatBucketLabel(new Date(bucketTime), stepSeconds),
        count: 0,
        errors: 0,
      };
      map.set(bucketTime, bucket);
    }
    bucket.count++;
    if (e.status >= 400) bucket.errors++;
  }

  // Fill empty buckets so the line chart shows real gaps.
  const buckets: TimeBucket[] = [];
  for (let t = start; t <= max; t += stepMs) {
    buckets.push(
      map.get(t) ?? {
        time: t,
        label: formatBucketLabel(new Date(t), stepSeconds),
        count: 0,
        errors: 0,
      }
    );
  }
  return { buckets, stepSeconds };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function statusClass(status: number): string {
  if (status >= 500) return 'text-red-600';
  if (status >= 400) return 'text-orange-500';
  if (status >= 300) return 'text-blue-500';
  if (status >= 200) return 'text-green-600';
  return 'text-neutral-500';
}

// ---------- Security / bot heuristics ----------

const BOT_RE = /bot|spider|crawl|slurp|bingbot|googlebot|baiduspider|yandex|facebookexternalhit|gptbot|claudebot|amazonbot|petalbot|semrush|ahrefs|dotbot|bytespider|sogou|barkrowler|searchbot|meta-externalagent|photon|skype|zgrab|scan/i;

const SUSPICIOUS_PATH_RE =
  /\.php|\.env|\.git|\.aws|wp-admin|wp-content|wp-includes|wp-login|\.well-known|phpmyadmin|\.\.|credentials|backup|shell|cmd|config\.|admin\.|eval|base64|filemanager|cgi-bin/i;

export function isBot(ua: string): boolean {
  return BOT_RE.test(ua);
}

export function isSuspicious(entry: LogEntry): boolean {
  if (entry.malformed) return true;
  if (SUSPICIOUS_PATH_RE.test(entry.path)) return true;
  if (entry.userAgent === '-' && entry.method !== '-' && entry.path.endsWith('.php')) return true;
  return false;
}

// ---------- AI prompt summary ----------

function topLines(items: Counter[], n: number): string {
  return items
    .slice(0, n)
    .map((i) => `  - ${i.key} (${i.count.toLocaleString()})`)
    .join('\n');
}

export function buildAiPrompt(entries: LogEntry[]): string {
  if (!entries.length) return '';

  const dated = entries.filter((e) => e.date).map((e) => e.date!.getTime());
  const first = dated.length ? new Date(Math.min(...dated)) : null;
  const last = dated.length ? new Date(Math.max(...dated)) : null;
  const uniqueIps = new Set(entries.map((e) => e.ip)).size;
  const errors = entries.filter((e) => e.status >= 400);
  const serverErrors = entries.filter((e) => e.status >= 500).length;
  const totalBytes = entries.reduce((acc, e) => acc + e.size, 0);
  const suspicious = entries.filter((e) => isSuspicious(e));
  const bots = entries.filter((e) => isBot(e.userAgent)).length;

  const topUrls = countBy(entries, (e) => e.path);
  const topIps = countBy(entries, (e) => e.ip);
  const methods = countBy(entries, (e) => e.method);
  const statuses = countBy(entries, (e) => String(e.status)).sort((a, b) => +a.key - +b.key);
  const topAttackers = countBy(suspicious, (e) => e.ip);
  const topAgents = countBy(
    entries.filter((e) => e.userAgent !== '-'),
    (e) => e.userAgent
  );

  const errorRate = ((errors.length / entries.length) * 100).toFixed(1);
  const range =
    first && last
      ? `${first.toISOString().replace('T', ' ').slice(0, 19)} to ${last
          .toISOString()
          .replace('T', ' ')
          .slice(0, 19)} UTC`
      : 'unknown';

  return `You are a security and web-traffic analyst. Analyze the following web server access-log summary and give me:
1. A short assessment of overall traffic health.
2. Any security concerns (scanning, probing, exploit attempts) and which IPs to block or rate-limit.
3. Notable patterns in errors, bots, and most-requested URLs.
4. Concrete, prioritized recommendations.

=== ACCESS LOG SUMMARY ===
Time range: ${range}
Total requests: ${entries.length.toLocaleString()}
Unique IP addresses: ${uniqueIps.toLocaleString()}
Total payload: ${formatBytes(totalBytes)}
Errors (4xx/5xx): ${errors.length.toLocaleString()} (${errorRate}% of all requests)
Server errors (5xx): ${serverErrors.toLocaleString()}
Likely bot requests: ${bots.toLocaleString()}
Suspicious requests (scans/probes/malformed/exploit paths): ${suspicious.length.toLocaleString()}

HTTP methods:
${topLines(methods, 8)}

Status codes:
${topLines(statuses, 10)}

Top requested URLs:
${topLines(topUrls, 15)}

Top client IPs by request volume:
${topLines(topIps, 10)}

Top suspicious / attacking IPs (by suspicious request count):
${topAttackers.length ? topLines(topAttackers, 10) : '  - none detected'}

Top user agents:
${topAgents.length ? topLines(topAgents, 8) : '  - none recorded'}
=== END SUMMARY ===`;
}
