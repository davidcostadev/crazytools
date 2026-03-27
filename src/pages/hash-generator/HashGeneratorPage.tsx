import { useEffect, useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

async function generateHash(algorithm: string, text: string): Promise<string> {
  if (!text) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const HashGeneratorPage = () => {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    if (!input) {
      setHashes({ sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }

    Promise.all([
      generateHash('SHA-1', input),
      generateHash('SHA-256', input),
      generateHash('SHA-384', input),
      generateHash('SHA-512', input),
    ]).then(([sha1, sha256, sha384, sha512]) => {
      setHashes({ sha1, sha256, sha384, sha512 });
    });
  }, [input]);

  return (
    <DefaultLayout title="Hash Generator">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        <div className="flex gap-2 flex-row flex-wrap">
          <OutputPlan
            title="SHA-1"
            text={hashes.sha1}
            className="w-full min-h-[5rem] max-w-[30rem]"
          />
          <OutputPlan
            title="SHA-256"
            text={hashes.sha256}
            className="w-full min-h-[5rem] max-w-[30rem]"
          />
          <OutputPlan
            title="SHA-384"
            text={hashes.sha384}
            className="w-full min-h-[5rem] max-w-[30rem]"
          />
          <OutputPlan
            title="SHA-512"
            text={hashes.sha512}
            className="w-full min-h-[5rem] max-w-[30rem]"
          />
        </div>
      </div>
    </DefaultLayout>
  );
};
