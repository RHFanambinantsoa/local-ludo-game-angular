import { CASE_TYPE } from '../enums/CaseType.enum';

export interface ICase {
  type: CASE_TYPE;
  position: number;
}
