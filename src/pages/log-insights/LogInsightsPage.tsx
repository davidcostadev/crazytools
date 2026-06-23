import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { DefaultLayout } from '../../layout/DefaultLayout';
import { BaselineContentCopy } from '../../components/icons/BaselineContentCopy';
import {
  parseLogs,
  countBy,
  buildTimeSeries,
  buildAiPrompt,
  formatBytes,
  formatTime,
  bucketLabelMode,
  statusClass,
  isBot,
  isSuspicious,
  TIME_ZONES,
  type LogEntry,
  type TimeBucket,
} from './logParser';

const SAMPLE = `20.151.222.27 - - [23/Jun/2026:13:15:19 +0000] "GET /info.php HTTP/1.1" 301 162 "-" "-"
146.56.197.150 - - [23/Jun/2026:13:17:38 +0000] "GET / HTTP/1.1" 301 162 "http://example.com" "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15"
66.249.66.67 - - [23/Jun/2026:16:06:40 +0000] "GET /robots.txt HTTP/1.1" 200 512 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
45.79.207.181 - - [23/Jun/2026:13:44:48 +0000] "GET / HTTP/1.1" 400 248 "-" "Mozilla/5.0 zgrab/0.x"
18.184.248.18 - - [23/Jun/2026:15:42:55 +0000] "HEAD /.credentials.json HTTP/1.1" 404 0 "-" "opendirme-credhunt/1.0"`;

export const LogInsightsPage = () => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const result = useMemo(() => parseLogs(text), [text]);
  const entries = result.entries;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setText(String(e.target?.result ?? ''));
    reader.readAsText(file);
  };

  return (
    <DefaultLayout title="Log Insights">
      <div className="space-y-5">
        <p className="text-sm text-neutral-600">
          Paste or upload nginx / Apache access logs (combined or common format). Everything is
          parsed locally in your browser - nothing is uploaded.
        </p>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='20.151.222.27 - - [23/Jun/2026:13:15:19 +0000] "GET /info.php HTTP/1.1" 301 162 "-" "-"'
            spellCheck={false}
            className="w-full h-44 resize-y p-3 border rounded font-mono text-xs outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-neutral-400 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm rounded border bg-white cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition-colors"
          >
            Upload log file
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,text/plain"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            className="px-3 py-1.5 text-sm rounded border bg-white cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition-colors"
          >
            Load sample
          </button>
          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="px-3 py-1.5 text-sm rounded border bg-white cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 text-neutral-600 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition-colors"
            >
              Clear
            </button>
          )}
          {text && (
            <span className="text-xs text-neutral-500">
              {result.parsedLines.toLocaleString()} parsed
              {result.skippedLines > 0 && ` · ${result.skippedLines.toLocaleString()} unrecognized`}
            </span>
          )}
        </div>

        {entries.length > 0 && <Dashboard entries={entries} />}
      </div>
    </DefaultLayout>
  );
};

