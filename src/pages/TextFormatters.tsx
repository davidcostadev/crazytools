import { useState, useRef } from 'react';

import { DefaultLayout } from '../layout/DefaultLayout';

export const TextFormatters = () => {
  const [form, setForm] = useState({
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

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      navigator.clipboard.writeText(inputRef.current.value);
    }
  };

  return (
    <div className="flex space-x-5 items-stretch">
      <label className="font-medium w-36 inline-flex items-center">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-4 py-2 w-80 break-words"
      />
      <div className="rounded bg-neutral-200 font-mono text-base h-auto flex-grow flex items-center px-5 basis-0 break-all">
        {formatter(value)}
      </div>
      {!!value && (
        <button
          type="button"
          onClick={handleCopy}
          className="text-blue-500 underline hover:text-opacity-80 hover:no-underline active:text-opacity-100 active:underline"
        >
          copy to clipboard
        </button>
      )}
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
