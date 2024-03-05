import { ORDER_STATUS } from '@/constants';
import { ICartInfoSaleModeConfig } from './cart';
import { GoodsInfoSkusComb } from './goods';
import { IDeliverAddr } from './settle';

interface IServeStatus {
  appId: string;
  pendingRefundAmount: string;
  goodsRefundableAmount: string;
  refundCostFrightAmount: string;
  payableAmount: string;
  goodsId: number;
  skuId: number;
  goodsRefundAmount: string;
  serveStatus: string;
  orderNo: string;
}
export interface IOrderInfoItems {
  appId: string;
  count: number;
  buyCount?: number;
  createdAt: Date;
  goodsAmount: string;
  goodsId: number;
  goodsInfo: {
    // 商品信息
    name: string; // 商品名
    comb: GoodsInfoSkusComb[]; // 规格参数
    image: string; // 商品主图
    skuBarCode: string; // 商品sku barcode
    goodsBarCode: string; // 商品 barcode
    goodsSn: string; // 商品sn
    skuSn: string; // 商品sku sn
  };
  id: number;
  logisticsId: number;
  logisticsType: number;
  memo: string; // 备注信息
  orderAmount: string;
  orderDiscountAmount: string;
  orderNo: string;
  payedPrice: string;
  point: number;
  totalPrice: string;
  mktPrice: string;
  payableAmount: string;
  promotionDiscountAmount: string;
  couponDiscountAmount: string;
  pointDiscountAmount: string;
  remark: string;
  skuId: number;
  source: string;
  updatedAt: Date;
  weight: string;
  serveStatus: IServeStatus;
  isReversible?: boolean; // 展示售后退款按钮
  discountDetails: { items: IDiscountDetailsItem[] };
}

export interface IOrderInfoGuide {
  name: string;
  phone: string;
  store: {
    id: number;
    name: string;
    type: string;
  };
}

export interface IParcelItems {
  appId: string;
  arrivedAt: Date;
  consignorId: number;
  createdAt: Date;
  id: number;
  items: { skuId: number; goodsId: number }[];
  logisticCode: string;
  logisticNo: string;
  logisticToken: string;
  orderNo: string;
  parcelNo: string;
  shippedAt: Date;
  state: string;
  synced: boolean;
  updatedAt: Date;
  userId: number;
  warehouseCode: string;
}
export interface IOrderInfo {
  bizCode: OrderBizCode;
  orderModeConfig: ICartInfoSaleModeConfig;
  orderDiscountAmount: string; // 订单折扣金额
  expirationTime: Date; // 订单创建时间
  orderNo: string;
  userId: number;
  memo: string; // 备注信息
  remark: string; // 卖家备注信息
  goodsAmount: string;
  orderAmount: string;
  promotionDiscountAmount: string; // 订单促销金额
  couponDiscountAmount: string; // 卡券促销金额
  promotionList: [
    {
      goodsInfos: [];
      promotionId: string;
    },
  ];
  couponList: [string];
  pointExchangeMoney: string;
  point: number;
  payablePoint: number;
  orderItems: IOrderInfoItems[];
  source: string;
  deliverAddr: IDeliverAddr;
  clientIp: string; // 下单Ip地址
  appId: string;
  orderType: number; // 订单类型
  logisticsType: string; // 0 无需物流，1 快递，2 到店
  costFreight: string;
  createTime: Date; // 订单创建时间
  children: [string];
  completeTime: Date; // 订单完成时间
  confirmTime: Date; // 确认收货时间
  createdAt: Date; // 订单系统创建订单时间
  deliverTime: Date; // 送达时间
  guaranteeDeliverTime: Date; // 送达时间
  id: number;
  orderStatusCode: string; // 订单业务状态码
  payCode: string; // 支付方法代码
  payStatus: number; // 支付状态
  payableAmount: string; // 支付金额
  payTime: Date; // 支付时间
  status: string;
  updatedAt: Date; // 订单修改时间
  orderModeCode: string; // 订单模式标识
  changeAmount: string; // 改价金额
  changeCostFreight: string; // 改价运费
  serveStatus: string; // 售后状态用作检索
  logisticsCode: string; // 物流Code
  logisticsNo: string; // 物流No
  logisticsId: number; // 关联物流id,不存在
  discountDetails: {
    // 优惠项详情
    items: IDiscountDetailsItem[];
  };
  storeCode: string; // 店铺Code
  guide: IOrderInfoGuide;
  generateRights: { type: string; value }[];
  parcelItems: IParcelItems[];
  commentStatus: OrderCommentStatus;
}
export interface IOrderListParams {
  page: number; // 页数
  perPage: number; // 每页数据条数
  source: string; // 订单来源
  orderNo: string; // 订单号
  serveStatus: string; // 售后状态 如 已取消, 退款完成,退款中等
  orderStatus: string; // 订单状态 number 待付款 , 1 待发货,2 待收货,3 已完成,4 取消,6 交易关闭
}

