import { Board } from "../../src/board/Board";
import RotatedTile from "../../src/tile/RotatedTile";
import { Tile } from "../../src/tile/Tile";

describe("Board", () => {
  const blankTile = Tile().build();
  it("shows the correct free spaces initially", () => {
    const board = new Board(blankTile);
    const freeLocations = [...board.freeLocations()];
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

  it("shows the correct free spaces after adding spaces", () => {
    const board = new Board(blankTile);
    board.set(1, 0, new RotatedTile(blankTile));
    board.set(1, 1, new RotatedTile(blankTile));
    board.set(0, -1, new RotatedTile(blankTile));

    const freeLocations = [...board.freeLocations()];
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
});