const Dashboard = ({ entries }: { entries: LogEntry[] }) => {
  const stats = useMemo(() => {
    const dated = entries.filter((e) => e.date).map((e) => e.date!.getTime());
    const uniqueIps = new Set(entries.map((e) => e.ip)).size;
    const errors = entries.filter((e) => e.status >= 400).length;
    const serverErrors = entries.filter((e) => e.status >= 500).length;
    const totalBytes = entries.reduce((acc, e) => acc + e.size, 0);
    const bots = entries.filter((e) => isBot(e.userAgent)).length;
    const suspicious = entries.filter((e) => isSuspicious(e)).length;
    return {
      total: entries.length,
      uniqueIps,
      errors,
      serverErrors,
      errorRate: entries.length ? (errors / entries.length) * 100 : 0,
      totalBytes,
      avgBytes: entries.length ? totalBytes / entries.length : 0,
      bots,
      suspicious,
      first: dated.length ? new Date(Math.min(...dated)) : null,
      last: dated.length ? new Date(Math.max(...dated)) : null,
    };
  }, [entries]);

  const [tz, setTz] = useState(TIME_ZONES[0].tz);
  // A selected time window (bucket start + step in ms) acts like Chrome's network
  // time-range filter: clicking a point on the chart narrows the request explorer.
  const [selectedWindow, setSelectedWindow] = useState<{ start: number; end: number } | null>(null);

  const { buckets, stepSeconds } = useMemo(() => buildTimeSeries(entries), [entries]);
  const peak = useMemo(
    () => buckets.reduce<TimeBucket | null>((max, b) => (!max || b.count > max.count ? b : max), null),
    [buckets]
  );

  const topUrls = useMemo(() => countBy(entries, (e) => e.path), [entries]);
  const topIps = useMemo(() => countBy(entries, (e) => e.ip), [entries]);
  const methods = useMemo(() => countBy(entries, (e) => e.method), [entries]);
  const statuses = useMemo(
    () => countBy(entries, (e) => String(e.status)).sort((a, b) => +a.key - +b.key),
    [entries]
  );
  const userAgents = useMemo(
    () => countBy(entries.filter((e) => e.userAgent !== '-'), (e) => e.userAgent),
    [entries]
  );
  const referers = useMemo(
    () => countBy(entries.filter((e) => e.referer !== '-'), (e) => e.referer),
    [entries]
  );

  const recentIps = useMemo(() => {
    const seen = new Map<string, LogEntry>();
    for (const e of entries) {
      if (!e.date) continue;
      const prev = seen.get(e.ip);
      if (!prev || (prev.date && e.date > prev.date)) seen.set(e.ip, e);
    }
    return Array.from(seen.values()).sort((a, b) => b.date!.getTime() - a.date!.getTime());
  }, [entries]);

  const suspiciousEntries = useMemo(() => entries.filter((e) => isSuspicious(e)), [entries]);
  const topAttackers = useMemo(
    () => countBy(suspiciousEntries, (e) => e.ip),
    [suspiciousEntries]
  );

  const sizeStats = useMemo(() => {
    const sizes = entries.map((e) => e.size).filter((s) => s > 0).sort((a, b) => a - b);
    if (!sizes.length) return null;
    const p = (q: number) => sizes[Math.min(sizes.length - 1, Math.floor(sizes.length * q))];
    return { min: sizes[0], max: sizes[sizes.length - 1], median: p(0.5), p95: p(0.95) };
  }, [entries]);

  const [showPrompt, setShowPrompt] = useState(false);
  const aiPrompt = useMemo(() => buildAiPrompt(entries), [entries]);

  const copyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    toast.success('AI prompt copied to clipboard');
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copyPrompt}
          className="px-3 py-1.5 text-sm rounded border bg-blue-500 text-white border-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition-colors"
        >
          Copy as AI prompt
        </button>
        <button
          type="button"
          onClick={() => setShowPrompt((v) => !v)}
          className="px-3 py-1.5 text-sm rounded border bg-white cursor-pointer hover:bg-neutral-50 active:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none transition-colors"
        >
          {showPrompt ? 'Hide preview' : 'Preview prompt'}
        </button>

        <div className="ml-auto flex items-center gap-1">
          <span className="text-xs text-neutral-400 mr-1">Timezone:</span>
          <div className="inline-flex rounded border overflow-hidden">
            {TIME_ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => setTz(z.tz)}
                className={`px-2.5 py-1 text-xs cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${
                  tz === z.tz
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showPrompt && (
        <pre className="border rounded p-3 bg-neutral-50 text-[11px] font-mono whitespace-pre-wrap max-h-80 overflow-auto text-neutral-700">
          {aiPrompt}
        </pre>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Requests" value={stats.total.toLocaleString()} />
        <StatCard label="Unique IPs" value={stats.uniqueIps.toLocaleString()} />
        <StatCard
          label="Errors (4xx/5xx)"
          value={stats.errors.toLocaleString()}
          sub={`${stats.errorRate.toFixed(1)}%`}
          accent={stats.errors > 0 ? 'text-orange-500' : undefined}
        />
        <StatCard
          label="Server errors (5xx)"
          value={stats.serverErrors.toLocaleString()}
          accent={stats.serverErrors > 0 ? 'text-red-600' : undefined}
        />
        <StatCard label="Total payload" value={formatBytes(stats.totalBytes)} sub={`~${formatBytes(stats.avgBytes)} avg`} />
        <StatCard
          label="Suspicious"
          value={stats.suspicious.toLocaleString()}
          sub={`${stats.bots.toLocaleString()} bots`}
          accent={stats.suspicious > 0 ? 'text-red-600' : undefined}
        />
      </div>

      {stats.first && stats.last && (
        <div className="text-xs text-neutral-500">
          Time range: {formatTime(stats.first.getTime(), tz, 'full')} →{' '}
          {formatTime(stats.last.getTime(), tz, 'full')}{' '}
          {TIME_ZONES.find((z) => z.tz === tz)?.label}
        </div>
      )}

      <Panel
        title="Requests over time"
        subtitle={
          peak
            ? `Peak: ${peak.count} req @ ${formatTime(peak.time, tz, bucketLabelMode(stepSeconds))}`
            : undefined
        }
      >
        <TimeSeriesChart
          buckets={buckets}
          peak={peak}
          stepSeconds={stepSeconds}
          tz={tz}
          selectedTime={selectedWindow?.start ?? null}
          onSelect={(time) =>
            setSelectedWindow((prev) =>
              prev?.start === time ? null : { start: time, end: time + stepSeconds * 1000 }
            )
          }
        />
      </Panel>

      <RequestExplorer
        entries={entries}
        tz={tz}
        window={selectedWindow}
        onClearWindow={() => setSelectedWindow(null)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Top URLs" subtitle={`${topUrls.length} unique`} copyText={counterText(topUrls)}>
          <BarList items={topUrls} mono />
        </Panel>
        <Panel title="Top IPs" subtitle={`${topIps.length} unique`} copyText={counterText(topIps)}>
          <BarList items={topIps} mono />
        </Panel>
        <Panel title="Status codes" copyText={counterText(statuses)}>
          <BarList items={statuses} renderKey={(k) => <span className={statusClass(+k)}>{k}</span>} />
        </Panel>
        <Panel title="Methods" copyText={counterText(methods)}>
          <BarList items={methods} mono />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title="Most recent IPs"
          subtitle="last request seen per IP"
          copyText={recentIps
            .map((e) => `${formatTime(e.date!.getTime(), tz, 'full')}\t${e.ip}\t${e.path}`)
            .join('\n')}
        >
          <div className="space-y-1 max-h-72 overflow-auto pr-1">
            {recentIps.map((e, i) => (
              <div key={`${e.ip}-${i}`} className="flex items-center justify-between text-xs gap-2 py-0.5">
                <span className="font-mono">{e.ip}</span>
                <span className="text-neutral-400 truncate flex-1 mx-2 text-right">{e.path}</span>
                <span className="text-neutral-500 whitespace-nowrap font-mono">
                  {formatTime(e.date!.getTime(), tz, 'seconds')}
                </span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title="Suspicious activity"
          subtitle="scans, probes, malformed & known exploit paths"
          copyText={topAttackers.length ? counterText(topAttackers) : undefined}
        >
          {topAttackers.length ? (
            <BarList items={topAttackers} mono accent="bg-red-400" />
          ) : (
            <p className="text-xs text-neutral-400">No suspicious requests detected.</p>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel
          title="Top user agents"
          subtitle={userAgents.length ? `${userAgents.length} unique` : undefined}
          copyText={userAgents.length ? counterText(userAgents) : undefined}
        >
          {userAgents.length ? <BarList items={userAgents} mono small /> : <Empty />}
        </Panel>
        <Panel
          title="Top referers"
          subtitle={referers.length ? `${referers.length} unique` : undefined}
          copyText={referers.length ? counterText(referers) : undefined}
        >
          {referers.length ? <BarList items={referers} mono small /> : <Empty />}
        </Panel>
      </div>

      {sizeStats && (
        <Panel title="Payload size">
          <div className="grid grid-cols-4 gap-3 text-center">
            <Mini label="min" value={formatBytes(sizeStats.min)} />
            <Mini label="median" value={formatBytes(sizeStats.median)} />
            <Mini label="p95" value={formatBytes(sizeStats.p95)} />
            <Mini label="max" value={formatBytes(sizeStats.max)} />
          </div>
        </Panel>
      )}
    </div>
  );
};

// ---------- Presentational pieces ----------

const StatCard = ({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) => (
  <div className="border rounded p-3 bg-white">
    <div className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</div>
    <div className={`text-xl font-semibold ${accent ?? 'text-neutral-800'}`}>{value}</div>
    {sub && <div className="text-[11px] text-neutral-400">{sub}</div>}
  </div>
);

const counterText = (items: { key: string; count: number }[]): string =>
  items.map((i) => `${i.count}\t${i.key}`).join('\n');

const Panel = ({
  title,
  subtitle,
  copyText,
  children,
}: {
  title: string;
  subtitle?: string;
  copyText?: string;
  children: React.ReactNode;
}) => (
  <div className="border rounded p-4 bg-white">
    <div className="flex items-baseline justify-between mb-3 gap-2">
      <h3 className="text-sm font-medium text-neutral-800">{title}</h3>
      <div className="flex items-baseline gap-2">
        {subtitle && <span className="text-xs text-neutral-400">{subtitle}</span>}
        {copyText && <CopyButton text={copyText} label={`${title} copied`} />}
      </div>
    </div>
    {children}
  </div>
);

const CopyButton = ({ text, label }: { text: string; label: string }) => (
  <button
    type="button"
    aria-label={label}
    title="Copy to clipboard"
    onClick={() => {
      navigator.clipboard.writeText(text);
      toast.success(label);
    }}
    className="text-neutral-400 cursor-pointer hover:text-blue-500 active:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded p-0.5 transition-colors"
  >
    <BaselineContentCopy className="text-sm" />
  </button>
);

const Mini = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</div>
    <div className="text-base font-semibold text-neutral-800">{value}</div>
  </div>
);

const Empty = () => <p className="text-xs text-neutral-400">No data.</p>;

const BarList = ({
  items,
  mono,
  small,
  accent = 'bg-blue-400',
  renderKey,
}: {
  items: { key: string; count: number }[];
  mono?: boolean;
  small?: boolean;
  accent?: string;
  renderKey?: (key: string) => React.ReactNode;
}) => {
  const max = items.reduce((m, i) => Math.max(m, i.count), 0) || 1;
  return (
    <div className="space-y-1.5 max-h-72 overflow-auto pr-1">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <div className="flex-1 min-w-0 relative">
            <div
              className={`absolute inset-y-0 left-0 rounded ${accent} opacity-20`}
              style={{ width: `${(item.count / max) * 100}%` }}
            />
            <div
              className={`relative px-1.5 py-0.5 truncate ${mono ? 'font-mono' : ''} ${
                small ? 'text-[11px]' : 'text-xs'
              }`}
              title={item.key}
            >
              {renderKey ? renderKey(item.key) : item.key}
            </div>
          </div>
          <span className="text-xs text-neutral-500 tabular-nums w-12 text-right shrink-0">
            {item.count.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const TimeSeriesChart = ({
  buckets,
  peak,
  stepSeconds,
  tz,
  selectedTime,
  onSelect,
}: {
  buckets: TimeBucket[];
  peak: TimeBucket | null;
  stepSeconds: number;
  tz: string;
  selectedTime: number | null;
  onSelect: (time: number) => void;
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const W = 1000;
  const H = 220;
  const pad = { top: 10, right: 10, bottom: 28, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  if (buckets.length < 2) {
    return <p className="text-xs text-neutral-400">Not enough timestamped data to plot.</p>;
  }

  const labelMode = bucketLabelMode(stepSeconds);
  const max = buckets.reduce((m, b) => Math.max(m, b.count), 0) || 1;
  const x = (i: number) => pad.left + (i / (buckets.length - 1)) * innerW;
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;
  const colW = innerW / buckets.length;

  const linePath = buckets.map((b, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(b.count).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${x(buckets.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const errorPath = buckets
    .map((b, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(b.errors).toFixed(1)}`)
    .join(' ');

  const gridLines = 4;
  const labelEvery = Math.ceil(buckets.length / 8);
  const selectedIndex = selectedTime !== null ? buckets.findIndex((b) => b.time === selectedTime) : -1;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[480px] cursor-pointer"
        onMouseLeave={() => setHover(null)}
      >
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const gy = pad.top + (innerH / gridLines) * i;
          const val = Math.round(max - (max / gridLines) * i);
          return (
            <g key={i}>
              <line x1={pad.left} y1={gy} x2={W - pad.right} y2={gy} stroke="#f0f0f0" />
              <text x={pad.left - 6} y={gy + 3} textAnchor="end" fontSize="9" fill="#aaa">
                {val}
              </text>
            </g>
          );
        })}

        {selectedIndex >= 0 && (
          <rect
            x={x(selectedIndex) - colW / 2}
            y={pad.top}
            width={colW}
            height={innerH}
            fill="#3b82f6"
            opacity={0.15}
          />
        )}

        <path d={areaPath} fill="#3b82f6" opacity={0.1} />
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        <path d={errorPath} fill="none" stroke="#f97316" strokeWidth={1} opacity={0.8} />

        {peak && <circle cx={x(buckets.indexOf(peak))} cy={y(peak.count)} r={3} fill="#3b82f6" />}

        {buckets.map((b, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#999">
              {formatTime(b.time, tz, labelMode)}
            </text>
          ) : null
        )}

        {/* hover + click hit areas */}
        {buckets.map((b, i) => (
          <rect
            key={i}
            x={x(i) - colW / 2}
            y={pad.top}
            width={colW}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onClick={() => onSelect(b.time)}
          />
        ))}

        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              y1={pad.top}
              x2={x(hover)}
              y2={pad.top + innerH}
              stroke="#cbd5e1"
              strokeDasharray="3 3"
            />
            <circle cx={x(hover)} cy={y(buckets[hover].count)} r={3} fill="#3b82f6" />
          </g>
        )}
      </svg>
      <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1 px-1">
        <span>
          <span className="inline-block w-2 h-2 bg-blue-400 rounded-sm mr-1 align-middle" />
          requests
          <span className="inline-block w-2 h-2 bg-orange-400 rounded-sm ml-3 mr-1 align-middle" />
          errors
          <span className="ml-3 text-neutral-400">· click a point to filter requests</span>
        </span>
        {hover !== null && (
          <span className="font-mono">
            {formatTime(buckets[hover].time, tz, labelMode)}: {buckets[hover].count} req ·{' '}
            {buckets[hover].errors} err
          </span>
        )}
      </div>
    </div>
  );
};

