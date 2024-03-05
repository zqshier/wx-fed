import { get, post, put } from '@/utils/http';
import {
  IAftersalesListParams,
  IAftersalesInfo,
  IReturnableInfo,
  IInitiateAfterParams,
  IFillLogisticInfoParams,
} from '@/dto/aftersales';

enum Api {
  list = '/api/aftersales/list',
  detail = '/api/aftersales/detail',
  returnable = '/api/aftersales/itemStatus',
  create = '/api/aftersales/create',
  cancel = '/api/aftersales/cancel',
  fillLogisticInfo = '/api/aftersales/fillLogisticInfo',
}

export const getAftersalesListApi = async (data: IAftersalesListParams) =>
  get<{ list: IAftersalesInfo[]; total: number }>({ url: Api.list, params: data });

export const getAftersalesDetailApi = async (afterSaleNo: string) =>
  get<IAftersalesInfo>({ url: `${Api.detail}/${afterSaleNo}` });

export const getItemStatus = async (orderNo: string) => get<IReturnableInfo>({ url: `${Api.returnable}/${orderNo}` });

export const applyRefund = async (data: IInitiateAfterParams) => post({ url: `${Api.create}`, data });

export const aftersalesCancel = async (id: string) => put({ url: `${Api.cancel}/${id}`, params: { id } });

export const fillLogisticInfo = async (data: IFillLogisticInfoParams) => post({ url: `${Api.fillLogisticInfo}`, data });
