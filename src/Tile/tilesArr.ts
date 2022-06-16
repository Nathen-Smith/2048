import { TileMeta, spawnTileRandom } from './tile';

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
