import { screen } from '@testing-library/react';

import { Tile, NewTileProps } from '../Tile';
import { flatIdx } from '../utils/coordinateUtils';

export function getInitialTilesArr(newTiles: NewTileProps[]) {
  return newTiles.map((tile) => Tile(tile));
}

export function getTileMap() {
  const tilesHTML = screen.queryAllByTestId('tile');
  const tilesMap = new Map<number, number>();

  tilesHTML.forEach((tile) => {
    const classNamePos = tile.className.slice(-3); // of form X-X
    const tileRow = parseInt(classNamePos.charAt(0), 10);
    const tileCol = parseInt(classNamePos.charAt(2), 10);
    const tileFlatIdx = flatIdx(tileRow, tileCol);
    if (tilesMap.has(tileFlatIdx)) {
      throw new Error('duplicate key');
    }

    const tileText = tile.textContent;
    if (tileText === null) {
      throw new Error('no tile value');
    }
    const tileValue = parseInt(tileText, 10);

    tilesMap.set(tileFlatIdx, tileValue);
  });
  return tilesMap;
}
