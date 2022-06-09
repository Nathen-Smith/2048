/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import useDirection from './hooks/useMovement';
import { slideDown, slideUp } from './utils/slideFunctions';
import { DEFAULT_MOVE_TRANSITION, TileProps, Tile } from './Tile';
import initialGrid from './Grid';

function App() {
  const [grid, setGrid] = useState<TileProps[][]>(initialGrid);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);

  const swipeRef = useDirection({
    onMoveDown: () => console.log('down'),
    onMoveUp: () => slideUp({ grid, setGrid }),
    onMoveLeft: () => console.log('i'),
  });

  // we have a matrix of the objects,
  // but what happens when we change the data in the matrix?
  // do we need react component for each square? probably
  // is a matrix even needed?

  // key problem is how to dispatch the transition updates asynchronously.
  // we can have an array(or map) of objects. for handling transitions

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="h-screen" {...swipeRef}>
      <div className="mx-auto bg-stone-400 p-4">
        {grid.map((row) => (
          <div className="flex flex-column justify-center mx-auto gap-4 mt-4">
            {row.map(({ value, transition }) => (
              <div className={`h-32 w-32 flex rounded-xl justify-center 
                items-center text-6xl font-bold text-white bg-gray-200 
                ${value > 0 && transition}`}
              >
                {value > 0 && value}
              </div>
            ))}
          </div>
        ))}
        <Tile />
      </div>
    </div>
  );
}

export default App;
