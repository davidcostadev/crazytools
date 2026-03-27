import { useState } from 'react';
import { OutputPlan } from '../../components/ui/OutputPlan';
import { WordCounter } from '../../components/WordCounter';
import { DefaultLayout } from '../../layout/DefaultLayout';

function decodeJwtPart(part: string): string {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.stringify(JSON.parse(atob(base64)), null, 2);
}

function getExpiration(payload: string): { text: string; expired: boolean } | null {
  try {
    const parsed = JSON.parse(payload);
    if (!parsed.exp) return null;
    const expDate = new Date(parsed.exp * 1000);
    const now = new Date();
    const expired = expDate < now;
    return {
      text: `${expDate.toLocaleString()} (${expired ? 'EXPIRED' : 'valid'})`,
      expired,
    };
  } catch {
    return null;
  }
}

export const JwtDecoderPage = () => {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value.trim();
    setInput(event.target.value);
    setError('');
    setHeader('');
    setPayload('');

    if (!value) return;

    try {
      const parts = value.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT: must have 3 parts separated by dots');
        return;
      }
      setHeader(decodeJwtPart(parts[0]));
      setPayload(decodeJwtPart(parts[1]));
    } catch {
      setError('Invalid JWT token');
    }
  };

  const expiration = payload ? getExpiration(payload) : null;

  return (
    <DefaultLayout title="JWT Decoder">
      <div className="space-y-5">
        <WordCounter value={input} onChange={handleChange} />
        {error && <p className="text-red-500 text-sm font-mono">{error}</p>}
        {expiration && (
          <div
            className={`text-sm font-mono px-3 py-2 rounded ${
              expiration.expired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            Expiration: {expiration.text}
          </div>
        )}
        <div className="flex gap-2 flex-col md:flex-row">
          <OutputPlan title="Header" text={header} className="flex-1" />
          <OutputPlan title="Payload" text={payload} className="flex-1" />
        </div>
      </div>
    </DefaultLayout>
  );
};
