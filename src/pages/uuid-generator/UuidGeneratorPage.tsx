import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { DefaultLayout } from '../../layout/DefaultLayout';
import { BaselineContentCopy } from '../../components/icons/BaselineContentCopy';

export const UuidGeneratorPage = () => {
  const [uuids, setUuids] = useState<string[]>([uuidv4()]);
  const [quantity, setQuantity] = useState(1);

  const handleGenerate = () => {
    const newUuids = Array.from({ length: quantity }, () => uuidv4());
    setUuids(newUuids);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    toast.success('Copied all to clipboard');
  };

  return (
    <DefaultLayout title="UUID Generator">
      <div className="space-y-5">
        <div className="flex gap-2 items-center flex-wrap">
          <label className="text-sm">Quantity:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(100, Math.max(1, Number(e.target.value))))}
            className="border rounded px-3 py-2 w-20 text-sm"
          />
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Generate
          </button>
          {uuids.length > 1 && (
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600 text-sm"
            >
              Copy All
            </button>
          )}
        </div>
        <div className="space-y-1">
          {uuids.map((uuid, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-neutral-200 rounded px-4 py-2 font-mono text-sm"
            >
              <span className="flex-1 break-all">{uuid}</span>
              <button
                onClick={() => handleCopy(uuid)}
                className="text-black hover:text-opacity-80 active:text-opacity-100 inline-flex gap-1 items-center shrink-0"
              >
                <BaselineContentCopy className="w-3 h-3" />
                <span className="text-xs">copy</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
};
