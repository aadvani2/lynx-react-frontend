import { useState, useEffect } from 'react';

export const useSelectedRequestId = (): number | null => {
  const [requestId, setRequestId] = useState<number | null>(null);

  useEffect(() => {
    const storedId = sessionStorage.getItem('selectedRequestId');
    if (storedId) {
      const parsedId = parseInt(storedId);
      if (!isNaN(parsedId)) {
        setRequestId(parsedId);
      }
    }
  }, []);

  return requestId;
};
