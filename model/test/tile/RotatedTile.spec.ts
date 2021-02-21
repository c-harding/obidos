import RotatedTile from "@obidos/model/src/tile/RotatedTile";
import { Side } from "@obidos/model/src/tile/Side";
import { Tile } from "@obidos/model/src/tile/Tile";
import type { TileCity } from "@obidos/model/src/tile/TileCity";
import type { TileRoad } from "@obidos/model/src/tile/TileRoad";
import { TileRoadType } from "@obidos/model/src/tile/TileRoad";

describe("RotatedTile", () => {
  const cityNES = Tile().city(Side.NORTH, Side.EAST, Side.SOUTH).build();
  const cloister = Tile().cloister().road(Side.SOUTH).build();
  const roadAndCity = Tile()
    .pendantCity(Side.SOUTH)
    .throughRoad(Side.EAST, Side.WEST)
    .build();

  it("returns exactly the original sides when not rotated", () => {
    const notRotated = new RotatedTile(cityNES);
    expect(notRotated.cities).toContainEqual<TileCity>({
      pendant: false,
      walls: new Set([Side.NORTH, Side.EAST, Side.SOUTH]),
    });
  });

  it("returns exactly the original sides when rotated", () => {
    const rotated = new RotatedTile(cityNES, Side.EAST);
    expect(rotated.cities).toContainEqual<TileCity>({
      pendant: false,
      walls: new Set([Side.WEST, Side.EAST, Side.SOUTH]),
    });
  });

  it("returns a cloister rotated properly", () => {
    const rotatedCloister = new RotatedTile(cloister, Side.EAST);
    expect(rotatedCloister.cities).toHaveLength(0);
    expect(rotatedCloister.cloister).toBe(true);
    expect(rotatedCloister.roads).toStrictEqual<TileRoad[]>([
      {
        type: TileRoadType.END,
        source: Side.WEST,
      },
    ]);
  });

  it("returns everything rotated properly", () => {
    const rotatedRoadAndCity = new RotatedTile(roadAndCity, Side.WEST);
    expect(rotatedRoadAndCity.cities).toContainEqual<TileCity>({
      pendant: true,
      walls: new Set([Side.EAST]),
    });
    expect(rotatedRoadAndCity.cloister).toBe(false);
    expect(rotatedRoadAndCity.roads).toStrictEqual<TileRoad[]>([
      {
        type: TileRoadType.THROUGH,
        source: Side.NORTH,
        destination: Side.SOUTH,
      },
    ]);
  });

  it("caches computed properties of tiles", () => {
    const rotatedRoadAndCity = new RotatedTile(roadAndCity, Side.WEST);
    expect(rotatedRoadAndCity.cities).toBe(rotatedRoadAndCity.cities);
    expect(rotatedRoadAndCity.roads).toBe(rotatedRoadAndCity.roads);
  });

  it.each([
    ["a blank tile", Tile().build(), "Tile().build()"],
    ["a cloister tile", Tile().cloister().build(), "Tile().cloister().build()"],
    [
      "a road tile",
      Tile().throughRoad(Side.NORTH, Side.EAST).build(),
      "Tile().throughRoad(Side.NORTH, Side.EAST).build()",
    ],
    [
      "a city and road tile",
      Tile().city(Side.SOUTH).throughRoad(Side.NORTH, Side.EAST).build(),
      "Tile().city(Side.SOUTH).throughRoad(Side.NORTH, Side.EAST).build()",
    ],
    [
      "a city and road tile declared in reverse",
      Tile().throughRoad(Side.NORTH, Side.EAST).city(Side.SOUTH).build(),
      "Tile().city(Side.SOUTH).throughRoad(Side.NORTH, Side.EAST).build()",
    ],
    [
      "a rotated tile",
      new RotatedTile(
        Tile().pendantCity(Side.NORTH, Side.EAST, Side.WEST).road(Side.SOUTH).build(),
        Side.SOUTH,
      ),
      [
        "new RotatedTile(",
        "  Tile().pendantCity(Side.NORTH, Side.EAST, Side.WEST).road(Side.SOUTH).build(),",
        "  Side.SOUTH",
        ")",
      ].join("\n"),
    ],
    [
      "a tile rotated twice",
      new RotatedTile(
        new RotatedTile(Tile().cloister().road(Side.SOUTH).build(), Side.WEST),
        Side.SOUTH,
      ),
      [
        "new RotatedTile(",
        "  Tile().cloister().road(Side.SOUTH).build(),",
        "  Side.EAST",
        ")",
      ].join("\n"),
    ],
  ])("converts %s to a string correctly", (_desc, tile, representation) => {
    expect(tile.toString()).toBe(representation);
  });
});
