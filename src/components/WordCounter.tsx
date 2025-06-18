import toast from 'react-hot-toast';
import DynamicTextarea from './ui/DynamicTextarea';
import { BaselineContentCopy } from './icons/BaselineContentCopy';

type WordCounterProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const WordCounter = ({ value, onChange }: WordCounterProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex gap-2 md:gap-5 flex-col md:flex-row items-stretch">
      <div className="flex flex-col flex-grow">
        <DynamicTextarea
          value={value}
          onChange={onChange}
          className="border rounded-t px-4 py-2 w-full break-words"
          autoFocus
        />
        <div className="rounded-b bg-neutral-200 font-mono text-base flex-grow flex items-center px-5 py-2  break-all gap-2 justify-between h-[36px]">
          <div className="flex gap-2 text-xs">
            <span>words: {value.split(/\s+/).filter((word) => word).length}</span>
            <span>characters: {value.length}</span>
          </div>
          {!!value && (
            <button
              onClick={handleCopy}
              className="text-black  hover:text-opacity-80 hover:no-underline active:text-opacity-100 active:underline inline-flex gap-2 text-sm items-center"
            >
              <BaselineContentCopy className="w-3 h-3" /> <span>copy</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
