/* eslint-disable no-unused-expressions */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction } from 'react';
import { TileProps } from '../Tile';

const SQUARE_SIZE = 32;
const GRID_GAP = 0;

export function getTransition(x: number, y: number): string {
  return `transform translate-${x ? 'x' : 'y'}-[${x < 0 ? '-' : ''}${
    (x + y) * (GRID_GAP + SQUARE_SIZE)
  }]`;
}

interface SlideFnProps {
  grid: TileProps[][];
  // score: number;
  // squaresData: TileProps[];
  setGrid: Dispatch<SetStateAction<TileProps[][]>>;
  // setScore: Dispatch<SetStateAction<number>>;
  // setError: Dispatch<SetStateAction<string>>;
  // setPrevSquares: Dispatch<SetStateAction<number[][]>>;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  // setSquaresData: Dispatch<SetStateAction<TileProps[]>>;
}

export function slideUp({
  grid,
  setGrid,
}: SlideFnProps) {
  const newGrid = grid;
  let valid = false;
  for (let j = 0; j < 4; j++) {
    let nextSpot = 0;
    for (let i = 0; i < 4; i++) {
      if (newGrid[i][j].value === 0) {
        continue;
      }

      // let r = 0;
      // for (; r < squaresData.length; r++) {
      //   if (squaresData[r].x === j && squaresData[r].y === i) {
      //     break;
      //   }
      // }

      if (
        nextSpot > 0
        && newGrid[nextSpot - 1][j].value
        && newGrid[nextSpot - 1][j].value === newGrid[i][j].value
      ) {
        // combine
        newGrid[nextSpot - 1][j].value *= 2;
        newGrid[i][j].value = 0;
        newGrid[i][j].transition = getTransition(0, nextSpot - i);
        console.log(newGrid[i][j].transition);

        // assign transition
        // also need to delete the one being combined.
        // now is probably the limit for x y mapping
        // try a hashmap of matrix coordinates to these objects?

        // setScore(score + newSquares[nextSpot - 1][j]);
        !valid && (valid = true);
      } else if (i !== nextSpot) {
        // move to next valid spot
        newGrid[nextSpot][j].value = newGrid[i][j].value;
        newGrid[i][j].value = 0;
        newGrid[i][j].transition = getTransition(0, nextSpot - i);
        console.log(newGrid[i][j].transition);
        nextSpot++;
        !valid && (valid = true);
      } else {
        nextSpot++;
      }
    }
  }

  if (!valid) return;
  setGrid([...newGrid]);
  // setPrevSquares(squares);
  // setSquares(newSquares);
  // spawnSquare(squares, setError, setSquares, setOpen);
}

// export function slideUp({
//   squares,
//   setSquares,
//   setScore,
//   setError,
//   score,
//   setPrevSquares,
//   setOpen,
//   squaresData,
//   setSquaresData,
// }: SlideFnProps) {
//   const newSquares = squares;
//   let valid = false;
//   for (let j = 0; j < 4; j++) {
//     let nextSpot = 0;
//     for (let i = 0; i < 4; i++) {
//       if (newSquares[i][j] === 0) {
//         continue;
//       }

//       // let r = 0;
//       // for (; r < squaresData.length; r++) {
//       //   if (squaresData[r].x === j && squaresData[r].y === i) {
//       //     break;
//       //   }
//       // }

//       if (
//         nextSpot > 0
//         && newSquares[nextSpot - 1][j]
//         && newSquares[nextSpot - 1][j] === newSquares[i][j]
//       ) {
//         // combine
//         newSquares[nextSpot - 1][j] *= 2;
//         newSquares[i][j] = 0;
//         // assign transition
//         // also need to delete the one being combined.
//         // now is probably the limit for x y mapping
//         // try a hashmap of matrix coordinates to these objects?

//         setScore(score + newSquares[nextSpot - 1][j]);
//         !valid && (valid = true);
//       } else if (i !== nextSpot) {
//         // move to next valid spot
//         newSquares[nextSpot][j] = newSquares[i][j];
//         newSquares[i][j] = 0;
//         nextSpot++;
//         !valid && (valid = true);
//       } else {
//         nextSpot++;
//       }
//     }
//   }

//   if (!valid) return;
//   setPrevSquares(squares);
//   setSquares(newSquares);
//   // spawnSquare(squares, setError, setSquares, setOpen);
// }

export function slideDown(
  squares: number[][],
  setSquares: Dispatch<SetStateAction<number[][]>>,
  setScore: Dispatch<SetStateAction<number>>,
  setError: Dispatch<SetStateAction<string>>,
  score: number,
  setPrevSquares: Dispatch<SetStateAction<number[][]>>,
  setOpen: Dispatch<SetStateAction<boolean>>,
) {
  const newSquares = squares;
  let valid = false;
  for (let j = 3; j >= 0; j--) {
    let nextSpot = 3;
    for (let i = 3; i >= 0; i--) {
      if (newSquares[i][j] === 0) {
        continue;
      }

      if (
        nextSpot < 3
        && newSquares[nextSpot + 1][j]
        && newSquares[nextSpot + 1][j] === newSquares[i][j]
      ) {
        newSquares[nextSpot + 1][j] *= 2;
        newSquares[i][j] = 0;
        setScore(score + newSquares[nextSpot + 1][j]);
        !valid && (valid = true);
      } else if (i !== nextSpot) {
        newSquares[nextSpot][j] = newSquares[i][j];
        newSquares[i][j] = 0;
        nextSpot--;
        !valid && (valid = true);
      } else {
        nextSpot--;
      }
    }
  }
  if (!valid) return;
  setPrevSquares(squares);
  setSquares(newSquares);
  // spawnSquare(squares, setError, setSquares, setOpen);
}
