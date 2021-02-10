import FrozenArrayBuilder from "../board/FrozenArrayBuilder";
import { range } from "../iteration";
import { Side } from "../tile/Side";
import { Tile } from "../tile/Tile";

export const defaultCards = {
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

export const startingCard = defaultCards.D;

const copies = <T extends unknown>(...args: [T, number][]) => {
  const array = new FrozenArrayBuilder<T>();
  for (const [item, count] of args) {
    for (const _ of range(count)) array.push(item);
  }
  return array.build();
};

export const defaultDrawPile = copies<Tile>(
  [defaultCards.A, 2],
  [defaultCards.B, 4],
  [defaultCards.C, 1],
  [defaultCards.D, 3],
  [defaultCards.E, 5],
  [defaultCards.F, 2],
  [defaultCards.G, 1],
  [defaultCards.H, 3],
  [defaultCards.I, 2],
  [defaultCards.J, 3],
  [defaultCards.K, 3],
  [defaultCards.L, 3],
  [defaultCards.M, 3],
  [defaultCards.N, 3],
  [defaultCards.O, 2],
  [defaultCards.P, 3],
  [defaultCards.Q, 1],
  [defaultCards.R, 3],
  [defaultCards.S, 2],
  [defaultCards.T, 1],
  [defaultCards.U, 8],
  [defaultCards.V, 9],
  [defaultCards.W, 4],
  [defaultCards.X, 1],
);
