/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';
import useDirection from './hooks/useMovement';
import useForceUpdate from './hooks/useForceUpdate';
import { slideDown, slideUp } from './utils/slideFunctions';
import { DEFAULT_MOVE_TRANSITION, TileProps, Tile } from './Tile';
import initialGrid from './Grid';

function App() {
  const [grid, setGrid] = useState<TileProps[][]>(initialGrid);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);

  function flatIdx(i:number, j:number) {
    return i * 4 + j;
  }

  const [tilesMap, setTilesMap] = useState(new Map<number, TileProps>([[4,
    { value: 4, transition: 'tile-position-2-0' }]]));
  const updateMap = (k:number, v:TileProps) => {
    setTilesMap(tilesMap.set(k, v));
  };
  const [update, setUpdate] = useState(false);

  const tiles: TileProps[] = [];
  tilesMap.forEach((tile, _) => {
    tiles.push(tile);
  });

  interface SlideFnProps {
    map: Map<number, TileProps>;
    // updateMap: (k: number, v: TileProps) => void;
  }
  function getTransition(x: number, y: number): string {
    return `tile-position-${x}-${y}`;
  }

  const forceUpdate = useForceUpdate();
  function slideUpMap() {
    // const newTilesMap = tilesMap;
    const validMove = false;
    for (let j = 0; j < 4; j += 1) {
      let nextSpotIdx = 0;
      for (let i = 0; i < 4; i += 1) {
        const currTile = tilesMap.get(flatIdx(i, j));
        if (!currTile) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const nextSpot = tilesMap.get(flatIdx(nextSpotIdx - 1, j));

        if (nextSpot && nextSpot.value === currTile.value) {
          // combine
          // newGrid[nextSpot - 1][j].value *= 2;
          // newGrid[i][j].value = 0;
          // newGrid[i][j].transition = getTransition(0, nextSpot - i);

          // assign transition
          // also need to delete the one being combined.
          // now is probably the limit for x y mapping
          // try a hashmap of matrix coordinates to these objects?

          // setScore(score + newSquares[nextSpot - 1][j]);
          // !valid && (valid = true);
        } else if (i !== nextSpotIdx) {
          // move to next valid spot
          tilesMap.delete(flatIdx(i, j));
          tilesMap.set(
            flatIdx(nextSpotIdx, j),
            {
              value: currTile.value,
              transition: getTransition(nextSpotIdx, j),
            },
          );
        } else {
          nextSpotIdx += 1;
        }
      }
    }
    setTilesMap(tilesMap);
    forceUpdate();
  }

  const swipeRef = useDirection({
    onMoveDown: () => console.log('down'),
    onMoveUp: () => slideUpMap(),
    onMoveLeft: () => console.log('i'),
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="h-screen" {...swipeRef}>
      {
        tiles.map(({ value, transition }) => (
          <div className={`h-[107px] w-[107px] absolute rounded-3px duration-100
            transform ${transition}`}
          >
            <div className="h-[107px] w-[107px] flex justify-center items-center
              rounded-3px text-6xl font-bold text-white bg-orange-200 z-10"
            >
              {value}
            </div>
          </div>
        ))
      }
      <div className="z-1 bg-gray-300">
        {[0, 1, 2, 3].map((rowIdx) => (
          <div className="grid-row" key={rowIdx}>
            {[0, 1, 2, 3].map((colIdx) => (
              <div className="grid-cell bg-gray-400" />
            ))}
          </div>
        ))}
      </div>

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
