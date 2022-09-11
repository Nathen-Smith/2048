import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../App';
import { Tile, NewTileProps } from '../Tile';

function getInitialTilesArr(newTiles: NewTileProps[]) {
  return newTiles.map((tile) => Tile(tile));
}

test('Spawns two tiles on reload', () => {
  render(<App />);
  const tilesArr = screen.queryAllByTestId('tile');
  expect(tilesArr.length).toEqual(2);
});

test('No spawn on invalid move, merges correctly', () => {
  const initialTiles = getInitialTilesArr([
    {
      i: 0,
      j: 0,
      value: 2
    },
    {
      i: 0,
      j: 3,
      value: 2
    }
  ]);
  render(<App initialTiles={initialTiles} />);
  fireEvent.keyDown(document.body, { key: 'w' });
  let tilesArr = screen.queryAllByTestId('tile');
  expect(tilesArr.length).toEqual(2);

  fireEvent.keyDown(document.body, { key: 'a' });
  tilesArr = screen.queryAllByTestId('tile');
  expect(tilesArr.length).toEqual(2);
});
