import { format } from 'sql-formatter';
import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

type SqlDialect = 'sql' | 'mysql' | 'postgresql' | 'mariadb' | 'transactsql' | 'plsql';

const dialects: { value: SqlDialect; label: string }[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'transactsql', label: 'SQL Server' },
  { value: 'plsql', label: 'PL/SQL' },
];

export const SqlFormatterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<SqlDialect>('sql');
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    setError('');
  };

  const handleFormat = () => {
    try {
      const formatted = format(input, { language: dialect, tabWidth: 2 });
      setOutput(formatted);
      setError('');
    } catch {
      setError('Error formatting SQL');
      setOutput('');
    }
  };

  return (
    <DefaultLayout title="SQL Formatter">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlDialect)}
            className="px-3 py-2 border rounded text-sm"
          >
            {dialects.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleFormat}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Format
          </button>
        </div>
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        <OutputPlan title="Formatted SQL" text={output} />
      </div>
    </DefaultLayout>
  );
};
