import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { DefaultLayout } from '../../layout/DefaultLayout';

function parseTimestamp(value: string): Date | null {
  const num = Number(value);
  if (isNaN(num)) return null;
  // If the number is less than 1e12, treat as seconds; otherwise as milliseconds
  const ms = num < 1e12 ? num * 1000 : num;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;
  return date;
}

export const TimestampConverterPage = () => {
  const [input, setInput] = useState('');
  const [dateInput, setDateInput] = useState('');

  const handleNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setInput(String(now));
  };

  const date = input ? parseTimestamp(input) : null;
  const dateToTimestamp = dateInput ? Math.floor(new Date(dateInput).getTime() / 1000) : null;

  return (
    <DefaultLayout title="Timestamp Converter">
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-medium mb-2">Unix Timestamp → Date</h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 1700000000"
              className="border rounded px-4 py-2 flex-1 font-mono text-sm"
            />
            <button
              onClick={handleNow}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Now
            </button>
          </div>
        </div>
        {input && !date && <p className="text-red-500 text-sm font-mono">Invalid timestamp</p>}
        {date && (
          <div className="flex gap-2 flex-row flex-wrap">
            <OutputPlan title="ISO 8601" text={date.toISOString()} className="w-full max-w-[25rem] min-h-[5rem]" />
            <OutputPlan title="Local" text={date.toLocaleString()} className="w-full max-w-[25rem] min-h-[5rem]" />
            <OutputPlan title="UTC" text={date.toUTCString()} className="w-full max-w-[25rem] min-h-[5rem]" />
            <OutputPlan
              title="Seconds"
              text={String(Math.floor(date.getTime() / 1000))}
              className="w-full max-w-[25rem] min-h-[5rem]"
            />
            <OutputPlan
              title="Milliseconds"
              text={String(date.getTime())}
              className="w-full max-w-[25rem] min-h-[5rem]"
            />
          </div>
        )}
        <hr className="border-neutral-300" />
        <div>
          <h3 className="text-sm font-medium mb-2">Date → Unix Timestamp</h3>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="border rounded px-4 py-2 font-mono text-sm"
          />
        </div>
        {dateToTimestamp && !isNaN(dateToTimestamp) && (
          <div className="flex gap-2 flex-row flex-wrap">
            <OutputPlan
              title="Seconds"
              text={String(dateToTimestamp)}
              className="w-full max-w-[25rem] min-h-[5rem]"
            />
            <OutputPlan
              title="Milliseconds"
              text={String(dateToTimestamp * 1000)}
              className="w-full max-w-[25rem] min-h-[5rem]"
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
