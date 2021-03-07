export interface PolicyDTO {
  id?: number;
  price: number;
  type: string;
  isNew?: boolean;
}
export interface GetPolicyListResponse {
  count: number;
  data: PolicyDTO[];
}
export interface PolicyCreateRequest {
  price: number;
  type: string;
  isNew?: boolean;
}
