import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

function encodeHtmlEntities(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export const HtmlEntitiesPage = () => {
  const [input, setInput] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  return (
    <DefaultLayout title="HTML Entities">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-col md:flex-row">
          <OutputPlan title="Encoded" text={input ? encodeHtmlEntities(input) : ''} className="flex-1" />
          <OutputPlan title="Decoded" text={input ? decodeHtmlEntities(input) : ''} className="flex-1" />
        </div>
      </div>
    </DefaultLayout>
  );
};
