import { useState } from 'react';
import toast from 'react-hot-toast';
import { DefaultLayout } from '../../layout/DefaultLayout';
import { BaselineContentCopy } from '../../components/icons/BaselineContentCopy';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'voluptas', 'aspernatur', 'aut', 'odit', 'fugit',
];

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(minWords = 6, maxWords = 15): string {
  const count = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = Array.from({ length: count }, () => randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateParagraph(): string {
  const sentenceCount = Math.floor(Math.random() * 4) + 3;
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
}

type GenerateType = 'paragraphs' | 'sentences' | 'words';

function generate(type: GenerateType, count: number): string {
  switch (type) {
    case 'paragraphs':
      return Array.from({ length: count }, () => generateParagraph()).join('\n\n');
    case 'sentences':
      return Array.from({ length: count }, () => generateSentence()).join(' ');
    case 'words':
      return Array.from({ length: count }, () => randomWord()).join(' ');
  }
}

export const LoremIpsumPage = () => {
  const [type, setType] = useState<GenerateType>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    setOutput(generate(type, count));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard');
  };

  return (
    <DefaultLayout title="Lorem Ipsum Generator">
      <div className="space-y-5">
        <div className="flex gap-2 items-center flex-wrap">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GenerateType)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="border rounded px-3 py-2 w-20 text-sm"
          />
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Generate
          </button>
        </div>
        {output && (
          <div className="relative">
            <div className="bg-neutral-200 rounded px-4 py-3 font-mono text-sm whitespace-pre-wrap">
              {output}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-black hover:text-opacity-80 active:text-opacity-100 inline-flex gap-1 items-center bg-neutral-300 rounded px-2 py-1"
            >
              <BaselineContentCopy className="w-3 h-3" />
              <span className="text-xs">copy</span>
            </button>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
