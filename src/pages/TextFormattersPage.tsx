import { useState, useRef } from 'react';

import { DefaultLayout } from '../layout/DefaultLayout';
import { WordCounter } from '../components/WordCounter';
import { camelCase } from 'lodash';
import { OutputPlan } from '../components/ui/OutputPlan';

export const TextFormattersPage = () => {
  const [form, setForm] = useState({
    toCamelCase: '',
    toKebabCase: '',
    toSnakeCase: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DefaultLayout title="Text Formatters">
      <div className="space-y-5">
        <Group
          name="toCamelCase"
          label="To Camel Case"
          value={form.toCamelCase}
          formatter={camelCase}
          onChange={handleChange}
        />
        <Group
          name="toKebabCase"
          label="To Kebab Case"
          value={form.toKebabCase}
          formatter={formatterKebabCase}
          onChange={handleChange}
        />
        <Group
          name="toSnakeCase"
          label="To Snake Case"
          value={form.toSnakeCase}
          formatter={formatterSnakeCase}
          onChange={handleChange}
        />
        <WordCounter />
      </div>
    </DefaultLayout>
  );
};

type GroupProps = {
  name: string;
  label: string;
  value: string;
  formatter: (value: string) => string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const Group = ({ name, label, value, formatter, onChange }: GroupProps) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="flex gap-2 md:gap-5 items-stretch flex-col md:flex-row">
      <label className="font-medium w-full md:w-36 inline-flex items-center">{label}</label>
      <textarea
        ref={inputRef}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-4 py-2 w-full md:w-80 break-words"
      />
      <OutputPlan text={formatter(value)} />
    </div>
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
