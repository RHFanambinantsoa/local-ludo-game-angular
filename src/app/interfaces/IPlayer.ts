import { PLAYER_COLOR } from '../enums/PlayerColor.enum';
import { IPawn } from './IPawn';

export interface IPlayer {
  id: number;
  color: PLAYER_COLOR;
  pawns: IPawn[];
}
