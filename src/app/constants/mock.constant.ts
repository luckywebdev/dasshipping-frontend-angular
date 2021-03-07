import { GetInvitationsListResponse } from '../interfaces/getInvitationsListResponse';
import { GetTripsListResponse } from '../interfaces/getTripsListResponse';
import {
  AccountDTO,
  AccountEditRequest,
  AccountInviteRequest,
  ApproveAccountsRequest,
  BadRequestDTO,
  BlockAccountsRequest,
  BlockCompanyRequest,
  CarrierInviteRequest,
  CarrierNewRegisterRequest,
  CarrierNewRegisterResponse,
  CarrierRegisterRequest,
  CarrierRegisterResponse,
  CommonRegisterRequest,
  CompanyDTO,
  DeclineAccountInviteRequest,
  DeleteAccountsRequest,
  ExpireInviteRequest,
  FieldError,
  FileUploadResponse,
  ForgotPasswordRequest,
  GenderDTO,
  GeneralPatchDTO,
  GetAccountInvitesListResponse,
  GetAccountsListResponse,
  GetCompanyInvitesListResponse,
  GetCompanyListResponse,
  GetPolicyListResponse,
  InviteDTO,
  InviteStatusDTO,
  LoginRequest,
  LoginResponse,
  OrderAttachmentTypeDTO,
  OrderStatusDTO,
  PatchCompanyRequest,
  PatchUserRequest,
  PolicyCreateRequest,
  PolicyDTO,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResendInviteRequest,
  ResetPasswordRequest,
  RoleDTO,
  SuccessDTO,
  ValidateResetPasswordTokenRequest,
  ValidateResetPasswordTokenResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '../interfaces/models';

export const Mock_RoleDTO: RoleDTO = {
  id: 1,
  name: 'string',
};

export const Mock_CompanyDTO: CompanyDTO = {
  id: 1,
  name: 'string',
  address: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  dotNumber: 'string',
  msNumber: 'string',
  officePhone: 'string',
  contactPersonFirstName: 'string',
  contactPersonLastName: 'string',
  contactPersonPhone: 'string',
  mcCertificateUrl: 'string',
  insuranceUrl: 'string',
  blocked: false,
  email: 'string',
  avatarUrl: 'string',
  status: 'status',
};

export const Mock_GenderDTO: GenderDTO = {
  id: 1,
  name: 'string',
};

export const Mock_AccountDTO: AccountDTO = {
  id: 1,
  email: 'string',
  companyId: 1,
  roleId: 1,
  firstName: 'string',
  lastName: 'string',
  role: Mock_RoleDTO,
  blocked: false,
  deleted: false,
  approved: true,
  company: Mock_CompanyDTO,
  avatarUrl: 'string',
  address: 'string',
  city: 'string',
  dlNumber: 'string',
  emailConfirmed: true,
  gender: Mock_GenderDTO,
  genderId: 1,
  receiveNotifications: true,
  state: 'string',
  zip: 'string',
};

export const Mock_AccountEditRequest: AccountEditRequest = {
  firstName: 'string',
  lastName: 'string',
  password: 'string',
};

export const Mock_AccountInviteRequest: AccountInviteRequest = {
  email: 'string',
  firstName: 'string',
  lastName: 'string',
  roleId: 1,
};

export const Mock_ApproveAccountsRequest: ApproveAccountsRequest = {
  ids: [1, 2, 3],
  approved: true,
};

export const Mock_FieldError: FieldError = {
  target: 'any',
  property: 'string',
  constraints: 'any',
};

export const Mock_BadRequestDTO: BadRequestDTO = {
  statusCode: 1,
  error: 'string',
  message: [Mock_FieldError],
};

export const Mock_BlockAccountsRequest: BlockAccountsRequest = {
  ids: [1, 2, 3],
  blocked: true,
  reason: 'string',
};

export const Mock_BlockCompanyRequest: BlockCompanyRequest = {
  ids: ['1', '2', '3'],
  blocked: true,
  reason: 'string',
};

// export const Mock_CarDTO: CarDTO = {
//   height: 'string',
//   length: 'string',
//   make: 'string',
//   model: 'string',
//   type: 'string',
//   weight: 'string',
//   year: 'string',
//   vin: 'string',
// };

export const Mock_CarrierInviteRequest: CarrierInviteRequest = {
  email: 'string',
  name: 'string',
  address: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  dotNumber: 'string',
  msNumber: 'string',
  officePhone: 'string',
  contactPersonFirstName: 'string',
  contactPersonLastName: 'string',
  contactPersonPhone: 'string',
  mcCertificateUrl: 'string',
  insuranceUrl: 'string',
};

export const Mock_CarrierNewRegisterRequest: CarrierNewRegisterRequest = {
  name: 'string',
  address: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  dotNumber: 'string',
  msNumber: 'string',
  officePhone: 'string',
  contactPersonFirstName: 'string',
  contactPersonLastName: 'string',
  contactPersonPhone: 'string',
  mcCertificateUrl: 'string',
  insuranceUrl: 'string',
  email: 'string',
};

export const Mock_CarrierNewRegisterResponse: CarrierNewRegisterResponse = {
  success: true,
  hash: 'string',
};

export const Mock_CarrierRegisterRequest: CarrierRegisterRequest = {
  hash: 'string',
  name: 'string',
  address: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  dotNumber: 'string',
  msNumber: 'string',
  officePhone: 'string',
  contactPersonFirstName: 'string',
  contactPersonLastName: 'string',
  contactPersonPhone: 'string',
  mcCertificateUrl: 'string',
  insuranceUrl: 'string',
  token: 'string',
};

export const Mock_CarrierRegisterResponse: CarrierRegisterResponse = {
  success: true,
  hash: 'string',
};

export const Mock_CommonRegisterRequest: CommonRegisterRequest = {
  password: 'string',
  hash: 'string',
  token: 'string',
};

export const Mock_DeclineAccountInviteRequest: DeclineAccountInviteRequest = {
  hash: 'string',
};

export const Mock_DeleteAccountsRequest: DeleteAccountsRequest = {
  ids: [1, 2, 3],
  deleted: true,
};

export const Mock_ExpireInviteRequest: ExpireInviteRequest = {
  ids: ['1', '2', '3'],
};

export const Mock_FileUploadResponse: FileUploadResponse = {
  url: 'string',
  signedUrl: 'string',
};

export const Mock_ForgotPasswordRequest: ForgotPasswordRequest = {
  email: 'string',
};

// export const Mock_GeneralDTO: GeneralDTO = {
//   id: 1,
//   minimumProfitPercentage: 1,
//   recommendedProfitPercentage: 1,
//   serviceAbsoluteFee: 1,
// };

export const Mock_GeneralPatchDTO: GeneralPatchDTO = {
  minimumProfitPercentage: 1,
  recommendedProfitPercentage: 1,
};

export const Mock_InviteStatusDTO: InviteStatusDTO = {
  id: 1,
  name: 'string',
};

export const Mock_InviteDTO: InviteDTO = {
  id: 1,
  hash: 'string',
  email: 'string',
  roleId: 1,
  role: Mock_RoleDTO,
  company: Mock_CompanyDTO,
  companyId: 1,
  extended: false,
  expire: new Date(),
  firstName: 'string',
  lastName: 'string',
  createdById: 1,
  createdBy: Mock_AccountDTO,
  statusId: 1,
  status: Mock_InviteStatusDTO,
  createdAt: new Date(),
};

export const Mock_GetAccountInvitesListResponse: GetAccountInvitesListResponse = {
  data: [Mock_InviteDTO, { ...Mock_InviteDTO, id: 2 }, { ...Mock_InviteDTO, id: 3 }],
  count: 1,
};

export const Mock_GetAccountsListResponse: GetAccountsListResponse = {
  data: [Mock_AccountDTO, { ...Mock_AccountDTO, id: 2 }, { ...Mock_AccountDTO, id: 3 }],
  count: 1,
};

export const Mock_GetCompanyInvitesListResponse: GetCompanyInvitesListResponse = {
  data: [Mock_InviteDTO, { ...Mock_InviteDTO, id: 2 }, { ...Mock_InviteDTO, id: 3 }],
  count: 1,
};

export const Mock_GetCompanyListResponse: GetCompanyListResponse = {
  data: [Mock_CompanyDTO, { ...Mock_CompanyDTO, id: 2 }, { ...Mock_CompanyDTO, id: 2 }],
  count: 1,
};

export const Mock_GetInvitationsListResponse: GetInvitationsListResponse = {
  data: [Mock_InviteDTO, { ...Mock_InviteDTO, id: 2 }, { ...Mock_InviteDTO, id: 3 }],
  count: 1,
};

// export const Mock_LocationDTO: LocationDTO = {
//   label: 'string',
//   lat: 1,
//   lon: 1,
//   address: 'string',
//   city: 'string',
//   postalCode: 'string',
//   state: 'string',
// };

export const Mock_OrderStatusDTO: OrderStatusDTO = {
  id: 1,
  name: 'string',
};

// export const Mock_OrderDTO: OrderDTO = {
//   id: 1,
//   startDate: 'string',
//   endDate: 'string',
//   createdAt: new Date(),
//   pickLocation: Mock_LocationDTO,
//   deliveryLocation: Mock_LocationDTO,
//   statusId: 1,
//   createdBy: Mock_AccountDTO,
//   createdById: 1,
//   status: Mock_OrderStatusDTO,
//   tripId: 1,
//   price: 1,
//   isVirtual: false,
//   companyId: 1,
//   company: Mock_CompanyDTO,
//   cars: [Mock_CarDTO],
//   pickInstructions: 'string',
//   deliveryInstructions: 'string',
//   paymentMethod: 'string',
//   paid: false,
//   enclosed: false,
//   distance: 100,
// };

// export const Mock_GetOrdersListResponse: GetOrdersListResponse = {
//   data: [Mock_OrderDTO],
//   count: 1,
// };

// export const Mock_TripStatusDTO: TripStatusDTO = {
//   id: 1,
//   name: 'string',
// };

// export const Mock_TripDTO: TripDTO = {
//   id: 1,
//   company: Mock_CompanyDTO,
//   companyId: 1,
//   driverId: 1,
//   driver: Mock_AccountDTO,
//   dispatcherId: 1,
//   dispatcher: Mock_AccountDTO,
//   statusId: 1,
//   status: Mock_TripStatusDTO,
// };

export const Mock_GetTripsListResponse: GetTripsListResponse = {
  data: [],
  count: 1,
};

export const Mock_LoginRequest: LoginRequest = {
  email: 'string',
  password: 'string',
  token: 'string',
};

export const Mock_LoginResponse: LoginResponse = {
  accessToken: 'string',
  refreshToken: 'string',
  expiresIn: 1,
};

export const Mock_OrderAttachmentTypeDTO: OrderAttachmentTypeDTO = {
  id: 1,
  name: 'string',
};

// export const Mock_OrderAttachmentDTO: OrderAttachmentDTO = {
//   id: 1,
//   url: 'string',
//   typeId: 'string',
//   type: Mock_OrderAttachmentTypeDTO,
//   orderId: 1,
//   order: Mock_OrderDTO,
// };

// export const Mock_OrderCreateRequest: OrderCreateRequest = {
//   startDate: 'string',
//   endDate: 'string',
//   pickLocation: Mock_LocationDTO,
//   deliveryLocation: Mock_LocationDTO,
//   statusId: 1,
//   price: 1,
//   tripId: 1,
//   cars: [Mock_CarDTO],
//   driverId: 1,
//   pickContactPersonName: 'string',
//   pickContactPersonPhone: 'string',
//   pickContactPersonEmail: 'string',
//   deliveryContactPersonName: 'string',
//   deliveryContactPersonPhone: 'string',
//   deliveryContactPersonEmail: 'string',
//   paid: false,
// };

// export const Mock_OrderNoteDTO: OrderNoteDTO = {
//   id: 1,
//   orderId: 1,
//   order: Mock_OrderDTO,
//   accountId: 1,
//   account: Mock_AccountDTO,
//   createdAt: new Date(),
//   note: 'string',
// };

// export const Mock_OrderTimelineDTO: OrderTimelineDTO = {
//   id: 1,
//   oldValue: Mock_OrderDTO,
//   newValue: Mock_OrderDTO,
//   typeId: 1,
//   type: Mock_OrderTimelineTypeDTO,
//   orderId: 1,
//   order: Mock_OrderDTO,
//   createdAt: new Date(),
//   actionAccountId: 1,
//   actionAccount: Mock_AccountDTO,
// };

export const Mock_PatchCompanyRequest: PatchCompanyRequest = {
  name: 'string',
  address: 'string',
  city: 'string',
  state: 'string',
  zip: 'string',
  officePhone: 'string',
  contactPersonFirstName: 'string',
  contactPersonLastName: 'string',
  contactPersonPhone: 'string',
  mcCertificateUrl: 'string',
  insuranceUrl: 'string',
  email: 'string',
  avatarUrl: 'string',
};

export const Mock_PatchUserRequest: PatchUserRequest = {
  email: 'string',
  roleId: 1,
  firstName: 'string',
  lastName: 'string',
  avatarUrl: 'string',
};

export const Mock_PolicyDTO: PolicyDTO = {
  id: 1,
  price: 1,
  type: 'string',
};

export const Mock_GetPolicyListResponse: GetPolicyListResponse = {
  count: 1,
  data: [Mock_PolicyDTO],
};

export const Mock_PolicyCreateRequest: PolicyCreateRequest = {
  price: 1,
  type: 'string',
};
export const Mock_RefreshTokenResponse: RefreshTokenResponse = {
  accessToken: 'string',
  refreshToken: 'string',
  expiresIn: 1,
};
export const Mock_RefreshTokenRequest: RefreshTokenRequest = {
  refreshToken: 'string',
};

export const Mock_ResetPasswordRequest: ResetPasswordRequest = {
  hash: 'string',
  password: 'string',
};

export const Mock_ResendInviteRequest: ResendInviteRequest = {
  ids: ['1', '2', '3'],
};

export const Mock_SuccessDTO: SuccessDTO = {
  success: true,
};

// export const Mock_TripCreateRequest: TripCreateRequest = {
//   driverId: 1,
//   notes: 'string',
//   statusId: 1,
// };

export const Mock_ValidateResetPasswordTokenResponse: ValidateResetPasswordTokenResponse = {
  success: true,
  roleId: 1,
};

export const Mock_ValidateResetPasswordTokenRequest: ValidateResetPasswordTokenRequest = {
  hash: 'string',
};

export const Mock_ValidateTokenResponse: ValidateTokenResponse = {
  success: true,
  invite: Mock_InviteDTO,
};

export const Mock_ValidateTokenRequest: ValidateTokenRequest = {
  hash: 'string',
};
