import { Board } from "../../src/board/Board";
import RotatedTile from "../../src/tile/RotatedTile";
import { Side } from "../../src/tile/Side";
import { Tile } from "../../src/tile/Tile";

describe("Board", () => {
  const blankTile = Tile().build();
  const crossroadsTile = Tile()
    .road(Side.NORTH)
    .road(Side.EAST)
    .road(Side.SOUTH)
    .road(Side.WEST)
    .build();
  const westCityTile = Tile().city(Side.WEST).build();
  const horizontalRoadTile = Tile().throughRoad(Side.EAST, Side.WEST).build();

  it("shows the correct free spaces initially", () => {
    const board = new Board(blankTile);
    const freeLocations = board.freeLocations;
    expect(freeLocations).toHaveLength(4);
    expect(freeLocations).toStrictEqual(
      expect.arrayContaining([
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ]),
    );
  });

  it("shows the correct free spaces after adding tiles", () => {
    const board = new Board(blankTile);
    board.add(1, 0, new RotatedTile(blankTile));
    board.add(1, 1, new RotatedTile(blankTile));
    board.add(0, -1, new RotatedTile(blankTile));

    const freeLocations = board.freeLocations;
    expect(freeLocations).toHaveLength(8);
    expect(freeLocations).toStrictEqual(
      expect.arrayContaining([
        [-1, -1],
        [-1, 0],
        [0, -2],
        [0, 1],
        [1, -1],
        [1, 2],
        [2, 0],
        [2, 1],
      ]),
    );
  });

  it("shows the correct available spaces after adding pieces", () => {
    const board = new Board(blankTile);
    board.add(1, 0, new RotatedTile(blankTile));
    board.add(1, 1, new RotatedTile(blankTile));

    const freeLocations = [
      ...board.freeLocationsForTile(new RotatedTile(horizontalRoadTile)),
    ];
    const expected: [number, number, Set<Side>][] = [
      [-1, 0, new Set([Side.NORTH, Side.SOUTH])],
      [0, -1, new Set([Side.EAST, Side.WEST])],
      [1, -1, new Set([Side.EAST, Side.WEST])],
      [1, 2, new Set([Side.EAST, Side.WEST])],
      [2, 0, new Set([Side.NORTH, Side.SOUTH])],
      [2, 1, new Set([Side.NORTH, Side.SOUTH])],
    ];
    expect(freeLocations).toHaveLength(expected.length);
    expect(freeLocations).toStrictEqual(expect.arrayContaining(expected));
  });

  it("returns the correct bounds", () => {
    const board = new Board(blankTile);
    board.add(1, 0, new RotatedTile(blankTile));
    board.add(1, 1, new RotatedTile(blankTile));
    board.add(1, 2, new RotatedTile(blankTile));
    board.add(-1, 0, new RotatedTile(blankTile));
    board.add(-2, 0, new RotatedTile(blankTile));
    board.add(-2, -1, new RotatedTile(blankTile));

    expect(board.minCol).toBe(-1);
    expect(board.maxCol).toBe(3);
    expect(board.minRow).toBe(-2);
    expect(board.maxRow).toBe(2);
  });

  it("retrieves pieces correctly", () => {
    const board = new Board(blankTile);
    const piece = board.add(1, 0, new RotatedTile(blankTile));
    expect(board.get(1, 0)).toBe(piece);
    expect(board.get(2, 2)).toBeUndefined();
  });

  it("allows placing pieces next to each other", () => {
    const board = new Board(blankTile);
    const newTile = new RotatedTile(blankTile);
    const piece = board.add(1, 0, newTile);
    expect(piece).toBeDefined();
    expect(board.get(1, 0)).toBe(newTile);
    expect(board.get(1, 0)).toBe(piece);
  });

  it("blocks placing pieces next to each other when they do not match", () => {
    const board = new Board(blankTile);

    let piece = board.add(1, 0, new RotatedTile(crossroadsTile));
    expect(piece).toBeUndefined();
    expect(board.get(1, 0)).toBeUndefined();

    piece = board.add(0, 1, new RotatedTile(westCityTile));
    expect(piece).toBeUndefined();
    expect(board.get(0, 1)).toBeUndefined();
  });

  it("blocks placing pieces discontiguously", () => {
    const board = new Board(blankTile);
    expect(board.add(2, 0, new RotatedTile(blankTile))).toBeUndefined();
    expect(board.get(2, 0)).toBeUndefined();
  });

  it("blocks replacing pieces", () => {
    const board = new Board(blankTile);
    const originalTile = board.get(0, 0);
    const replacementTile = new RotatedTile(crossroadsTile);
    expect(board.add(0, 0, replacementTile)).toBeUndefined();
    expect(board.get(0, 0)).not.toBe(replacementTile);
    expect(board.get(0, 0)).toBe(originalTile);
  });
});
