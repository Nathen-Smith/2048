import { getInitialTilesArr } from './helpers';

/*
move right

512 256 128 X
2   4   8   X
128 64  32 16
16  8   4   2
*/

const initialTilesFriendlySpawning = getInitialTilesArr([
  {
    i: 0,
    j: 0,
    value: 512
  },
  {
    i: 0,
    j: 1,
    value: 256
  },
  {
    i: 0,
    j: 2,
    value: 128
  },
  {
    i: 1,
    j: 0,
    value: 2
  },
  {
    i: 1,
    j: 1,
    value: 4
  },
  {
    i: 1,
    j: 2,
    value: 8
  },
  {
    i: 2,
    j: 0,
    value: 128
  },
  {
    i: 2,
    j: 1,
    value: 64
  },
  {
    i: 2,
    j: 2,
    value: 32
  },
  {
    i: 2,
    j: 3,
    value: 16
  },
  {
    i: 3,
    j: 0,
    value: 16
  },
  {
    i: 3,
    j: 1,
    value: 8
  },
  {
    i: 3,
    j: 2,
    value: 4
  },
  {
    i: 3,
    j: 3,
    value: 2
  }
]);

export default initialTilesFriendlySpawning;
