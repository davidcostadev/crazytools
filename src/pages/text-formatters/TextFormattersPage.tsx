import { Base64 } from 'js-base64';
import { camelCase, capitalize, kebabCase, snakeCase, upperFirst } from 'lodash';
import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

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
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Kebab Case"
            text={formatterKebabCase(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem] flex flex-col"
          />
          <OutputPlan
            title="Snake Case"
            text={formatterSnakeCase(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Pascal Case"
            text={formatterPascalCase(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Capitalize"
            text={formatterCapitalize(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Lowercase"
            text={formatterLowercase(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Uppercase"
            text={formatterUppercase(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Title Case"
            text={formatterTitleCase(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Text Reverse"
            text={formatterTextReverse(input)}
            className="w-full min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="URL Decode"
            text={formatterURLDecode(input)}
            className="w-full min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="URL Decode 2"
            text={formatterUrlDecode2(input)}
            className="w-full min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="URL Encode"
            text={formatterURLEncode(input)}
            className="w-full min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Base64 Encode"
            text={formatterBase64Encode(input)}
            className="w-full h-auto min-h-[10rem] max-w-[20rem]"
          />
          <OutputPlan
            title="Base64 Decode"
            text={formatterBase64Decode(input)}
            className="w-full h-auto h-min-[10rem] max-w-[20rem]"
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

function formatterCapitalize(value: string) {
  return capitalize(value);
}

function formatterLowercase(value: string) {
  return value.toLowerCase();
}

function formatterUppercase(value: string) {
  return value.toUpperCase();
}

const preposicoesSimples = [
  'a',
  'ante',
  'após',
  'até',
  'com',
  'contra',
  'de',
  'desde',
  'em',
  'entre',
  'para',
  'perante',
  'por',
  'sem',
  'sob',
  'sobre',
  'trás',
];

const preposicoesContraidas = [
  'do', // de + o
  'da', // de + a
  'dos', // de + os
  'das', // de + as
  'no', // em + o
  'na', // em + a
  'nos', // em + os
  'nas', // em + as
  'pelo', // por + o
  'pela', // por + a
  'pelos', // por + os
  'pelas', // por + as
  'ao', // a + o
  'à', // a + a
  'aos', // a + os
  'às', // a + as
  'àquele',
  'àquela',
  'àqueles',
  'àquelas', // a + aquele(s)/aquela(s)
];

const simplePrepositions = [
  'about',
  'above',
  'across',
  'after',
  'against',
  'along',
  'among',
  'around',
  'at',
  'before',
  'behind',
  'below',
  'beneath',
  'beside',
  'between',
  'beyond',
  'but', // meaning "except"
  'by',
  'concerning',
  'despite',
  'down',
  'during',
  'except',
  'for',
  'from',
  'in',
  'inside',
  'into',
  'like',
  'near',
  'of',
  'off',
  'on',
  'onto',
  'out',
  'outside',
  'over',
  'past',
  'regarding',
  'since',
  'through',
  'throughout',
  'to',
  'toward',
  'under',
  'underneath',
  'until',
  'up',
  'upon',
  'with',
  'within',
  'without',
];

function formatterTitleCase(value: string) {
  const words = value.split(' ');
  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();
      // Always capitalize the first word
      if (index === 0) {
        return capitalize(word);
      }
      // Don't capitalize if it's a preposition in either language
      if (
        preposicoesSimples.includes(lowerWord) ||
        preposicoesContraidas.includes(lowerWord) ||
        simplePrepositions.includes(lowerWord)
      ) {
        return lowerWord;
      }
      return capitalize(word);
    })
    .join(' ');
}

function formatterKebabCase(value: string) {
  return kebabCase(value);
}

function formatterSnakeCase(value: string) {
  return snakeCase(value);
}

function formatterPascalCase(value: string) {
  return upperFirst(camelCase(value));
}

function formatterTextReverse(value: string) {
  return value.split('').reverse().join('');
}

function formatterURLDecode(value: string) {
  try {
    return decodeURI(value);
  } catch (error) {
    return 'Invalid URL';
  }
}

function formatterURLEncode(value: string) {
  try {
    return encodeURI(value);
  } catch (error) {
    return 'Invalid URL';
  }
}

function formatterUrlDecode2(value: string) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return 'Invalid URL';
  }
}

function formatterBase64Encode(value: string) {
  try {
    return Base64.encode(value);
  } catch (error) {
    return 'Invalid string';
  }
}

function formatterBase64Decode(value: string) {
  try {
    if (!value.trim()) {
      return '';
    }
    // Remove any characters that are not valid base64 characters
    const cleanedValue = value.replace(/[^A-Za-z0-9+/=]/g, '');
    return Base64.decode(cleanedValue);
  } catch (error) {
    return 'Invalid Base64 string';
  }
}
