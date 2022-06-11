import React, { useState } from 'react';
import useDirection from './hooks/useMovement';
import useNewKey from './hooks/useNewKey';

// TODO:
// file reformat
// z index work

function App() {
  function colorMapper(value: number) {
    switch (value) {
      case 0:
        return 'bg-stone-200';
      case 2:
        return 'bg-stone-100 text-stone-500';
      case 4:
        return 'bg-orange-100 text-stone-600';
      case 8:
        return 'bg-orange-300';
      case 16:
        return 'bg-orange-400';
      case 32:
        return 'bg-red-400';
      case 64:
        return 'bg-red-500';
      case 128:
        return 'bg-yellow-200';
      case 256:
        return 'bg-yellow-300';
      case 512:
        return 'bg-yellow-200 text-5xl';
      case 1024:
        return 'bg-yellow-300 text-4xl';
      case 2048:
        return 'bg-yellow-400 text-4xl';
      case 4096:
        return 'bg-teal-500';
      default:
        break;
    }
    return '';
  }
  type TileState = 'NEW' | 'MERGE' | 'NONE'
  const animationMap = {
    NEW: 'tile-new',
    MERGE: 'tile-merged',
    NONE: '',
  };

  interface TileMeta {
    idx: number;
    key: number;
    value: number;
    delete: boolean;
    zIndex: number;
    transition: string;
    animation: string;
  }
  function flatIdx(i:number, j:number) {
    return i * 4 + j;
  }
  function matrixIndices(flatIndex: number) {
    return { i: Math.floor(flatIndex / 4), j: (flatIndex % 4) };
  }
  function getTransition(i: number, j: number): string {
    return `tile-position-${i}-${j}`;
  }

  const keyGen = useNewKey();

  interface NewTileProps {
    i: number;
    j: number;
    value: number;
    state?: TileState;
    key?: number;
  }
  function Tile({
    i, j, value, state, key,
  }: NewTileProps): TileMeta {
    const animationKey = state || 'NONE';
    const newKey = key || (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    return {
      value,
      idx: flatIdx(i, j),
      key: newKey || keyGen(),
      delete: false,
      zIndex: animationKey === 'MERGE' ? 20 : 10,
      transition: getTransition(i, j),
      animation: animationMap[animationKey],
    };
  }

  // eslint-disable-next-line no-unused-vars
  const [tilesArr, setTilesArr] = useState<TileMeta[]>(
    [
      {
        idx: 8,
        key: 87,
        value: 4,
        delete: false,
        zIndex: 10,
        transition: 'tile-position-2-0',
        animation: 'tile-new',
      },
      {
        idx: 0,
        key: -98,
        value: 4,
        delete: false,
        zIndex: 10,
        transition: 'tile-position-0-0',
        animation: 'tile-new',
      },
    ],
  );

  // eslint-disable-next-line no-unused-vars
  function spawnRandTile(newTilesArr : TileMeta[]) {
    const tileIndices = new Set(newTilesArr.map((tile) => tile.idx));
    const openIndices: number[] = [];
    for (let i = 0; i < 16; i += 1) {
      if (!tileIndices.has(i)) {
        openIndices.push(i);
      }
    }
    const newTileIdx = openIndices[Math.floor(openIndices.length
       * Math.random())];
    const { i, j } = matrixIndices(newTileIdx);
    const newTile = Tile({
      i, j, value: 2, state: 'NEW',
    });
    newTilesArr.push(newTile);
  }

  function removedTiles() {
    return tilesArr
      .filter((tile) => !tile.delete)
      .map((tile) => {
        const newTile = { ...tile, zIndex: 10 };
        return newTile;
      });
  }

  type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  function slideHandler(dir : Direction) {
    let validMove = false;
    const newTilesArr = removedTiles();
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
          zIndex: 0,
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
    spawnRandTile(newTilesArr);
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
