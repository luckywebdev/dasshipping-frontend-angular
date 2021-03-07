import { QuoteDTO } from './quoteDTO';

export interface GetQoutesListResponse {
  data: QuoteDTO[];
  count: number;
}
