export function colorMapper(value: number) {
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
  delete: boolean;
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
}
export function Tile({
  i, j, value, state, key,
}: NewTileProps): TileMeta {
  const animationKey = state || 'NONE';
  const newKey = key || (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  return {
    value,
    idx: flatIdx(i, j),
    key: newKey,
    delete: false,
    zIndex: animationKey === 'MERGE' ? 20 : 10,
    transition: getTransition(i, j),
    animation: animationMap[animationKey],
  };
}

export function spawnTileRandom(newTilesArr : TileMeta[]) {
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

export function removeMarkedTiles(tilesArr: TileMeta[]) {
  return tilesArr
    .filter((tile) => !tile.delete)
    .map((tile) => {
      const newTile = { ...tile, zIndex: 10 };
      return newTile;
    });
}

export const initialTilesRandom: TileMeta[] = [
  Tile({
    i: 0, j: 0, value: 2, state: 'NEW', key: 1,
  }),
  Tile({
    i: 0, j: 1, value: 2, state: 'NEW', key: 4,
  }),
  Tile({
    i: 0, j: 2, value: 2, state: 'NEW', key: 2,
  }),
  Tile({
    i: 0, j: 3, value: 2, state: 'NEW', key: 3,
  }),
];
// spawnTileRandom(initialTilesRandom);
// spawnTileRandom(initialTilesRandom);
