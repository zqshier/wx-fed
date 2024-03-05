import { IOrderInfo } from '@/dto/order';
import {
  ICouponList,
  IPaySubscribeParams,
  IPresettleInfo,
  IPresettleParams,
  ISettleCommitOrderParams,
  ISettleCouponListParams,
  ISettleInfo,
  ISettleParams,
} from '@/dto/settle';
import { post } from '@/utils/http';

enum Api {
  /** 直接购买结算 */
  // buyNow = '/api/settle/buyNow',
  /** 购物车结算 */
  // cart = '/api/settle/cart',
  /** 用户下单 */
  commitOrder = '/api/v2/settle/commit_order',
  /** 预结算 */
  presettle = '/api/v2/settle/presettle',
  /** 结算 */
  settle = '/api/v2/settle',
  /** 待付款订阅通知 */
  subscriptions = '/api/orders/subscriptions',
  /** 结算优惠券列表 */
  couponList = '/api/v2/settle/couponList',
}

// export const getSettleBuyNowApi = async (data: ISettleBuyNowParams) => post<ISettleInfo>({ url: Api.buyNow, data });
// export const getSettleCartApi = async (data: ISettleCartParams) => post<ISettleInfo>({ url: Api.cart, data });
export const getSettleCommitOrderApi = async (data: ISettleCommitOrderParams) =>
  post<IOrderInfo>({ url: Api.commitOrder, data });

export const getPresettleApi = async (data: IPresettleParams) =>
  post<{ item: IPresettleInfo[] }>({ url: Api.presettle, data });

export const getSettleApi = async (data: ISettleParams) => post<ISettleInfo>({ url: Api.settle, data });

export const paySubscribe = async (data: IPaySubscribeParams) => post<ISettleInfo>({ url: Api.subscriptions, data });

export const getSettleCouponList = async (data: ISettleCouponListParams) =>
  post<ICouponList>({ url: Api.couponList, data });
