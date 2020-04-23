import { useEffect, useRef } from 'react';

export default function useFirstUpdate(fn, inputs) {
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    fn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
