import yaml from 'js-yaml';
import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

export const YamlJsonPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    setError('');
  };

  const handleYamlToJson = () => {
    try {
      const parsed = yaml.load(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch {
      setError('Invalid YAML');
      setOutput('');
    }
  };

  const handleJsonToYaml = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(yaml.dump(parsed, { indent: 2 }));
      setError('');
    } catch {
      setError('Invalid JSON');
      setOutput('');
    }
  };

  return (
    <DefaultLayout title="YAML ↔ JSON">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleYamlToJson}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            YAML → JSON
          </button>
          <button
            onClick={handleJsonToYaml}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            JSON → YAML
          </button>
        </div>
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        <OutputPlan title="Result" text={output} />
      </div>
    </DefaultLayout>
  );
};
