import type PlayerFactory from "@obidos/model/src/player/PlayerFactory";

export default interface PlayerBlueprint {
  readonly factory: PlayerFactory;
  readonly name: string;
}
