import toast from 'react-hot-toast';
import { classNames } from '../../utils/classNames';
import { BaselineContentCopy } from '../icons/BaselineContentCopy';

type OutputPlanProps = {
  title: string;
  text: string;
  className?: string;
};

export const OutputPlan = ({ title, text, className }: OutputPlanProps) => {
  const handleCopy = () => {
    toast.success('Copied to clipboard');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={classNames('w-full flex flex-col', className)}>
      <div className="bg-neutral-400 w-full rounded-t px-2 py-0.5 flex items-center justify-between h-6">
        <h3 className="text-white/80 text-sm">{title}</h3>
        {!!text && (
          <button
            onClick={handleCopy}
            className="text-white  hover:text-opacity-80 hover:no-underline active:text-opacity-100 active:underline inline-flex gap-2 text-sm items-center"
          >
            <BaselineContentCopy className="w-3 h-3" /> <span>copy</span>
          </button>
        )}
      </div>
      <div className="rounded-b bg-neutral-200 font-mono text-base h-auto flex px-4 basis-0 py-2 break-all flex-grow min-h-[2rem]">
        {text}
      </div>
    </div>
  );
};
