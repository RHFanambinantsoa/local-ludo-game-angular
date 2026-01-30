import { PLAYER_COLOR } from '../enums/PlayerColor.enum';

export const NUM_PAWN_PER_PLAYER = 4;
export const START_POSITION = -1;
export const BASE_EXIT_VALUE = 6;

export const SAFE_CASES = [1, 9, 14, 22, 27, 35, 40, 48];
export const COMMON_CASE_NUMBER = 52;
export const PERSONAL_CASE_NUMBER = 6;

// parcours par couleur
export const COURSES = [
  {
    color: PLAYER_COLOR.GREEN,
    startCommonCase: 1,
    endCommonCase: 51,
  },
  {
    color: PLAYER_COLOR.YELLOW,
    startCommonCase: 14,
    endCommonCase: 12,
  },
  {
    color: PLAYER_COLOR.BLUE,
    startCommonCase: 27,
    endCommonCase: 25,
  },
  {
    color: PLAYER_COLOR.RED,
    startCommonCase: 40,
    endCommonCase: 38,
  },
];
