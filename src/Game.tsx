import React, { useState } from 'react';
import useDirection from './hooks/useMovement';
import useForceUpdate from './hooks/useForceUpdate';
import { TileProps } from './Tile';

function Game() {
  function flatIdx(i:number, j:number) {
    return i * 4 + j;
  }

  // lets say we have a map of number to array of tileProps
  // the purpose of the array is really for merging and those transitions
  // lets say we have two 2's merging into a 4
  // the 2s move
  // the 4 appears with merge animation
  // all three are on the same square
  // all 3 are still rendered
  // but we need to clean this up next handler.
  // we have a queue of keys to search for and delete
  // alternatively can have a map of flattened index to the highest number of the 3 on the square
  // on a new key press we delete from our flattened index in the tilesMap
  // we can guarantee there will be one remaining.

  // array representation is probably faster at this point.
  // we can add a property to mark for deletion
  // the movement logic would just loop again

  const [tilesMap, setTilesMap] = useState(new Map<number, TileProps[]>([[4,
    [
      {
        value: 4,
        key: 0,
        zIndex: 10,
        transition: 'tile-position-2-0',
        animation: 'tile-new',
      },
    ],
  ]]));

  const tilesToRemove = new Map<number, number>();
  function cleanBoard() {
    tilesToRemove.forEach((index, value)=> {
      const 
    })
  }

  const tiles: TileProps[] = [];
  tilesMap.forEach((tileArr) => {
    tileArr.forEach((tile) => {
      tiles.push(tile);
      }
    )
  });

  function getTransition(x: number, y: number): string {
    return `tile-position-${x}-${y}`;
  }

  const forceUpdate = useForceUpdate();

  function slideUpMap() {
    // const newTilesMap = tilesMap;
    // const validMove = false;
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
          // the one being merged into gets the animation...
          // merge edge case

          // when we merge, all three squares are there.
          // the new one + the two that made this up.
          // then on next arrow press we remove the ones in the background
          // we can have a queue of elements to remove.
          // now our map is coordinates to an array of tiles.
        } else if (i !== nextSpotIdx) {
          // move to next valid spot
          tilesMap.delete(flatIdx(i, j));
          tilesMap.set(
            flatIdx(nextSpotIdx, j),
            {
              ...currTile,
              zIndex: 10,
              transition: getTransition(nextSpotIdx, j),
              animation: '',
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
    <div className="h-screen relative" {...swipeRef}>
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-[470px] h-[470px] z-2"
      >
        {
          tiles.map(({
            value,
            key,
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

export default Game;
