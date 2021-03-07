import {QuoteDTO} from './models';

export interface GetLeadsListResponse {
  count: number;
  data: QuoteDTO[];
}
