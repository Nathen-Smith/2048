import React, { useState } from 'react';
import useDirection from './hooks/useMovement';
import {
  TileMeta,
  Tile,
  spawnTileRandom,
  initialTilesRandom,
  flatIdx,
  getTransition,
  matrixIndices,
  colorMapper,
  removeMarkedTiles,
} from './Tile';

function App() {
  const [tilesArr, setTilesArr] = useState<TileMeta[]>(initialTilesRandom);

  type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  function slideHandler(dir : Direction) {
    let validMove = false;
    const newTilesArr = removeMarkedTiles(tilesArr);
    // mapping of flat index to position in tilesArr
    const flatToArrPosMap = new Map<number, number>();
    newTilesArr.forEach(({ idx }, arrIdx) => {
      flatToArrPosMap.set(idx, arrIdx);
    });

    interface MoveTileProps {
      i: number;
      j: number;
      currTileArrIdx: number;
      nextSpotIdx: number;
    }

    function moveTile({
      i, j, currTileArrIdx, nextSpotIdx,
    }: MoveTileProps):number {
      const currFlatIdx = newTilesArr[currTileArrIdx].idx;
      const reverseIteration = !!(dir === 'DOWN' || dir === 'RIGHT');
      const horizontalMove = !!(dir === 'LEFT' || dir === 'RIGHT');

      // default up
      let mergeFlatIdx = () => flatIdx(nextSpotIdx - 1, j);
      let mergeTransition = () => getTransition(nextSpotIdx - 1, j);
      if (dir === 'DOWN') {
        mergeFlatIdx = () => flatIdx(nextSpotIdx + 1, j);
        mergeTransition = () => getTransition(nextSpotIdx + 1, j);
      } else if (dir === 'LEFT') {
        mergeFlatIdx = () => flatIdx(i, nextSpotIdx - 1);
        mergeTransition = () => getTransition(i, nextSpotIdx - 1);
      } else if (dir === 'RIGHT') {
        mergeFlatIdx = () => flatIdx(i, nextSpotIdx + 1);
        mergeTransition = () => getTransition(i, nextSpotIdx + 1);
      }

      const moveFlatIdx = () => (horizontalMove
        ? flatIdx(i, nextSpotIdx)
        : flatIdx(nextSpotIdx, j));
      const moveTransition = () => (horizontalMove
        ? getTransition(i, nextSpotIdx)
        : getTransition(nextSpotIdx, j));

      let currTile = newTilesArr[currTileArrIdx];
      const mergeTileIdx = flatToArrPosMap.get(mergeFlatIdx());
      let mergeTile = (mergeTileIdx !== undefined) && newTilesArr[mergeTileIdx];

      if (mergeTileIdx !== undefined && mergeTile
        && mergeTile.value === currTile.value) {
        // merge
        validMove = true;
        mergeTile = {
          ...mergeTile,
          delete: true,
          zIndex: 10,
        };
        currTile = {
          ...currTile,
          delete: true,
          idx: mergeFlatIdx(),
          transition: mergeTransition(),
        };
        const newTile = Tile({
          i: matrixIndices(mergeFlatIdx()).i,
          j: matrixIndices(mergeFlatIdx()).j,
          value: mergeTile.value * 2,
          state: 'MERGE',
        });
        newTilesArr[mergeTileIdx] = mergeTile;
        newTilesArr[currTileArrIdx] = currTile;
        newTilesArr.push(newTile);
        flatToArrPosMap.set(currFlatIdx, newTilesArr.length - 1);
        flatToArrPosMap.delete(currFlatIdx);
        flatToArrPosMap.delete(mergeFlatIdx());
        return nextSpotIdx;
      } if ((horizontalMove && (j !== nextSpotIdx))
      || (!horizontalMove && (i !== nextSpotIdx))) {
        // move to next valid spot
        validMove = true;
        flatToArrPosMap.set(moveFlatIdx(), currTileArrIdx);
        currTile = {
          ...currTile,
          idx: moveFlatIdx(),
          transition: moveTransition(),
        };
        newTilesArr[currTileArrIdx] = currTile;
        flatToArrPosMap.delete(currFlatIdx);
        return reverseIteration ? nextSpotIdx - 1 : nextSpotIdx + 1;
      }
      return reverseIteration ? nextSpotIdx - 1 : nextSpotIdx + 1;
    }

    if (dir === 'UP') {
      for (let j = 0; j < 4; j += 1) {
        let nextSpotIdx = 0;
        for (let i = 0; i < 4; i += 1) {
          const currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i, j, currTileArrIdx, nextSpotIdx,
            });
          }
        }
      }
    } else if (dir === 'DOWN') {
      for (let j = 3; j >= 0; j -= 1) {
        let nextSpotIdx = 3;
        for (let i = 3; i >= 0; i -= 1) {
          const currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i, j, currTileArrIdx, nextSpotIdx,
            });
          }
        }
      }
    } else if (dir === 'LEFT') {
      for (let i = 0; i < 4; i += 1) {
        let nextSpotIdx = 0;
        for (let j = 0; j < 4; j += 1) {
          const currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i, j, currTileArrIdx, nextSpotIdx,
            });
          }
        }
      }
    } else if (dir === 'RIGHT') {
      for (let i = 3; i >= 0; i -= 1) {
        let nextSpotIdx = 3;
        for (let j = 3; j >= 0; j -= 1) {
          const currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i, j, currTileArrIdx, nextSpotIdx,
            });
          }
        }
      }
    }
    if (!validMove) {
      return;
    }
    spawnTileRandom(newTilesArr);
    setTilesArr(newTilesArr);
  }

  const swipeRef = useDirection({
    onMoveUp: () => slideHandler('UP'),
    onMoveDown: () => slideHandler('DOWN'),
    onMoveLeft: () => slideHandler('LEFT'),
    onMoveRight: () => slideHandler('RIGHT'),
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="h-screen relative" {...swipeRef}>
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 w-[470px] 
        h-[470px] z-2`}
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
              <div className={`h-[107px] w-[107px] flex justify-center 
                items-center rounded-3px text-6xl font-bold text-white 
                ${colorMapper(value)} z-${zIndex} ${animation}`}
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
              <div
                className="h-[106.25px] w-[106.25px] rounded-3px bg-gray-400"
                key={rowIdx * 4 + colIdx}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
