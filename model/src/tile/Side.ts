export enum Side {
  NORTH = 1,
  EAST,
  SOUTH,
  WEST,
}

export namespace Side {
  export const values = Object.freeze([Side.NORTH, Side.EAST, Side.SOUTH, Side.WEST]);

  export function rotate(basis: Side, by: Side): Side {
    const basisIndex = Side.values.indexOf(basis);
    const byNumber = Side.values.indexOf(by);
    const count = Side.values.length;
    return Side.values[(basisIndex + byNumber) % count];
  }

  export function unrotate(basis: Side, by: Side): Side {
    const basisIndex = Side.values.indexOf(basis);
    const byNumber = Side.values.indexOf(by);
    const count = Side.values.length;
    return Side.values[(basisIndex + count - byNumber) % count];
  }

  export function opposite(basis: Side): Side {
    return rotate(basis, Side.SOUTH);
  }

  export function string(side: Side): string {
    switch (side) {
      case Side.NORTH:
        return "Side.NORTH";
      case Side.EAST:
        return "Side.EAST";
      case Side.SOUTH:
        return "Side.SOUTH";
      case Side.WEST:
        return "Side.WEST";
    }
  }
}