const ROW_LIMIT = 1000;

const RequestExplorer = ({
  entries,
  tz,
  window,
  onClearWindow,
}: {
  entries: LogEntry[];
  tz: string;
  window: { start: number; end: number } | null;
  onClearWindow: () => void;
}) => {
  const [query, setQuery] = useState('');
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [onlySuspicious, setOnlySuspicious] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (window && e.date) {
        const t = e.date.getTime();
        if (t < window.start || t >= window.end) return false;
      } else if (window && !e.date) {
        return false;
      }
      if (onlyErrors && e.status < 400) return false;
      if (onlySuspicious && !isSuspicious(e)) return false;
      if (q) {
        const hay = `${e.ip} ${e.method} ${e.status} ${e.path} ${e.userAgent} ${e.referer}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [entries, query, onlyErrors, onlySuspicious, window]);

  const shown = filtered.slice(0, ROW_LIMIT);

  const copyText = filtered
    .map(
      (e) =>
        `${e.date ? formatTime(e.date.getTime(), tz, 'full') : '-'}\t${e.ip}\t${e.method}\t${
          e.status
        }\t${e.size}\t${e.path}\t${e.userAgent}`
    )
    .join('\n');

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-sm font-medium text-neutral-800">
          Request explorer
          <span className="ml-2 text-xs text-neutral-400 font-normal">
            {filtered.length.toLocaleString()} of {entries.length.toLocaleString()}
            {filtered.length > ROW_LIMIT && ` (showing first ${ROW_LIMIT.toLocaleString()})`}
          </span>
        </h3>
        <CopyButton text={copyText} label="Filtered requests copied" />
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by IP, path, status, method, user agent..."
          className="flex-1 min-w-[200px] border rounded px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-neutral-400 transition-colors"
        />
        <label className="inline-flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyErrors}
            onChange={(e) => setOnlyErrors(e.target.checked)}
            className="cursor-pointer accent-blue-500"
          />
          Errors only
        </label>
        <label className="inline-flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlySuspicious}
            onChange={(e) => setOnlySuspicious(e.target.checked)}
            className="cursor-pointer accent-blue-500"
          />
          Suspicious only
        </label>
      </div>

      {window && (
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1">
            Time window: {formatTime(window.start, tz, 'seconds')} → {formatTime(window.end, tz, 'seconds')}
            <button
              type="button"
              onClick={onClearWindow}
              aria-label="Clear time window filter"
              className="cursor-pointer hover:text-blue-900 active:text-blue-950 font-medium focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none rounded"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      <div className="max-h-96 overflow-auto border rounded">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-2 py-1.5 font-medium whitespace-nowrap">Time</th>
              <th className="px-2 py-1.5 font-medium whitespace-nowrap">IP</th>
              <th className="px-2 py-1.5 font-medium">Method</th>
              <th className="px-2 py-1.5 font-medium">Status</th>
              <th className="px-2 py-1.5 font-medium whitespace-nowrap text-right">Size</th>
              <th className="px-2 py-1.5 font-medium">Path</th>
              <th className="px-2 py-1.5 font-medium">User agent</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {shown.map((e, i) => (
              <tr key={i} className="border-t hover:bg-neutral-50">
                <td className="px-2 py-1 whitespace-nowrap text-neutral-500">
                  {e.date ? formatTime(e.date.getTime(), tz, 'seconds') : '-'}
                </td>
                <td className="px-2 py-1 whitespace-nowrap">{e.ip}</td>
                <td className="px-2 py-1">{e.method}</td>
                <td className={`px-2 py-1 ${statusClass(e.status)}`}>{e.status}</td>
                <td className="px-2 py-1 text-right text-neutral-500 tabular-nums">
                  {e.size ? formatBytes(e.size) : '-'}
                </td>
                <td className="px-2 py-1 max-w-[280px] truncate" title={e.path}>
                  {e.path}
                </td>
                <td className="px-2 py-1 max-w-[220px] truncate text-neutral-400" title={e.userAgent}>
                  {e.userAgent}
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={7} className="px-2 py-6 text-center text-neutral-400">
                  No requests match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
