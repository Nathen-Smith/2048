import { useState, useCallback } from 'react';

function useForceUpdate() {
  const [value, setValue] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => setValue(value + 1), []);
}

export default useForceUpdate;
