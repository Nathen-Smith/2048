import React from 'react';
import { Switch } from '@headlessui/react';

interface MyToggleProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}
function MyToggle({ enabled, setEnabled }: MyToggleProps) {
  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mr-1 font-bold text-md text-stone-500">
          Friendly Spawning
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? 'bg-stone-600' : 'bg-stone-300'
          } relative inline-flex h-[31px] w-[51px] sm:h-[32px] sm:w-[56px] 
            shrink-0 cursor-pointer rounded-full border-[1.5px] sm:border-2 
            border-transparent transition-colors duration-200 ease-in-out 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white 
            focus-visible:ring-opacity-75`}
        >
          <span
            className={`${
              enabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
            } pointer-events-none inline-block h-[28px] w-[28px] transform
              rounded-full bg-white shadow-lg ring-0 transition 
              duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}

export default MyToggle;
