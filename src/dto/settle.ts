import { ICartInfo } from './cart';
export interface ISettleInfo extends ICartInfo {
  maximumPoint: number; // 可用最大值
}
export interface IDeliverAddr {
  name: string;
  phone: string;
  provinceName: string; // 省
  cityName: string; // 市
  districtName: string; // 区
  zipcode: string; // 邮政编码
  districtCode: string; // 地址邮政编码
  address: string; // 详细地址
  default?: boolean; // 默认
}

export interface ISettleBuyNowParams {
  goodsId: number;
  skuId: number;
  count: number;
  couponCodes: string[]; // 优惠券Id
  couponUsed: boolean; // 是否使用, 为ture coupon数组为空时自动选择最佳, 为false时不使用任何优惠券
  point?: number;
  deliverAddr?: IDeliverAddr;
}

export interface ISettleCartParams {
  couponCodes: string[]; // 优惠券Id
  couponUsed: boolean; // 是否使用, 为ture coupon数组为空时自动选择最佳, 为false时不使用任何优惠券
  point: number;
  deliverAddr?: IDeliverAddr;
}

export interface ISettleParams {
  items: IPresettleParamsItems[];
  couponCodes: string[]; // 优惠券Id
  promotions: IPromotionsParamsItems[];
  couponUsed: boolean; // 是否使用, 为ture coupon数组为空时自动选择最佳, 为false时不使用任何优惠券
  point: number;
  settleCartMode: number | string; // 结算模式 0 购物车, 1 立即购买 point: 积分兑换
  deliverAddr?: IDeliverAddr;
}

export interface ISettleCommitOrderParams {
  items: IPresettleParamsItems[];
  promotions: IPromotionsParamsItems[];
  couponCodes: string[]; // 优惠券Id
  couponUsed: boolean; // 是否使用, 为ture coupon数组为空时自动选择最佳, 为false时不使用任何优惠券
  point: number;
  addressId?: number; // 可选 地址Id 店面
  memo: string; // 备注
  settleCartMode: number | string; // 结算模式 0 购物车, 1 立即购买 point: 积分兑换
  deliverAddr?: IDeliverAddr;
}

export interface IPresettleParamsItems {
  skuId: number;
  goodsId: number;
  count: number;
  selectPromotion: string;
}

export interface IPromotionsGoodsItems {
  count: number; //购买数量
  skuId: number; //skuId
  goodsId: number; //goodsId
}

export interface IPromotionsParamsItems {
  promotionId: string;
  goodsInfos: IPromotionsGoodsItems[];
}

export interface IPresettleParams {
  items: IPresettleParamsItems[];
  promotions: IPromotionsParamsItems[];
  deliverAddr?: IDeliverAddr;
  couponCodes: string[]; // 优惠券Id
  settleCartMode: number | string; // 结算模式 0 购物车, 1 立即购买
  couponUsed: boolean; // 是否使用, 为ture coupon数组为空时自动选择最佳, 为false时不使用任何优惠券
  point: number;
}

export interface IPresettleInfo {
  goodsId: number;
  type: string;
  skuId: number;
  limit: number;
  buyCount: number;
}

export interface IPaySubscribeParams {
  orderNo: string; //订单编号
  templateId: string; //模板ID
}

export enum FINISH_TYPE {
  orderDetails = 'orderDetails',
  aftersales = 'aftersales',
  pointGoodsDetail = 'pointGoodsDetail',
}

export enum FINISH_TYPE_URL {
  orderDetails = '/packageA/pages/order/orderDetails/orderDetails',
  aftersales = '/packageA/pages/order/aftersales/aftersales',
  pointGoodsDetail = '/packageA/pages/pointOrderList/pointOrderList',
}

export interface ICouponList {
  getCanClaimCouponList: ICouponListInfo[];
  couponList: ICouponListInfo[];
}

export interface ICouponListInfo {
  id: number;
  appId: string;
  code: string;
  name: string;
  type: string;
  value: string;
  threshold: string;
  stock: number;
  itemId: number;
  expiration: {
    days: number;
    after: number;
    __type: string;
  };
  condition: {
    type: string;
    skuIds: [];
    itemIds: [];
    catalogIds: [];
  };
  rules: string;
  disabled: boolean;
  thirdParty: boolean;
  limit: number;
  limitConfig: {};
  userCanGet: true;
  createdAt: string;
  updatedAt: string;
  typeName: string;
  sent: number;
  used: number;
  userState?: number;
}

export interface ISettleCouponListParams {
  settleParams: ISettleParams;
}
