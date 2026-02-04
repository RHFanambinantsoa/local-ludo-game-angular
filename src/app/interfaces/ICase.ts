import { CASE_TYPE } from '../enums/CaseType.enum';

export interface ICase {
  id?: string;
  type: CASE_TYPE;
  position: number;
  isSafeCase?: boolean;
  enterCase?: boolean;
  colored?: boolean;
}
