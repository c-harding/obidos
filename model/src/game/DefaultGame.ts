import FrozenArrayBuilder from "../board/FrozenArrayBuilder";
import { range } from "../iteration";
import { Side } from "../tile/Side";
import { Tile } from "../tile/Tile";

// Source:
// https://static1.squarespace.com/static/53ec790ae4b0396cbd14d8a1/t/5979af2f893fc0424c4691f9/1501146946692/Carcassonne-board-game-rules.pdf
export const defaultTiles = {
  A: Tile().cloister().road(Side.SOUTH).build(),
  B: Tile().cloister().build(),
  C: Tile().pendantCity(Side.NORTH, Side.EAST, Side.SOUTH, Side.WEST).build(),
  D: Tile().throughRoad(Side.NORTH, Side.SOUTH).city(Side.EAST).build(),
  E: Tile().city(Side.NORTH).build(),
  F: Tile().pendantCity(Side.EAST, Side.WEST).build(),
  G: Tile().city(Side.NORTH, Side.SOUTH).build(),
  H: Tile().city(Side.EAST).city(Side.WEST).build(),
  I: Tile().city(Side.EAST).city(Side.SOUTH).build(),
  J: Tile().city(Side.NORTH).throughRoad(Side.EAST, Side.SOUTH).build(),
  K: Tile().city(Side.EAST).throughRoad(Side.NORTH, Side.WEST).build(),
  L: Tile().city(Side.EAST).road(Side.NORTH).road(Side.SOUTH).road(Side.WEST).build(),
  M: Tile().pendantCity(Side.NORTH, Side.WEST).build(),
  N: Tile().city(Side.NORTH, Side.WEST).build(),
  O: Tile().pendantCity(Side.NORTH, Side.WEST).throughRoad(Side.EAST, Side.SOUTH).build(),
  P: Tile().city(Side.NORTH, Side.WEST).throughRoad(Side.EAST, Side.SOUTH).build(),
  Q: Tile().pendantCity(Side.NORTH, Side.EAST, Side.WEST).build(),
  R: Tile().city(Side.NORTH, Side.EAST, Side.WEST).build(),
  S: Tile().pendantCity(Side.NORTH, Side.EAST, Side.WEST).road(Side.SOUTH).build(),
  T: Tile().city(Side.NORTH, Side.EAST, Side.WEST).road(Side.SOUTH).build(),
  U: Tile().throughRoad(Side.NORTH, Side.SOUTH).build(),
  V: Tile().throughRoad(Side.SOUTH, Side.WEST).build(),
  W: Tile().road(Side.EAST).road(Side.SOUTH).road(Side.WEST).build(),
  X: Tile().road(Side.NORTH).road(Side.EAST).road(Side.SOUTH).road(Side.WEST).build(),
};

export const startingTile = defaultTiles.D;

function copies<T>(...args: [T, number][]) {
  const array = new FrozenArrayBuilder<T>();
  for (const [item, count] of args) {
    for (const _ of range(count)) array.push(item);
  }
  return array.build();
}

export const defaultDrawPile = copies<Tile>(
  [defaultTiles.A, 2],
  [defaultTiles.B, 4],
  [defaultTiles.C, 1],
  [defaultTiles.D, 3],
  [defaultTiles.E, 5],
  [defaultTiles.F, 2],
  [defaultTiles.G, 1],
  [defaultTiles.H, 3],
  [defaultTiles.I, 2],
  [defaultTiles.J, 3],
  [defaultTiles.K, 3],
  [defaultTiles.L, 3],
  [defaultTiles.M, 2],
  [defaultTiles.N, 3],
  [defaultTiles.O, 2],
  [defaultTiles.P, 3],
  [defaultTiles.Q, 1],
  [defaultTiles.R, 3],
  [defaultTiles.S, 2],
  [defaultTiles.T, 1],
  [defaultTiles.U, 8],
  [defaultTiles.V, 9],
  [defaultTiles.W, 4],
  [defaultTiles.X, 1],
);

export const meeplePerPlayer = 0;
