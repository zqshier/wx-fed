import { GoodsInfoSkusComb } from './goods';
import { IOrderInfoGuide, IOrderInfoItems } from './order';
export interface IAftersalesListParams {
  page: number; // 页数
  perPage: number; // 每页数据条数
}

export enum ActionType {
  /** 填写地址 */
  FILL_SHIPMENT = 'fill_shipment',
  /** 售后单创建 */
  CREATE = 'create',
  /** 拒绝退款  */
  REFUSE = 'refuse',
  /** 同意退款 */
  APPROVE = 'approve',
  /** 售后单创建 */
  DIRECT_REFUND = 'direct_refund',
  /** 拒绝退货收货 */
  REJECT_SHIPMENT = 'reject_shipment',
  /** 接受退货收货 */
  ACCEPT_SHIPMENT = 'accept_shipment',
  /** 取消售后单 */
  CANCEL = 'cancel',
  /** 退款到账 */
  REFUND_SUCCESS = 'refund_success',
}

export enum AfterSaleOperatorType {
  /** 后台管理人员 */
  MANAGER = 'manager',
  /** 用户 */
  USER = 'user',
  /** 导购 */
  GUIDE = 'guide',
  /** 系统 */
  SYSTEM = 'system',
}
export interface IAftersalesInfoLogs {
  createdAt: Date; // 创建时间
  action: ActionType;
  operatorType: AfterSaleOperatorType;
}
export interface IAftersalesInfo {
  totalRefundAmount: string; // 退款总金额
  isDelivery: boolean; // 是否进入退款发货
  fillUpTime: Date; // 退款物流填写时间
  id: number;
  appId: string;
  afterSaleNo: string; // 退款单号
  orderNo: string; // 订单号
  userId: number;
  refundGoodsAmount: string; // 退款金额
  reason: string; // 退款原因
  goodsInfo: {
    // 商品信息
    name: string; // 商品名
    comb: GoodsInfoSkusComb[]; // 规格参数
    image: string; // 商品主图
  };
  remark: string; // 退款备注
  goodsId: number; // 退款物品Id
  skuId: number;
  refundCostFright: string;
  status: string; // 售后单状态
  type: string; // 售后单类型
  count: number; // 售后数量
  logs: IAftersalesInfoLogs[]; // 协商详情
  logisticCode: string;
  logisticNo: string;
  createdAt: Date;
  updatedAt: Date;
  orderItem: IOrderInfoItems;
  guide: IOrderInfoGuide;
  refuseRemark: string; // 退款备注
  extendInfo?: {
    // 发起退款扩展字段
    images: string[]; //图片;
    description: string;
  };
}

export interface IReturnableItems {
  payableAmount: string; //可退总额
  goodsRefundAmount: string; //商品已退金额
  pendingRefundAmount: string; //待退款金额
  goodsRefundableAmount: string; //商品可退金额
  refundCostFrightAmount: string; //运费已退金额
  serveStatus: string; //售后状态 售后中 serving 退款完成 close 不存在状态 noserving
  skuId: number; //skuId
  goodsId: number; //goodsId
  orderNo: string; //orderNo
}

export interface IReturnableInfo {
  orderNo: string; //订单号
  //商品项状态
  items: IReturnableItems[];
  costFrightRefundableAmount: string; //运费
}

export enum RefundType {
  /** 仅退款 */
  MONEY_ONLY = 'money_only',
  /** 退货退款 */
  MONEY_GOODS = 'money_goods',
  /** 主动退款 */
  INITIATIVE = 'initiative',
}

export interface IInitiateAfterItem {
  goodsId: number; //商品Id
  skuId: number; //SkuId
  //退款金额
  refundGoodsAmount: {};
}

export interface IInitiateAfterParams {
  orderNo: string; //订单号
  reason: string; //退款原因
  type: string; //仅退款 1 退货退款 2 ⤵
  //发起退款扩展字段
  extendInfo: {
    images: string[]; //图片
    description: string;
  };
  //批量退款项目和金额
  items: IInitiateAfterItem[];
}

export interface IFillLogisticInfoParams {
  afterSaleNo: string; // 售后单号
  logisticCode: string; // 物流Code
  logisticNo: string; // 物流No
}

export interface IUploadOrderParams {
  orderChannel: string; //订单渠道
  orderNo: string; //上传的订单编号
  screenshot: string[]; //上传的订单截图
  productName?: string;
  orderAmount?: string | null;
}

export interface IUploadOrderConfig {
  appId: string; //appId
  image: string; //活动头图
  explainImage: [
    {
      id: number;
      url: string;
    },
  ]; //转化说明图
  shareImage: string; //活动分享图
  status: boolean; //是否上架
}
