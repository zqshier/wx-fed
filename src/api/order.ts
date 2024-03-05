import { IAftersalesListParams, IUploadOrderConfig, IUploadOrderParams } from '@/dto/aftersales';
import { ICommentParams, IConversionList, IGeneralInfo, IOrderInfo, IOrderListParams, IWxPayParams } from '@/dto/order';
import { get, post, put } from '@/utils/http';

enum Api {
  list = '/api/orders/list',
  detail = '/api/orders/detail',
  cancel = '/api/orders/cancel',
  charge = '/api/orders/charge',
  generalInfo = '/api/orders/generalInfo',
  paycheck = '/api/orders/paycheck',
  comment = '/api/order/comment',
  /** 转化记录 */
  conversion = '/api/conversion/record-list',
  /** 上传订单 */
  uploadOrder = '/api/conversion/upload-order',
  /** 订单转化配置 */
  uploadOrderConfig = '/api/conversion/config',
}

export const getOrdersListApi = async (data: IOrderListParams) =>
  get<{ list: IOrderInfo[]; total: number }>({ url: Api.list, params: data });

export const getOrdersDetailApi = async (orderNo: string) =>
  get<IOrderInfo>({ url: `${Api.detail}?orderNo=${orderNo}` });

export const getOrdersCancelApi = async (data: { orderNo: string; cancelMemo: string }) =>
  put({ url: Api.cancel, data });
export const getOrderChargelApi = async (orderNo: string) => post<IWxPayParams>({ url: Api.charge, data: { orderNo } });
export const getGeneralInfoApi = async () => get<IGeneralInfo>({ url: Api.generalInfo });

/** 通知服务端立即查询支付状态 */
export const checkOrderPayState = async (orderNo: string) => post({ url: Api.paycheck, data: { orderNo } });

export const getCommentApi = async (orderNo: string) => get<IOrderInfo>({ url: `${Api.comment}/${orderNo}` });

export const commentApi = async data => post<ICommentParams>({ url: Api.comment, data });

export const conversionList = async (data: IAftersalesListParams) =>
  get<IConversionList>({ url: Api.conversion, params: data });

export const uploadOrderApi = async (data: IUploadOrderParams) => post({ url: Api.uploadOrder, data });

export const uploadOrderConfigApi = async () => get<IUploadOrderConfig>({ url: Api.uploadOrderConfig });
