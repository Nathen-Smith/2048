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

Note that every property of a Tile can change, except the key.

## Game Movement Lifecyle and Logic
This is what happens whenever the user moves the tiles (WASD, arrow keys, swipe): 

1. First remove any tiles marked for deletion
  - The reason for this is best explained by an example of the expected behavior when merging. Say we have two tiles that are merging, for simplicity, treat tile 1 as stationary (e.g. on the left wall) and tile 2 as the one moving. Tile 2 slides over tile 1, overlapping it, and then tile 2 doubles its value. Tile 1 could not have been deleted in the process of moving or else it would look it randomly disappeared, rather the tile is deleted on the next movement cyle.
2. Then, we iterate each direction with two loops: only the order of the inner loop matters. This is also best explained with an example, we consider moving up in the following:
  - take tiles from the top and move them first, then tiles below get moved: the ordering is row 0 to row 3. The ordering of the column iteration does not matter here.
  - Maintain a `nextSpot` for every column, which starts at 0. Whenever we encounter a tile in our iteration, we update the `nextSpot` as well as move or merge tiles
3. `nextSpot` can be thought of as an empty position within the grid. When handling the moving for each tile, we need to check if we can merge this tile. If we can merge, the tile gets assigned the styles to transition over and `nextSpot` is unchanged since it still is an empty position. When we can only move the tile, then we increment/decrement `nextSpot` as according to the iteration direction.

## Friendly Spawning

Firstly, there are some terms that need to be defined. It also helps to know the optimal strategy for 2048: building in a corner. The highest tile should be in a corner, then in that row or column that contains that piece, are tiles that increment up to the highest tile e.g. a row at the top of `512 | 256 | 128 | 64`. Consider the example of building to the top left corner for the definitions below:
- "Forbidden move": The one move you should never do. For the example of building to top left corner, this would be moving tiles down. This is forbidden because it is almost certain there are pieces below the row, or will spawn above, thus ruining the row of increasing tiles.
- "Sub-optimal move": This would be moving right. If we had a top row of `512 | 256 | 128 | X` and we move right, we risk a tile spawning in the top left corner, which is extremely hard to get rid of and essentially would take up space.

At a high level, the algorithm for friendly spawning (rather, preventing bad spawning) is as follows.

We parse the grid row-wise, then column-wise (ordering does not matter). If there are exactly 3 tiles in this row or column, and the number next to the open spot is greater than 2, we prevent spawning a tile in this open spot. This way, a newly spawned tile cannot mess up the sub-optimal move. Similarly, a forbidden move cannot occur as a row or column will only be filled if we can merge.
