/* eslint-disable react/require-default-props */
import React, { useState, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import useMovement from './hooks/useMovement';
import useLocalStorage from './hooks/useLocalStorage';
import {
  TileMeta,
  Tile,
  spawnTileRandom,
  friendlySpawnTile,
  initialTilesRandom,
  getTransition,
  colorMapper,
  removeMarkedTiles
} from './Tile';
import validBoard from './Grid';
import { flatIdx, matrixIndices } from './utils/coordinateUtils';
import ScoreBox from './components/ScoreBox';
import NewGameButton from './components/NewGameButton';
import MyToggle from './components/MyToggle';

interface Props {
  initialTiles?: TileMeta[];
  noSpawnNewTile?: boolean;
}

function App({ initialTiles, noSpawnNewTile }: Props) {
  const [tilesArr, setTilesArr] = useState<TileMeta[]>(
    initialTiles || initialTilesRandom()
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useLocalStorage('bestScore', 0);
  const restartButtonRef = useRef(null);
  const [friendlySpawning, setFriendlySpawning] = useState(true);

  type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  function slideHandler(dir: Direction) {
    let validMove = false;
    const newTilesArr = removeMarkedTiles(tilesArr);
    // mapping of flat index to position in tilesArr
    const flatToArrPosMap = new Map<number, number>();
    newTilesArr.forEach(({ idx }, arrIdx) => {
      flatToArrPosMap.set(idx, arrIdx);
    });

    const reverseIteration = !!(dir === 'DOWN' || dir === 'RIGHT');
    const horizontalMove = !!(dir === 'LEFT' || dir === 'RIGHT');

    interface MoveTileProps {
      i: number;
      j: number;
      currTileArrIdx: number;
      nextSpotIdx: number;
    }

    function moveTile({
      i,
      j,
      currTileArrIdx,
      nextSpotIdx
    }: MoveTileProps): number {
      const currFlatIdx = newTilesArr[currTileArrIdx].idx;

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

      const moveFlatIdx = () =>
        horizontalMove ? flatIdx(i, nextSpotIdx) : flatIdx(nextSpotIdx, j);
      const moveTransition = () =>
        horizontalMove
          ? getTransition(i, nextSpotIdx)
          : getTransition(nextSpotIdx, j);

      let currTile = newTilesArr[currTileArrIdx];
      const mergeTileIdx = flatToArrPosMap.get(mergeFlatIdx());
      let mergeTile = mergeTileIdx !== undefined && newTilesArr[mergeTileIdx];

      if (
        ((!reverseIteration && nextSpotIdx > 0) ||
          (reverseIteration && nextSpotIdx < 3)) &&
        mergeTileIdx !== undefined &&
        mergeTile &&
        mergeTile.value === currTile.value
      ) {
        // merge
        validMove = true;
        mergeTile = {
          ...mergeTile,
          shouldDelete: true,
          zIndex: 10
        };
        currTile = {
          ...currTile,
          zIndex: 20,
          shouldDelete: true,
          idx: mergeFlatIdx(),
          transition: mergeTransition()
        };
        const newTile = Tile({
          i: matrixIndices(mergeTile.idx).i,
          j: matrixIndices(mergeTile.idx).j,
          value: mergeTile.value * 2,
          state: 'MERGE',
          transition: mergeTransition()
        });
        newTilesArr[mergeTileIdx] = mergeTile;
        newTilesArr[currTileArrIdx] = currTile;
        newTilesArr.push(newTile);
        flatToArrPosMap.set(currFlatIdx, newTilesArr.length - 1);
        flatToArrPosMap.delete(currFlatIdx);
        flatToArrPosMap.delete(mergeFlatIdx());
        const currTotalScore = score + newTile.value;
        setScore(currTotalScore);
        if (score + newTile.value > bestScore) {
          setBestScore(currTotalScore);
        }
        return nextSpotIdx;
      }
      if (
        (horizontalMove && j !== nextSpotIdx) ||
        (!horizontalMove && i !== nextSpotIdx)
      ) {
        validMove = true;
        flatToArrPosMap.set(moveFlatIdx(), currTileArrIdx);
        currTile = {
          ...currTile,
          idx: moveFlatIdx(),
          transition: moveTransition()
        };
        newTilesArr[currTileArrIdx] = currTile;
        flatToArrPosMap.delete(currFlatIdx);
        return reverseIteration ? nextSpotIdx - 1 : nextSpotIdx + 1;
      }
      return reverseIteration ? nextSpotIdx - 1 : nextSpotIdx + 1;
    }

    let currTileArrIdx;
    if (dir === 'UP') {
      for (let j = 0; j < 4; j += 1) {
        let nextSpotIdx = 0;
        for (let i = 0; i < 4; i += 1) {
          currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i,
              j,
              currTileArrIdx,
              nextSpotIdx
            });
          }
        }
      }
    } else if (dir === 'DOWN') {
      for (let j = 0; j < 4; j += 1) {
        let nextSpotIdx = 3;
        for (let i = 3; i >= 0; i -= 1) {
          currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i,
              j,
              currTileArrIdx,
              nextSpotIdx
            });
          }
        }
      }
    } else if (dir === 'LEFT') {
      for (let i = 0; i < 4; i += 1) {
        let nextSpotIdx = 0;
        for (let j = 0; j < 4; j += 1) {
          currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i,
              j,
              currTileArrIdx,
              nextSpotIdx
            });
          }
        }
      }
    } else if (dir === 'RIGHT') {
      for (let i = 0; i < 4; i += 1) {
        let nextSpotIdx = 3;
        for (let j = 3; j >= 0; j -= 1) {
          currTileArrIdx = flatToArrPosMap.get(flatIdx(i, j));
          if (currTileArrIdx !== undefined) {
            nextSpotIdx = moveTile({
              i,
              j,
              currTileArrIdx,
              nextSpotIdx
            });
          }
        }
      }
    }
    if (!validMove) {
      return;
    }

    if (noSpawnNewTile === undefined || !noSpawnNewTile) {
      if (friendlySpawning) {
        friendlySpawnTile({ tilesArr: newTilesArr });
      } else {
        spawnTileRandom({ tilesArr: newTilesArr });
      }
    }

    setTilesArr(newTilesArr);
    if (!validBoard(newTilesArr)) {
      setGameOver(true);
    }
  }

  const swipeRef = useMovement({
    onMoveUp: () => slideHandler('UP'),
    onMoveDown: () => slideHandler('DOWN'),
    onMoveLeft: () => slideHandler('LEFT'),
    onMoveRight: () => slideHandler('RIGHT')
  });

  return (
    <div>
      <Transition.Root show={gameOver} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0"
          initialFocus={restartButtonRef}
          onClose={setGameOver}
        >
          <div
            className={`flex items-end justify-center 
           text-center sm:block sm:p-0`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-700 delay-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                className={`fixed inset-0 bg-gray-300 
              bg-opacity-70 transition-opacity cursor-pointer`}
                onClick={() => {
                  setGameOver(false);
                  setTilesArr(initialTilesRandom());
                  setScore(0);
                }}
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
              enter="ease-out duration-700 delay-100"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={`inline-block rounded-lg 
                overflow-hidden transform transition-all 
                -my-16 sm:my-0 text-center`}
              >
                <div className="flex flex-col mt-64">
                  <div
                    className="text-7xl sm:text-8xl mb-10 sm:mb-32
                  font-bold text-stone-600 opacity-100"
                  >
                    Game Over!
                  </div>
                  <NewGameButton
                    setGameOver={setGameOver}
                    setTilesArr={setTilesArr}
                    setScore={setScore}
                    restartButtonRef={restartButtonRef}
                  />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="w-grid-full mx-auto mt-2 px-4 sm:px-0">
        <div className="flex justify-between">
          <div
            className={`text-5xl sm:text-7xl
             font-bold text-stone-600 inline-block`}
          >
            2048
          </div>
          <div className="inline-block text-right">
            <div className="flex space-x-1 float-right">
              <ScoreBox score={score} label="score" />
              <ScoreBox score={bestScore} label="best" />
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <MyToggle
            enabled={friendlySpawning}
            setEnabled={setFriendlySpawning}
          />
          <NewGameButton
            setGameOver={setGameOver}
            setTilesArr={setTilesArr}
            setScore={setScore}
          />
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        <div>
          <div
            className={`absolute transform -translate-x-1/2 left-1/2 
            grid-border rounded-md`}
            style={{ backgroundColor: '#bbada0' }}
          />
        </div>

        <div
          className="grid-center z-10 "
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...swipeRef}
        >
          {tilesArr.map(
            ({ key, value, shouldDelete, zIndex, transition, animation }) => (
              <div
                key={key}
                className={
                  'tile absolute rounded-3px duration-100 transform ' +
                  `${transition}`
                }
                data-testid={shouldDelete ? 'tile-delete' : 'tile'}
              >
                <div
                  className={`tile flex justify-center 
                items-center rounded-3px font-bold
                tile-${value}
                ${colorMapper(value)} z-${zIndex} ${animation}`}
                >
                  {value}
                </div>
              </div>
            )
          )}
        </div>
        <div className="grid-center" style={{ backgroundColor: '#bbada0' }}>
          {[0, 1, 2, 3].map((rowIdx) => (
            <div className="flex justify-center grid-col" key={rowIdx}>
              {[0, 1, 2, 3].map((colIdx) => (
                <div
                  className="tile rounded-3px grid-row"
                  style={{ backgroundColor: 'rgba(238, 228, 218, 0.35)' }}
                  key={rowIdx * 4 + colIdx}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <footer
        className="mx-auto text-sm sm:text-md text-stone-700
        px-4 sm:px-0"
      >
        2048 clone built with React Hooks, TypeScript, and Tailwind CSS. Created
        by Nathen Smith. Source code can be found{' '}
        <a
          href="https://github.com/Nathen-Smith/2048"
          className="underline font-semibold"
        >
          here
        </a>
        .
      </footer>
    </div>
  );
}

export default App;
