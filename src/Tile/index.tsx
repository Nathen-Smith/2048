import React, { useState, useEffect } from 'react';

export const DEFAULT_MOVE_TRANSITION = 'translate-x-0';

export function getTransition(x: number, y: number): string {
  return `tile-position-${x}-${y}`;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export function Tile() {
  const [scale, setScale] = useState('scale-110 duration-500');
  useEffect(() => {
    setScale('scale-100');
  }, []);

  const [transition, setTransition] = useState('translate-x-0');

  return (
    <div>
      <button type="button" onClick={() => setTransition(getTransition(1, 0))}>MOVE</button>
      <div className={`h-32 w-32 flex rounded-xl justify-center
        items-center text-6xl font-bold text-white bg-gray-200
        transition-transform duration-150 ease-in-out ${transition}`}
      >
        2
      </div>
      <div className="h-32 w-32 flex rounded-xl justify-center items-center text-6xl font-bold text-white transition-transform duration-150 ease-in-out bg-gray-300 translate-x-[8rem]">
        2
      </div>
      <div className={classNames(
        `h-32 w-32 flex rounded-xl justify-center
        items-center text-6xl font-bold text-white bg-gray-200
        transition-transform duration-150 ease-in-out`,
        scale === 'scale-100' ? transition : scale,
      )}
      >
        2
      </div>
    </div>
  );
}

export interface TileProps {
  idx: number;
  key: number;
  value: number;
  delete: boolean;
  zIndex: number;
  transition: string;
  animation: string;
}

// export function makeTile({
//   value, transition,
// }:TileProps): TileProps {
//   return {
//     value: value || 0,
//     transition: transition || DEFAULT_MOVE_TRANSITION,
//   };
// }

// export function spawnTile(grid: TileProps[][]) {
//   const openSquares = [];
//   for (let i = 0; i < 4; i += 1) {
//     for (let j = 0; j < 4; j += 1) {
//       if (grid && grid[i][j].value === 0) {
//         openSquares.push(i * 4 + j);
//       }
//     }
//   }
//   const newSquareIdx = openSquares[Math.floor(openSquares.length
//     * Math.random())];
//   const newGrid = grid;
//   const i = Math.floor(newSquareIdx / 4);
//   const j = newSquareIdx % 4;
// newGrid[i][j] = Math.floor(Math.random() * 2) === 0
//   ? makeTile({ value: 2 }) : makeTile({ value: 4 });
// setSquares([...newSquares]);
// }
