import { AccountFilesDTO } from './models';
import { NotificationDTO } from './notificationDTO';

/**
 * Zoolu API
 * Zoolu API Documentation
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface CompanyDTO {
  id: number;
  address: string;
  avatarUrl: string;
  blocked: boolean;
  city: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonPhone: string;
  dotNumber: string;
  email: string;
  insuranceUrl: string;
  mcCertificateUrl: string;
  msNumber: string;
  name: string;
  officePhone: string;
  state: string;
  zip: string;
  status: string;
  files?: AccountFilesDTO[];
  driversCount?: number;
  dispatchersCount?: number;
  notifications?: NotificationDTO[];
}