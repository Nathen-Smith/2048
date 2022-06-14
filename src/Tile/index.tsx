export function colorMapper(value: number) {
  switch (value) {
    case 2:
      return 'bg-stone-100 text-stone-500';
    case 4:
      return 'bg-orange-100 text-stone-600';
    case 8:
      return 'bg-orange-300 text-white';
    case 16:
      return 'bg-orange-400 text-white';
    case 32:
      return 'bg-red-400 text-white';
    case 64:
      return 'bg-red-500 text-white';
    case 128:
      return 'bg-yellow-250 text-white shadow-lg shadow-yellow-250/50';
    case 256:
      return 'bg-amber-250 text-white shadow-lg shadow-amber-250/50';
    case 512:
      return 'bg-amber-300 text-white shadow-lg shadow-amber-300/50';
    case 1024:
      return 'bg-yellow-300 text-white shadow-lg shadow-yellow-300/50';
    case 2048:
      return 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/50';
    case 4096:
      return 'bg-teal-500 text-white shadow-lg shadow-teal-500/50';
    default:
      break;
  }
  return '';
}

export type TileState = 'NEW' | 'MERGE' | 'NONE'
export const animationMap = {
  NEW: 'tile-new',
  MERGE: 'tile-merged',
  NONE: '',
};

export interface TileMeta {
  idx: number;
  key: number;
  value: number;
  shouldDelete: boolean;
  zIndex: number;
  transition: string;
  animation: string;
}
export function flatIdx(i:number, j:number) {
  return i * 4 + j;
}
export function matrixIndices(flatIndex: number) {
  return { i: Math.floor(flatIndex / 4), j: (flatIndex % 4) };
}
export function getTransition(i: number, j: number): string {
  return `tile-position-${i}-${j}`;
}

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
    zIndex: animationKey === 'MERGE' ? 20 : 10,
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

export function removeMarkedTiles(tilesArr: TileMeta[]) {
  return tilesArr
    .filter((tile) => !tile.shouldDelete)
    .map((tile) => {
      const newTile = { ...tile, zIndex: 10, animation: '' };
      return newTile;
    });
}

export function initialTilesRandom() {
  const initialTiles: TileMeta[] = [];
  spawnTileRandom({ tilesArr: initialTiles });
  spawnTileRandom({ tilesArr: initialTiles });
  return initialTiles;
}

interface ValidGridProps {
  value: number;
  zIndex: number;
}
export function validBoard(tilesArr: TileMeta[]) {
  if (tilesArr.length < 16) {
    return true;
  }

  const grid: ValidGridProps[][] = [];
  const gridRow: ValidGridProps[] = [
    { value: 0, zIndex: 0 },
    { value: 0, zIndex: 0 },
    { value: 0, zIndex: 0 },
    { value: 0, zIndex: 0 },
  ];
  for (let m = 0; m < 4; m += 1) {
    grid.push([...gridRow]);
  }

  let row = 0;
  let col = 0;
  let matrixCoords;
  let currTile;
  for (let tilesIdx = 0; tilesIdx < tilesArr.length; tilesIdx += 1) {
    currTile = tilesArr[tilesIdx];
    matrixCoords = matrixIndices(currTile.idx);
    row = matrixCoords.i;
    col = matrixCoords.j;
    if (grid[row][col].zIndex < currTile.zIndex) {
      grid[row][col] = { value: currTile.value, zIndex: currTile.zIndex };
    }
  }
  let currTileVal;
  for (let m = 0; m < 4; m += 1) {
    for (let n = 0; n < 4; n += 1) {
      currTileVal = grid[m][n].value;
      if (currTileVal === 0) {
        return true;
      }
      if (
        (m > 0 && currTileVal === grid[m - 1][n].value)
        || (m < 3 && currTileVal === grid[m + 1][n].value)
        || (n > 0 && currTileVal === grid[m][n - 1].value)
        || (n < 3 && currTileVal === grid[m][n + 1].value)
      ) {
        return true;
      }
    }
  }
  return false;
}

interface SmartSpawnTileRandomProps {
  tilesArr: TileMeta[];
}
export function smartSpawnTileRandom({
  tilesArr,
} : SmartSpawnTileRandomProps) {
  // find the areas with the lowest row and column score
  // what happens when the forbidden move is made?
  /*
    1024 512 256 128
    8   16  32  64
    4   2   x   x
    x   x   x   x

    can't spawn in column index 0

    1024 512 256 128
    8   16  32  64
    4   2   x   x
    x   x   x   x
  */

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
