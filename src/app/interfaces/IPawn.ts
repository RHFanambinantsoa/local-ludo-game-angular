import { PLAYER_COLOR } from '../enums/PlayerColor.enum';
import type { ICase } from './ICase';

export interface IPawn {
  id: string;
  idPlayer?: number;
  color: PLAYER_COLOR;
  previewsCase?: ICase;
  currentCase?: ICase;
  isSafe?: boolean;
  hasArrived?: boolean;
  isMoving?: boolean;
  isMoveable?: boolean;
  startCase: ICase;
  entryCase?: ICase;
  nbCommunCaseParcouru: number;
  nbPersonalCaseParcouru: number;
}
