import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CLIENT_PAYMENT_STATUSES } from '../../constants';
import { ROLES_STATUS } from '../../enums';
import {
  CalculatePriceRequest,
  CreateOrderRequest,
  GetOrdersListResponse,
  GetOrdersRequest,
  GetQoutesListResponse,
  LocationDTO,
  OrderAttachmentDTO,
  OrderCreateRequest,
  OrderDTO,
  OrderNoteDTO,
  OrderTimelineDTO,
  QuoteDTO,
  SuccessDTO,
  TempPriceEntity,
} from '../../interfaces/models';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  formatDate = 'YYYY/MM/DD';
  @Output() changeRequested: EventEmitter<boolean> = new EventEmitter();
  PATH = {
    1: '',
    2: '/company/me',
    4: '/dispatchers/me',
  };

  constructor(
    protected httpClient: HttpClient,
    private userService: UserService,
  ) {
  }

  private encodeData(data) {
    return Object.keys(data)
      .filter(key => data[key])
      .map((key) => {
        return [key, data[key]].map(encodeURIComponent).join('=');
      })
      .join('&');
  }

  public getList(filter: GetOrdersRequest): Observable<GetOrdersListResponse> {
    const filterPath = this.encodeData(filter);
    return this.httpClient.get<GetOrdersListResponse>(
      `${environment.api}/orders?${filterPath}`,
    );
  }

  public getListOrders(
    param: string,
    filter: GetOrdersRequest,
  ): Observable<GetOrdersListResponse> {
    const filterPath = this.encodeData(filter);
    return this.httpClient.get<GetOrdersListResponse>(
      `${environment.api}/orders/${param}?${filterPath}`,
    );
  }

  public getQouteList(
    offset: number = 0,
    limit: number = 10,
    order: string = null,
    orderBy: string = null,
  ): Observable<GetQoutesListResponse> {
    const orderUrl = order
      ? `&orderByDirection=${order.toLocaleUpperCase()}`
      : '';
    const orderByUrl = orderBy ? `&orderByField=${orderBy}` : '';
    return this.httpClient.get<GetQoutesListResponse>(
      `${environment.api}/quotes?offset=${offset}&limit=${limit}${orderUrl}${orderByUrl}`,
    );
  }

  public offerrDiscount(data: {
    id: number;
    discount: number;
  }): Observable<QuoteDTO> {
    const { id, discount } = data;
    return this.httpClient.patch<QuoteDTO>(
      `${environment.api}/quotes/${id}/discount`,
      { discount },
    );
  }

  public get(id: string): Observable<OrderDTO> {
    let include =
      'include=pickLocation,deliveryLocation,receiver,sender,company,cars,createdBy,shipper,invite,inspections';
    const { roleId } = this.userService.user;
    if (roleId === ROLES_STATUS.SUPER_ADMIN) {
      include = `${include},dispatches`;
    }
    return this.httpClient.get<OrderDTO>(
      `${environment.api}/orders/${id}?${include}`,
    );
  }

  public getQoute(id: string): Observable<QuoteDTO> {
    return this.httpClient.get<QuoteDTO>(`${environment.api}/quotes/${id}`);
  }

  public getNotes(
    id: string,
  ): Observable<{ count: number; data: OrderNoteDTO[] }> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<{ count: number; data: OrderNoteDTO[] }>(
      `${environment.api}${path}/orders/${id}/notes`,
    );
  }

  public getNotesAdmin(
    id: string,
  ): Observable<{ count: number; data: OrderNoteDTO[] }> {
    return this.httpClient.get<{ count: number; data: OrderNoteDTO[] }>(
      `${environment.api}/order-note/${id}`,
    );
  }

  public getAttachments(
    id: string,
  ): Observable<{ count: number; data: OrderAttachmentDTO[] }> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<{ count: number; data: OrderAttachmentDTO[] }>(
      `${environment.api}${path}/orders/${id}/attachments`,
    );
  }

  public getAttachmentsAdmin(
    id: string,
  ): Observable<{ count: number; data: OrderAttachmentDTO[] }> {
    return this.httpClient.get<{ count: number; data: OrderAttachmentDTO[] }>(
      `${environment.api}/order-attachment/${id}`,
    );
  }

  public postAttachment(data: {
    orderId: number;
    path: string;
    displayName: string;
  }): Observable<OrderAttachmentDTO> {
    const { orderId, displayName, path } = data;
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderAttachmentDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/attachments`,
      { path, displayName },
    );
  }

  public deleteAttachment(orderId: number, id: number): Observable<SuccessDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.delete<SuccessDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/attachments/${id}`,
    );
  }

  public sendInvoice(
    orderId: string,
    data: { email: string; dueDate?: Date },
  ): Observable<SuccessDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<SuccessDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/send-invoice`,
      data,
    );
  }

  public getBOLLink(
    orderId: string,
  ): Observable<SuccessDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<SuccessDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/bol`,
    );
  }

  public getInvoiceLink(
    orderId: string,
  ): Observable<SuccessDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<SuccessDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/invoice`,
    );
  }

  public getReceiptLink(
    orderId: string,
  ): Observable<SuccessDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<SuccessDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/receipt`,
    );
  }

  public sendReceipt(
    orderId: string,
    data: { email: string },
  ): Observable<SuccessDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<SuccessDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/send-receipt`,
      data,
    );
  }

  public importOrderToTrip(file: File, tripId: string): Observable<OrderDTO> {
    const formData = new FormData();
    formData.append('order', file, file.name);
    return this.httpClient.post<OrderDTO>(
      `${environment.api}/company/me/trips/${tripId}/import`,
      formData,
    );
  }

  public importOrder(file: File): Observable<OrderDTO> {
    const formData = new FormData();
    formData.append('order', file, file.name);
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderDTO>(
      `${environment.api}${path}/orders/import`,
      formData,
    );
  }

  public sendBOL(orderId: number, data: { email: string }): Observable<OrderAttachmentDTO> {
    const { user } = this.userService;
    const pathApi = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderAttachmentDTO>(
      `${environment.api}${pathApi}/orders/${orderId}/send-bol`,
      data,
    );
  }

  public calculatePrice(
    data: CalculatePriceRequest,
  ): Observable<TempPriceEntity> {
    return this.httpClient.post<TempPriceEntity>(
      `${environment.api}/orders/calculate-price`,
      data,
    );
  }

  public action(id: string, action: string): Observable<OrderDTO> {
    return this.httpClient.post<OrderDTO>(
      `${environment.api}/orders/${id}/${action}`,
      {},
    );
  }

  public markAsPaid(id: string, paymentMethod: string): Observable<OrderDTO> {
    return this.httpClient.post<OrderDTO>(
      `${environment.api}/orders/${id}/mark-paid`,
      { paymentMethod },
    );
  }

  public actionOrder(id: string, action: string): Observable<OrderDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderDTO>(
      `${environment.api}${path}/orders/${id}/${action}`,
      {},
    );
  }

  public markPaidOrder(id: string, paymentMethod: string): Observable<OrderDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderDTO>(
      `${environment.api}${path}/orders/${id}/mark-paid`,
      { paymentMethod },
    );
  }

  public createNote(data: {
    orderId: number;
    note: string;
  }): Observable<OrderNoteDTO> {
    const { note, orderId } = data;
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderNoteDTO>(
      `${environment.api}${path}/orders/${orderId}/notes`,
      { note },
    );
  }

  public getTimeline(
    id: string,
  ): Observable<{ count: number; data: OrderTimelineDTO[] }> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.get<{ count: number; data: OrderTimelineDTO[] }>(
      `${environment.api}${path}/orders/${id}/timeline`,
    );
  }

  public getTimelineAdmin(
    id: string,
  ): Observable<{ count: number; data: OrderTimelineDTO[] }> {
    return this.httpClient.get<{ count: number; data: OrderTimelineDTO[] }>(
      `${environment.api}/order-timeline/${id}`,
    );
  }

  public patchAdmin(
    id: number,
    data: OrderCreateRequest,
    recalculate: boolean = false,
  ): Observable<OrderDTO> {
    const queryRecalcul = recalculate ? '?recalculate=true' : '';
    return this.httpClient.patch<OrderDTO>(
      `${environment.api}/orders/${id}${queryRecalcul}`,
      data,
    );
  }

  public patch(id: number, data: OrderCreateRequest): Observable<OrderDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.patch<OrderDTO>(
      `${environment.api}${path}/orders/${id}`,
      data,
    );
  }

  public publish(id: number, status: string): Observable<OrderDTO> {
    return this.httpClient.patch<OrderDTO>(
      `${environment.api}/orders/${id}/${status}`,
      {},
    );
  }

  public delete(id: number): Observable<SuccessDTO> {
    return this.httpClient.delete<SuccessDTO>(`${environment.api}/orders/${id}`);
  }

  public deleteOrder(id: number): Observable<SuccessDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.delete<SuccessDTO>(`${environment.api}${path}/orders/${id}`);
  }

  public create(data: OrderCreateRequest): Observable<OrderDTO> {
    return this.httpClient.post<OrderDTO>(`${environment.api}/order`, data);
  }

  public newPrice(data: { id: number; price: number }): Observable<OrderDTO> {
    return this.httpClient.post<OrderDTO>(
      `${environment.api}/order/price-offer`,
      data,
    );
  }

  public toFormatDate(date?: Date | string, format: string = this.formatDate) {
    return date ? moment(date).format(format) : moment().format(format);
  }

  public fullAddress(location: LocationDTO, necessary: boolean = false) {
    if (!location) {
      return '';
    }
    const { city, state, zipCode, address } = location;
    const { user } = this.userService;
    let full_address = location ? `${city}, ${state}, ${zipCode}` : '';
    if (
      (user && user.roleId && user.roleId === ROLES_STATUS.SUPER_ADMIN) ||
      necessary
    ) {
      full_address = `${address ? `${address},` : ''} ${full_address}`;
    }
    return full_address;
  }

  public cancleOrder(orderId: number): Observable<SuccessDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<SuccessDTO>(
      `${environment.api}${path}/orders/${orderId}/cancel`,
      {},
    );
  }

  public cancelLoadBoard(orderId: number): Observable<SuccessDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<SuccessDTO>(
      `${environment.api}${path}/load-board/${orderId}/cancel`,
      {},
    );
  }

  public createOrder(data: CreateOrderRequest): Observable<OrderDTO> {
    const { user } = this.userService;
    const path = user && user.roleId ? this.PATH[user.roleId] : this.PATH[2];
    return this.httpClient.post<OrderDTO>(
      `${environment.api}${path}/orders`,
      data,
    );
  }

  public formatStatus(status = '') {
    const statusReplace = status.replace(/_/g, ' ');
    return statusReplace.toUpperCase();
  }

  public formatStatusPayment(status = '') {
    if (status && status.length && status !== CLIENT_PAYMENT_STATUSES.NONE) {
      return [CLIENT_PAYMENT_STATUSES.CAR_PICKUP_PAID, CLIENT_PAYMENT_STATUSES.SERVICE_FEE_PAID].includes(status) ?
        'Payment Successful' : 'Payment Failed';
    }
    return null;
  }

  public formatPrice(price) {
    return price ? price.toFixed() : 0;
  }

  public formatPricePerMile(price) {
    return price ? price.toFixed(2) : 0;
  }

  public formatDistance(distance) {
    return distance ? distance.toFixed(2) : 0;
  }
}
