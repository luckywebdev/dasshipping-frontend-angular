import { AccountDTO } from './models';

export interface AccountFilesDTO {
  id?: number;
  account?: AccountDTO;
  path: string;
  displayName?: string;
}
