import { flatIdx, matrixIndices } from '../utils/coordinateUtils';
import { getTransition } from './classHelpers';

export interface TileMeta {
  idx: number;
  key: number;
  value: number;
  shouldDelete: boolean;
  zIndex: number;
  transition: string;
  animation: string;
}

export type TileState = 'NEW' | 'MERGE' | 'NONE'
export const animationMap = {
  NEW: 'tile-new',
  MERGE: 'tile-merged',
  NONE: '',
};

interface NewTileProps {
  i: number;
  j: number;
  value: number;
  state?: TileState;
  key?: number;
  transition?: string;
}
export function Tile({
  i, j, value, state, key, transition,
}: NewTileProps): TileMeta {
  const animationKey = state || 'NONE';
  const newKey = key || (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  const newTransition = transition || getTransition(i, j);
  return {
    value,
    idx: flatIdx(i, j),
    key: newKey,
    shouldDelete: false,
    zIndex: animationKey === 'MERGE' ? 30 : 10,
    transition: newTransition,
    animation: animationMap[animationKey],
  };
}

interface SpawnTileRandomProps {
  tilesArr: TileMeta[];
}
export function spawnTileRandom({
  tilesArr,
} : SpawnTileRandomProps) {
  const tileIndices = new Set(tilesArr.map((tile) => tile.idx));
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
  tilesArr.push(newTile);
}

export function friendlySpawnTile({
  tilesArr,
} : SpawnTileRandomProps) {
  // tilesArr can have merging tiles and hidden ones
  let i;
  let j;
  const grid : number[][] = [];
  const gridRow = [0, 0, 0, 0];
  for (let idx = 0; idx < 4; idx += 1) {
    grid.push([...gridRow]);
  }
  let currTile;
  let numTiles = 0;
  for (let tilesIdx = 0; tilesIdx < tilesArr.length; tilesIdx += 1) {
    currTile = tilesArr[tilesIdx];
    if (!currTile.shouldDelete) {
      ({ i, j } = matrixIndices(currTile.idx));
      grid[i][j] = currTile.value;
      numTiles += 1;
    }
  }
  function preventBadSpawn() {
    let currNumTiles = 0;
    let openSpotIdx = 0;
    const blockedSpot = false;
    for (let rowIdx = 0; rowIdx < 4; rowIdx += 1) {
      for (let colIdx = 0; colIdx < 4; colIdx += 1) {
        if (grid[rowIdx][colIdx] > 0) {
          currNumTiles += 1;
        } else {
          if (colIdx > numTiles) {
            // more than 1 open tile
            break;
          }
          openSpotIdx = colIdx;
        }
      }
      if (currNumTiles === 3
        && ((openSpotIdx > 0 && grid[rowIdx][openSpotIdx - 1] > 2)
        || (openSpotIdx < 3 && grid[rowIdx][openSpotIdx + 1] > 2))) {
        // forbidden spot
        grid[rowIdx][openSpotIdx] = -1;
        break;
      }
      currNumTiles = 0;
      openSpotIdx = 0;
    }
    if (!blockedSpot) {
      for (let colIdx = 0; colIdx < 4; colIdx += 1) {
        for (let rowIdx = 0; rowIdx < 4; rowIdx += 1) {
          if (grid[rowIdx][colIdx] > 0) {
            currNumTiles += 1;
          } else {
            if (rowIdx > currNumTiles) {
              // more than 1 open tile
              break;
            }
            openSpotIdx = rowIdx;
          }
        }
        if (currNumTiles === 3
          && ((openSpotIdx > 0 && grid[openSpotIdx - 1][colIdx] > 2)
          || (openSpotIdx < 3 && grid[openSpotIdx + 1][colIdx] > 2))) {
          // forbidden spot
          grid[openSpotIdx][colIdx] = -1;
          break;
        }
        currNumTiles = 0;
        openSpotIdx = 0;
      }
    }
  }
  // can only smart spawn if we have more than one option
  if (numTiles < 15) {
    preventBadSpawn();
  }

  const openIndices: number[] = [];
  for (let rowIdx = 0; rowIdx < 4; rowIdx += 1) {
    for (let colIdx = 0; colIdx < 4; colIdx += 1) {
      if (grid[rowIdx][colIdx] === 0) {
        openIndices.push(flatIdx(rowIdx, colIdx));
      }
    }
  }
  const newTileIdx = openIndices[Math.floor(openIndices.length
     * Math.random())];
  ({ i, j } = matrixIndices(newTileIdx));
  const newTile = Tile({
    i, j, value: 2, state: 'NEW',
  });
  tilesArr.push(newTile);
}
