import { useState, useEffect } from 'react';

function getStorageValue(key: any, defaultValue: any) {
  // getting stored value
  const saved = localStorage.getItem(key);
  if (!saved) {
    return defaultValue;
  }
  const initial = JSON.parse(saved);
  return initial;
}

const useLocalStorage = (key: any, defaultValue: any) => {
  const [value, setValue] = useState(() => getStorageValue(key, defaultValue));

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
