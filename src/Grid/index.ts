import { TileProps, makeTile, spawnTile } from '../Tile';

const initialGrid: TileProps[][] = [];
for (let i = 0; i < 4; i += 1) {
  const initialRow = [];
  for (let j = 0; j < 4; j += 1) {
    initialRow.push(makeTile({ value: 0 }));
  }
  initialGrid.push(initialRow);
}

spawnTile(initialGrid);
spawnTile(initialGrid);

export default initialGrid;
