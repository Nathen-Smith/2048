import { TileMeta } from '../Tile';
import { matrixIndices } from '../utils/coordinateUtils';

interface ValidGridProps {
  value: number;
  zIndex: number;
}
export default function validBoard(tilesArr: TileMeta[]) {
  if (tilesArr.length < 16) {
    return true;
  }

  const grid: ValidGridProps[][] = [];
  const gridRow: ValidGridProps[] = [
    { value: 0, zIndex: 0 },
    { value: 0, zIndex: 0 },
    { value: 0, zIndex: 0 },
    { value: 0, zIndex: 0 }
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
        (m > 0 && currTileVal === grid[m - 1][n].value) ||
        (m < 3 && currTileVal === grid[m + 1][n].value) ||
        (n > 0 && currTileVal === grid[m][n - 1].value) ||
        (n < 3 && currTileVal === grid[m][n + 1].value)
      ) {
        return true;
      }
    }
  }
  return false;
}
