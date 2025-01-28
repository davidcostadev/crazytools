import { useState } from 'react';
import { DefaultLayout } from '../layout/DefaultLayout';

export const CountdownPage: React.FC = () => {
  const [time, setTime] = useState<Date | undefined>();

  const handleStart = () => {
    if (!time) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = time.getTime() - now.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      console.log({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <DefaultLayout title="Countdown Page">
      <h1>Countdown by clock</h1>
      <input
        type="timeint_afterpay_core/cartridge/scripts/order/ExpressOrderRequestBuilder.js"
        onChange={(e) => {
          setTime(new Date(e.target.value));
        }}
      />
      <button type="button" onClick={handleStart}>
        Start
      </button>
    </DefaultLayout>
  );
};
