import React from 'react';

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
      return 'bg-yellow-200 text-white';
    case 256:
      return 'bg-yellow-300 text-white';
    case 512:
      return 'bg-yellow-200 text-white';
    case 1024:
      return 'bg-yellow-300 text-white';
    case 2048:
      return 'bg-yellow-400 text-white';
    case 4096:
      return 'bg-teal-500 text-white';
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

interface SpawnTileRandomProps {
  tilesArr: TileMeta[];
  setGameOver?: React.Dispatch<React.SetStateAction<boolean>>
}
export function spawnTileRandom({
  tilesArr,
  setGameOver,
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
  if (setGameOver === undefined) {
    return;
  }
  setGameOver(false);
}

export function removeMarkedTiles(tilesArr: TileMeta[]) {
  return tilesArr
    .filter((tile) => !tile.delete)
    .map((tile) => {
      const newTile = { ...tile, zIndex: 10 };
      return newTile;
    });
}

export function initialTilesRandom() {
  const initialTiles: TileMeta[] = [];
  spawnTileRandom({ tilesArr: initialTiles });
  spawnTileRandom({ tilesArr: initialTiles });
  return initialTiles;
}
