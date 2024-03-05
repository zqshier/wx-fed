export enum OMS_CART_ERROR {
  // 商品未找到
  GOODS_NOT_FOUND = 'goods_not_found',
  // 商品下架
  GOODS_TAKE_DOWN = 'goods_take_down',
  // 库存不足
  GOODS_STOCK_OUT = 'goods_stock_out',
  // 销售方式不支持
  GOODS_SALE_MODE_ERROR = 'goods_salemode_error',
  // 购买数量超过上限
  GOODS_BUYING_COUNT_ERROR = 'goods_buying_count_error',
  // 活动限购
  OMS_SETTLE_PROMOTION_SKU_LIMIT = 'oms_settle_promotion_sku_limit',
  // 商品下架
  ORDER_GOODS_STATUS_ERROR = 'order_goods_status_error',
  // 商品限购
  OMS_SETTLE_GOODS_LIMIT = 'oms_settle_goods_limit',
  // 用户不能兑换
  POINT_MALL_USER_TAGS = 'point_mall_user_tags',
}

export const OMS_CART_ERROR_TEXT = {
  [OMS_CART_ERROR.GOODS_NOT_FOUND]: '下单失败，该商品不存在，请选择其他商品',
  [OMS_CART_ERROR.GOODS_TAKE_DOWN]: '下单失败，该商品不存在，请选择其他商品',
  [OMS_CART_ERROR.GOODS_STOCK_OUT]: '库存不足',
  [OMS_CART_ERROR.GOODS_SALE_MODE_ERROR]: '销售方式不支持',
  [OMS_CART_ERROR.GOODS_BUYING_COUNT_ERROR]: '单商品最多加入购物车99件哦',
  [OMS_CART_ERROR.OMS_SETTLE_PROMOTION_SKU_LIMIT]: '下单失败，该商品已达到购买限制',
  [OMS_CART_ERROR.ORDER_GOODS_STATUS_ERROR]: '下单失败，该商品不存在，请选择其他商品',
  [OMS_CART_ERROR.OMS_SETTLE_GOODS_LIMIT]: '下单失败，该商品已达到购买限制',
  [OMS_CART_ERROR.POINT_MALL_USER_TAGS]: '网络异常，连接超时',
} as const;

export enum PERSETTLE_CHECKITEM_TYPE {
  // 商品限购
  GOODS_LIMIT = 'goods_limit',
  OMS_SETTLE_GOODS_LIMIT = 'oms_settle_goods_limit',
  // 活动限购
  PROMOTION_SKU_LIMIT = 'promotion_sku_limit',
  // 库存限制
  SKU_STOCK_OUT = 'sku_stock_out',
  // 活动限购
  OMS_SETTLE_PROMOTION_SKU_LIMIT = 'oms_settle_promotion_sku_limit',
  // 商品状态异常 已经被下架 或者 被删除
  ORDER_GOODS_STATUS_ERROR = 'order_goods_status_error',
  // 库存
  GOODS_STOCK_OUT = 'goods_stock_out',
  // 活动失效
  OMS_SETTLE_PROMOTION_NOT_FOUND = 'oms_settle_promotion_not_found',
  // 活动失效
  OMS_SETTLE_PROMOTION_NOT_VALID = 'oms_settle_promotion_not_valid',
  // 活动库存不在
  OMS_SETTLE_PROMOTION_STOCK_OUT = 'oms_settle_promotion_stock_out',
}

export const PERSETTLE_CHECKITEM_TYPE_TEXT = {
  [PERSETTLE_CHECKITEM_TYPE.GOODS_LIMIT]: '下单失败，该商品已达到购买限制',
  [PERSETTLE_CHECKITEM_TYPE.OMS_SETTLE_GOODS_LIMIT]: '下单失败，该商品已达到购买限制',
  [PERSETTLE_CHECKITEM_TYPE.PROMOTION_SKU_LIMIT]: '下单失败，该商品已达到购买限制',
  [PERSETTLE_CHECKITEM_TYPE.SKU_STOCK_OUT]: '购买数量已达上限，下单失败',
  [PERSETTLE_CHECKITEM_TYPE.OMS_SETTLE_PROMOTION_SKU_LIMIT]: '下单失败，该商品已达到购买限制',
  [PERSETTLE_CHECKITEM_TYPE.ORDER_GOODS_STATUS_ERROR]: '下单失败，该商品不存在，请选择其他商品',
  [PERSETTLE_CHECKITEM_TYPE.GOODS_STOCK_OUT]: '购买数量已达上限，下单失败',
  [PERSETTLE_CHECKITEM_TYPE.OMS_SETTLE_PROMOTION_NOT_FOUND]: '下单失败，该商品不存在，请选择其他商品',
  [PERSETTLE_CHECKITEM_TYPE.OMS_SETTLE_PROMOTION_NOT_VALID]: '下单失败，该商品不存在，请选择其他商品',
  [PERSETTLE_CHECKITEM_TYPE.OMS_SETTLE_PROMOTION_STOCK_OUT]: '活动库存不足',
} as const;
