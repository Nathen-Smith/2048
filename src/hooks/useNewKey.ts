import { useState } from 'react';

function useNewKey() {
  const [key, setKey] = useState(0);
  return () => {
    setKey(key + 1);
    return key;
  };
}

export default useNewKey;
