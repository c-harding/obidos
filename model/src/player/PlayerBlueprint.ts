import type PlayerFactory from "./PlayerFactory";

export default interface PlayerBlueprint {
  readonly factory: PlayerFactory;
  readonly name: string;
}
