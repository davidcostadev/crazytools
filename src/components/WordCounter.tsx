import { useState } from 'react';
import toast from 'react-hot-toast';
import DynamicTextarea from './ui/DynamicTextarea';

export const WordCounter = () => {
  const label = 'Word Counter';
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex gap-2 md:gap-5 flex-col md:flex-row items-stretch">
      <label className="font-medium w-36 inline-flex items-center">{label}</label>
      <div className="flex flex-col flex-grow">
        <DynamicTextarea
          value={value}
          onChange={handleChange}
          className="border rounded-t px-4 py-2 w-full break-words"
        />
        <div className="rounded-b bg-neutral-200 font-mono text-base h-auto flex-grow flex items-center px-5 py-2 basis-0 break-all gap-2">
          <span>words: {value.split(/\s+/).filter((word) => word).length}</span>
          <span>characters: {value.length}</span>
        </div>
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
