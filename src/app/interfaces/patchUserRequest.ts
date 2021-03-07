import { AccountFilesDTO } from './accountFilesDTO';
import { LanguageDTO } from './models';

export interface PatchUserRequest {
  avatarUrl?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  address?: string;
  city?: string;
  password?: string;
  state?: string;
  zip?: string;
  dlNumber?: string;
  files?: AccountFilesDTO[];
  languages?: LanguageDTO[];
  roleId?: number;
  payRate?: number;
  phoneNumber?: string;
  genderId?: number;
  companyName?: string;
}
