import { JoinRequestDTO } from './models';

export interface GetJoinedRequestsResponse {
  count: number;

  data: JoinRequestDTO[];
}
