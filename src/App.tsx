/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  FastForwardIcon,
} from '@heroicons/react/outline';
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

  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen relative">
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          // initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className={`flex items-end justify-center 
          min-h-screen text-center sm:block sm:p-0`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className={`fixed inset-0 bg-gray-500 
              bg-opacity-75 transition-opacity cursor-pointer`}
              />
            </Transition.Child>

            {/* This element is to trick the browser
             into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                onClick={() => {
                  setOpen(false);
                  // reset();
                }}
                className={`inline-block bg-white rounded-lg text-left 
                overflow-hidden shadow-xl transform transition-all 
                sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
                role="button"

              >
                <div className={`bg-white px-4 pt-5 pb-4 sm:p-6 
                sm:pb-4 justify-center`}
                >
                  <div className={`mx-auto justify-center 
                  flex flex-col text-center mt-3 sm:mt-0 sm:text-left`}
                  >
                    2048 New game
                    {/* {error && 'Restart'} */}
                    <FastForwardIcon className="w-10 cursor-pointer" />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div
        className="absolute left-1/2 transform -translate-x-1/2 grid z-10 "
        {...swipeRef}
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
              className={`tile absolute rounded-3px duration-100
              transform ${transition}`}
            >
              <div className={`tile flex justify-center 
                items-center rounded-3px font-bold
                text-white tile-${value}
                ${colorMapper(value)} z-${zIndex} ${animation}`}
              >
                {value}
              </div>
            </div>
          ))
        }
      </div>
      <div className="z-1 bg-gray-300 flex flex-col">
        {[0, 1, 2, 3].map((rowIdx) => (
          <div
            className={`flex justify-center ${rowIdx && 'grid-col'}`}
            key={rowIdx}
          >
            {[0, 1, 2, 3].map((colIdx) => (
              <div
                className={`tile rounded-3px bg-gray-400
                 ${colIdx && 'grid-row'}`}
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
