## 2048 Built with React Hooks, TypeScript, Tailwind CSS, Headless UI
The app is hosted on github pages <a href="http://nathensmith.com/2048">here</a>.

Thanks to <a href="https://blog.logrocket.com/using-localstorage-react-hooks/">this</a>
guide on local storage with React hooks, and FormidableLab's <a href="https://github.com/FormidableLabs/react-swipeable">useSwipeable</a> hook.

## Definitions
- "matrix index": The standard way of indexing into a 2-dimensional array (matrix). Goes by rows then column, 0-indexed.
- "flat index": A way of representing 2-dimensional coordinates in one dimension. The ordering used is left-to-right, top-to-bottom.

## Design
The state of the game is represented by `tilesArr`, an array of objects described by `TileMeta`:

https://github.com/Nathen-Smith/2048/blob/ad8ffbf703f93100e5e45575cfc789aa6fbb51b3/src/Tile/tile.ts#L4-L12

Here are the descriptions of each property

| Property     | Description |
| ------------ | ----------- |
| idx          | The current flat index of the tile |
| key          | The unique key for this tile, necessary so React can update this tile accordingly |
| value        | The power of 2 number of this tile |
| shouldDelete | Marking for deletion of a tile (when merging) |
| zIndex       | CSS z-index value for this tile (merging) |
| transition   | CSS transition, which places the tile in its correct spot |
| animation    | CSS animation, could be a new tile or a merged tile |

There is also the 

https://github.com/Nathen-Smith/2048/blob/ad8ffbf703f93100e5e45575cfc789aa6fbb51b3/src/Tile/tile.ts#L27-L34
