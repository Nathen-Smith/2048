import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import App from './App';
import { getInitialTilesArr, getTileMap } from './__utils__/helpers';
import initialTilesFriendlySpawning from './__utils__/constants';

test('Spawns two tiles on initial load', () => {
  render(<App />);
  const tileMap = getTileMap();

  expect(tileMap.size).toEqual(2);
});

test('No spawn on invalid move', () => {
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
  const tileMap = getTileMap();

  expect(tileMap.size).toEqual(2);
});

test('Two tile merge', () => {
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
  render(<App initialTiles={initialTiles} noSpawnNewTile />);
  fireEvent.keyDown(document.body, { key: 'a' });
  const tileMap = getTileMap();

  expect(tileMap.size).toEqual(1);
  expect(tileMap.get(0)).toEqual(4);
});

test('Three tile merge', () => {
  const initialTiles = getInitialTilesArr([
    {
      i: 0,
      j: 0,
      value: 2
    },
    {
      i: 0,
      j: 2,
      value: 2
    },
    {
      i: 0,
      j: 3,
      value: 2
    }
  ]);
  render(<App initialTiles={initialTiles} noSpawnNewTile />);
  fireEvent.keyDown(document.body, { key: 'a' });
  const tileMap = getTileMap();

  expect(tileMap.size).toEqual(2);
  expect(tileMap.get(0)).toEqual(4);
  expect(tileMap.get(1)).toEqual(2);
});

test('Four tile merge, then two tile merge', () => {
  const initialTiles = getInitialTilesArr([
    {
      i: 0,
      j: 0,
      value: 2
    },
    {
      i: 0,
      j: 1,
      value: 2
    },
    {
      i: 0,
      j: 2,
      value: 2
    },
    {
      i: 0,
      j: 3,
      value: 2
    }
  ]);
  render(<App initialTiles={initialTiles} noSpawnNewTile />);
  fireEvent.keyDown(document.body, { key: 'a' });
  let tileMap = getTileMap();

  expect(tileMap.size).toEqual(2);
  expect(tileMap.get(0)).toEqual(4);
  expect(tileMap.get(1)).toEqual(4);

  fireEvent.keyDown(document.body, { key: 'd' });
  tileMap = getTileMap();

  expect(tileMap.size).toEqual(1);
  expect(tileMap.get(3)).toEqual(8);
});

test('Friendly spawning avoids bad spawn', () => {
  render(<App initialTiles={initialTilesFriendlySpawning} />);

  // ensure friendly spawning is true
  expect(
    screen.queryByTestId('my-toggle')?.getAttribute('aria-checked')
  ).toBeTruthy();

  let tileMap = getTileMap();
  expect(tileMap.size).toEqual(14);
  fireEvent.keyDown(document.body, { key: 'd' });
  tileMap = getTileMap();

  expect(tileMap.size).toEqual(15);
  expect(tileMap.has(0)).toBeFalsy();
  expect(tileMap.get(4)).toEqual(2);
});
