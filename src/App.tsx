import React, { useState } from 'react';
import useDirection from './hooks/useMovement';
import { TileProps } from './Tile';

function App() {
  function flatIdx(i:number, j:number) {
    return i * 4 + j;
  }

  // eslint-disable-next-line no-unused-vars
  const [tilesArr, setTilesArr] = useState<TileProps[]>(
    [
      {
        idx: 4,
        key: 0,
        value: 4,
        delete: false,
        zIndex: 10,
        transition: 'tile-position-1-0',
        animation: 'tile-new',
      },
    ],
  );

  function removedTiles() {
    return tilesArr.filter((tile) => !tile.delete);
  }

  function getTransition(x: number, y: number): string {
    return `tile-position-${x}-${y}`;
  }

  const slideUpMap = () => {
    const newTilesArr = removedTiles();
    // create a mapping of flat index to position in tilesArr
    const idxMap = new Map<number, number>();
    newTilesArr.forEach(({ idx }, arrIdx) => {
      idxMap.set(idx, arrIdx);
    });

    for (let j = 0; j < 4; j += 1) {
      let nextSpotIdx = 0;
      for (let i = 0; i < 4; i += 1) {
        const currTileArrIdx = idxMap.get(flatIdx(i, j));
        let currTile = currTileArrIdx && newTilesArr[currTileArrIdx];
        if (!currTile || !currTileArrIdx) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const mergeTileIdx = idxMap.get(flatIdx(nextSpotIdx - 1, j));
        const mergeTile = mergeTileIdx && newTilesArr[mergeTileIdx];

        if (mergeTile && mergeTile.value === currTile.value) {
          // when we merge, all three squares are there.
          // the new one + the two that made this up.
          // then on next arrow press we remove the ones in the background
          // we can have a queue of elements to remove.
          // now our map is coordinates to an array of tiles.

          // 1. move the current tile to the merging position
          // 2. spawn new tile

          // NEED
          // method for key incrementing
          //
          currTile = {
            ...currTile,
            delete: true,
            idx: flatIdx(nextSpotIdx - 1, j),
            transition: getTransition(nextSpotIdx - 1, j),
          };
        } else if (i !== nextSpotIdx) {
          // move to next valid spot
          idxMap.set(flatIdx(nextSpotIdx, j), currTileArrIdx);
          currTile = {
            ...currTile,
            idx: flatIdx(nextSpotIdx, j),
            transition: getTransition(nextSpotIdx, j),
          };
          newTilesArr[currTileArrIdx] = currTile;
          idxMap.delete(flatIdx(i, j));
        } else {
          nextSpotIdx += 1;
        }
      }
    }
    // console.log(newTilesArr);
    setTilesArr(newTilesArr);
  };

  const swipeRef = useDirection({
    onMoveDown: () => console.log('down'),
    onMoveUp: () => slideUpMap(),
    onMoveLeft: () => console.log('i'),
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="h-screen relative" {...swipeRef}>
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-[470px] h-[470px] z-2"
      >
        {
          tilesArr.map(({
            key,
            value,
            zIndex,
            transition,
            animation,
          }) => (
            <div
              key={key}
              className={`h-[107px] w-[107px] absolute rounded-3px duration-100
              transform ${transition}`}
            >
              <div className={`h-[107px] w-[107px] flex justify-center items-center
                rounded-3px text-6xl font-bold text-white bg-orange-200 z-${zIndex} 
                ${animation}`}
              >
                {value}
              </div>
            </div>
          ))
        }
      </div>
      <div className="z-1 bg-gray-300 flex flex-col space-y-[15px]">
        {[0, 1, 2, 3].map((rowIdx) => (
          <div className="flex space-x-[15px] justify-center" key={rowIdx}>
            {[0, 1, 2, 3].map((colIdx) => (
              <div className="h-[106.25px] w-[106.25px] rounded-3px bg-gray-400" key={rowIdx + colIdx} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
