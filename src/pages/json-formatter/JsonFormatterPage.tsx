import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

export const JsonFormatterPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    setError('');
  };

  const handlePrettify = (spaces: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError('');
    } catch {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✓ Valid JSON');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  return (
    <DefaultLayout title="JSON Formatter">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handlePrettify(2)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Prettify (2 spaces)
          </button>
          <button
            onClick={() => handlePrettify(4)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Prettify (4 spaces)
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Minify
          </button>
          <button
            onClick={handleValidate}
            className="px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600 text-sm"
          >
            Validate
          </button>
        </div>
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        <OutputPlan title="Result" text={output} />
      </div>
    </DefaultLayout>
  );
};
