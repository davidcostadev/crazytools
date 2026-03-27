import Papa from 'papaparse';
import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

export const CsvJsonPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    setError('');
  };

  const handleCsvToJson = () => {
    try {
      const result = Papa.parse(input, { header: true, skipEmptyLines: true });
      if (result.errors.length > 0) {
        setError(result.errors[0].message);
        setOutput('');
        return;
      }
      setOutput(JSON.stringify(result.data, null, 2));
      setError('');
    } catch {
      setError('Invalid CSV');
      setOutput('');
    }
  };

  const handleJsonToCsv = () => {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array of objects');
        setOutput('');
        return;
      }
      const csv = Papa.unparse(parsed);
      setOutput(csv);
      setError('');
    } catch {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  return (
    <DefaultLayout title="CSV ↔ JSON">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleCsvToJson}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            CSV → JSON
          </button>
          <button
            onClick={handleJsonToCsv}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            JSON → CSV
          </button>
        </div>
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        <OutputPlan title="Result" text={output} />
      </div>
    </DefaultLayout>
  );
};
