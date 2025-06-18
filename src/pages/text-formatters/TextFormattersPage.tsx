import { useState } from 'react';
import { Base64 } from 'js-base64';

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

function formatterPascalCase(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9 ]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
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
