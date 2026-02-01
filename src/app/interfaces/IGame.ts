import type { IPlayer } from "./IPlayer";

export interface IGame {
  id: string;
  players: IPlayer[];
  turn: number;
  target: number;
}
