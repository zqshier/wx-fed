import { GoodsInfoSkusComb, IGoodsAct } from './goods';
export interface IAddCartParams {
  goodsId: number;
  skuId: number;
  count: number;
  selectPromotion: string;
}

export interface ICartInfoSaleModeConfig {
  // 销售配置
  payment: number; // 0 全款, 1 比例, 3 定金
  value: number; // 按比例或者按定金支付的值, 比例: 1-99, 定金: 不超过商品价格
  prepayTimeEnd: Date; // 预付结束时间
  finalPayTimeStart: Date; // 尾款开始时间
  finalPayTimeEnd: Date; // 尾款结束时间
  deliveryType: number; // 发货时间类型, 0 固定时间 | 1 尾款X天后 ⤵
  deliveryValue: number; // 发货时间, 时间戳(秒)或天数
}

export interface ICartInfoItems {
  id: number; // id
  goodsId: number; // 商品id
  skuId: number; // skuId
  totalPrice: string; // 价格
  mktPrice: string; // 单价
  estimatePrice: string; // 预估价格
  goodsInfo: {
    // 商品信息
    name: string; // 商品名
    comb: GoodsInfoSkusComb[]; // 规格参数
    image: string; // 商品主图
    barcode: string; // 商品sku barcode
    goodsSn: string; // 商品sn
    skuSn: string; // 商品sku sn
  };
  buyCount: number; // 数量
  stockOut: boolean; // 库存是否耗尽
  saleStatus: number; // 销售状态 1销售中 2已下架
  onSaleAt: Date | string; // 开售时间
  selected: boolean; // 是否选中
  saleModeConfig: ICartInfoSaleModeConfig; // 销售配置
  saleMode: number; // 现货模式或预售模式
  disabled: boolean; // 是否可用
  availablePromotions: IGoodsAct[]; // 参与活动信息
  selectPromotion: string; // 参与活动ID
}

export interface ICartInfoItemsAdd {
  /** 一口价价格别名 */
  actPriceAlias?: string;
  /** 一口价价格 */
  actPrice?: string;
  /** 一口价名称 */
  actName?: string;
  countDownTime?: Date;
}

export interface ICartInfo {
  items: ICartInfoItems[]; // 商品列表
  couponDiscountAmount: string; // 优惠券优惠金额
  // promotionDiscountAmount: string; // 优惠活动优惠金额
  goodsAmount: string; // 商品总额
  orderAmount: string; // 合计价格
  payableAmount: string; // 支付价格
  couponCodes: string[]; // 优惠券列表
  couponUsableList: string[]; // 可用优惠券列表
  promotions: string[]; // 活动列表
  costFreight: string; // 运费
  pointExchangeMoney: string; // 积分抵扣金额
  promotionDiscountAmount: string; // 活动立减金额
  point: number; // 使用积分抵扣数
  discountDetails: {
    // 优惠项详情
    items: string[];
  };
  districtCheck: boolean;
}

export interface ISelectCartParams {
  ids: number[];
  select: boolean;
}

export interface IUpdateItemCountParams {
  id: number;
  count: number;
  selectPromotion: string;
}

export interface IUpdateSkuParams {
  goodsId: number;
  skuId: number;
  count: number;
  id: number;
}
