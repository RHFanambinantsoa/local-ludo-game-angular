import { PLAYER_COLOR } from '../enums/PlayerColor.enum';
import type { IPlayer } from './IPlayer';

export interface IGame {
  id: string;
  players: IPlayer[];
  turn: PLAYER_COLOR;
  scoreTarget: number;
}
