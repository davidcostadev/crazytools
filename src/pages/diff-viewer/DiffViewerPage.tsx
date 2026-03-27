import { diffLines } from 'diff';
import { useMemo, useState } from 'react';
import { DefaultLayout } from '../../layout/DefaultLayout';
import DynamicTextarea from '../../components/ui/DynamicTextarea';

export const DiffViewerPage = () => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');

  const changes = useMemo(() => {
    if (!left && !right) return [];
    return diffLines(left, right);
  }, [left, right]);

  const hasChanges = changes.some((c) => c.added || c.removed);

  return (
    <DefaultLayout title="Diff Viewer">
      <div className="space-y-5">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="flex-1">
            <label className="text-sm text-neutral-500 mb-1 block">Original</label>
            <DynamicTextarea
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="border rounded px-4 py-2 w-full font-mono text-sm"
              placeholder="Original text..."
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-neutral-500 mb-1 block">Modified</label>
            <DynamicTextarea
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="border rounded px-4 py-2 w-full font-mono text-sm"
              placeholder="Modified text..."
            />
          </div>
        </div>
        {(left || right) && (
          <div>
            <h3 className="text-sm font-medium mb-2">
              {hasChanges ? 'Differences' : 'No differences'}
            </h3>
            <div className="border rounded font-mono text-sm overflow-auto">
              {changes.map((change, index) => (
                <div
                  key={index}
                  className={`px-4 py-1 whitespace-pre-wrap ${
                    change.added
                      ? 'bg-green-100 text-green-800'
                      : change.removed
                        ? 'bg-red-100 text-red-800'
                        : 'bg-white'
                  }`}
                >
                  <span className="select-none text-neutral-400 mr-2">
                    {change.added ? '+' : change.removed ? '-' : ' '}
                  </span>
                  {change.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};
