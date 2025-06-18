import { useState } from 'react';

import { DefaultLayout } from '../../layout/DefaultLayout';
import { WordCounter } from '../../components/WordCounter';
import { camelCase } from 'lodash';
import { OutputPlan } from '../../components/ui/OutputPlan';

export const TextFormattersPage = () => {
  const [input, setInput] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <DefaultLayout title="Text Formatters">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-row flex-wrap">
          <OutputPlan
            title="Camel Case"
            text={camelCase(input)}
            className="w-full h-40 max-w-[20rem]"
          />
          <OutputPlan
            title="Kebab Case"
            text={formatterKebabCase(input)}
            className="w-full h-40 max-w-[20rem]"
          />
          <OutputPlan
            title="Snake Case"
            text={formatterSnakeCase(input)}
            className="w-full h-40 max-w-[20rem]"
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

function formatterKebabCase(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9 ]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function formatterSnakeCase(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9 ]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase();
}