export interface IOrderListInfo {
  all: IOrderInfo[];
  [ORDER_STATUS.PENDING_PAID]: IOrderInfo[];
  [ORDER_STATUS.PENDING_SHIPMENT]: IOrderInfo[];
  [ORDER_STATUS.PENDING_RECEIPT]: IOrderInfo[];
}

export interface IWxPayParams {
  paid?: boolean; // 订单已支付
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign?: string;
}

export interface IGeneralInfo {
  pendingCommentCount: number;
  pendingPaidCount: number;
  pendingShipment: number;
  pendingReceipt: number;
  serving: number;
}

export interface IDelivery {
  delivery_id: string;
  delivery_name: string;
}

export enum TYPE_ICON {
  TICK = 'tick',
  ROUND = 'round',
}

export interface IRateList {
  title: string;
  name: string;
  value: number;
}

export interface IFileItem {
  status: string;
  uid: string;
  name: string;
  url: string;
  type: string;
  formData: FormData;
  cdnUrl?: string;
}

export enum OrderBizCode {
  Default = 'default',
  DrawLots = 'drawLots',
  GiftCard = 'giftCard',
  Point = 'point',
  FlashSale = 'flash',
}

export enum OrderCommentStatus {
  default = 'default',
  comment = 'comment',
  close = 'close',
}

export interface ICommentParamsItem {
  //评价项目
  goodsId: number; //goodsId
  skuId: number; //skuId
  productStar: number; //产品评分
  productPackagingStar: number; //产品包装评分
  customerServiceStar: number; //产品包装评分
  logisticsStar: number; //产品物流评分
  recommendationStar: number; //产品推荐度评分
}

export interface ICommentParams {
  orderNo: string; //订单No
  items: ICommentParamsItem[];
}

export interface IConversionList {
  list: IConversionItem[];
  total: number;
}

export interface IConversionItem {
  appId: string; //appId
  userId: number; //用户id
  orderNo: string; //上传的订单编号
  screenshot: string[]; //上传的订单截图
  auditStatus: number; // 审核状态 0未审核 1通过 2拒绝 Allowed: 0┃1┃2
  auditTime: string; //审核时间
  predictIntegral: number; //预计发放的积分
  refuseReason: string; //拒绝原因
  createdAt: string; //创建时间
  orderChannel: string; //订单渠道
  productName: string;
  orderAmount: string;
}

export enum EDiscountDetailsItemType {
  coupon = 'coupon',
}

export interface IDiscountDetailsItem {
  couponCode: string;
  discountAmount: string;
  identifier: string;
  influence: { skuId: number; goodsId: number; discountAmount: string; count: number }[];
  items: { skuId: number; goodsId: number; discountAmount: string; count: number; value: string }[];
  name: string;
  scope: string;
  type: EDiscountDetailsItemType;
  value: string;
}
