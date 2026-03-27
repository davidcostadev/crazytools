import cronstrue from 'cronstrue';
import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { DefaultLayout } from '../../layout/DefaultLayout';

function getNextExecutions(cron: string, count: number): string[] {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return [];

  try {
    const dates: string[] = [];
    const now = new Date();
    let current = new Date(now);

    for (let i = 0; i < count && dates.length < count; i++) {
      current = new Date(current.getTime() + 60000);
      const minute = parts[0] === '*' ? current.getMinutes() : parseInt(parts[0]);
      const hour = parts[1] === '*' ? current.getHours() : parseInt(parts[1]);

      if (parts[0] !== '*' && current.getMinutes() !== minute) continue;
      if (parts[1] !== '*' && current.getHours() !== hour) continue;

      dates.push(current.toLocaleString());
      if (dates.length >= count) break;
    }
    return dates;
  } catch {
    return [];
  }
}

export const CronParserPage = () => {
  const [input, setInput] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [nextRuns, setNextRuns] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError('');
    setDescription('');
    setNextRuns([]);

    if (!value.trim()) return;

    try {
      const desc = cronstrue.toString(value);
      setDescription(desc);
      setNextRuns(getNextExecutions(value, 5));
    } catch {
      setError('Invalid cron expression');
    }
  };

  return (
    <DefaultLayout title="Cron Parser">
      <div className="space-y-5">
        <div>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="e.g. */5 * * * *"
            className="border rounded px-4 py-2 w-full font-mono text-sm"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        <OutputPlan title="Description" text={description} />
        {nextRuns.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Next executions (approximate)</h3>
            <div className="space-y-1">
              {nextRuns.map((run, i) => (
                <div key={i} className="bg-neutral-100 rounded px-4 py-1 font-mono text-sm">
                  {run}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
