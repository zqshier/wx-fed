import { RefundType } from '@/dto/aftersales';
import { OrderBizCode } from '@/dto/order';

export enum ORDER_STATUS {
  /** 待付款 */
  PENDING_PAID = 'pending_paid',
  /** 待发货 */
  PENDING_SHIPMENT = 'pending_shipment',
  /** 待收货 */
  PENDING_RECEIPT = 'pending_receipt',
  /** 待评价 */
  PENDING_COMMENT = 'pending_comment',
  /** 已完成 */
  COMPLETED = 'completed',
  /** 取消 用户取消或者超时取消 */
  CANCELED = 'canceled',
  /** 交易关闭 全部退款情况 */
  CLOSED = 'closed',
}

export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING_PAID]: '待付款',
  [ORDER_STATUS.PENDING_SHIPMENT]: '待发货',
  [ORDER_STATUS.PENDING_RECEIPT]: '待收货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELED]: '已取消',
  [ORDER_STATUS.CLOSED]: '交易关闭',
} as const;

export enum SERVE_STATUS {
  // 售后中
  SERVING = 'serving',
  // 退款完成
  CLOSE = 'close',
  // 默认状态
  NO_SERVING = 'noserving',
  DEFAULT = 'default',
}

export const SERVE_STATUS_TEXT = {
  [SERVE_STATUS.SERVING]: '退款中',
  [SERVE_STATUS.CLOSE]: '已退款',
  [SERVE_STATUS.NO_SERVING]: '',
  [SERVE_STATUS.DEFAULT]: '',
} as const;

export enum ORDER_STOCK_ERROR {
  // 购买物品不存在
  ORDER_NO_GOODS = 'order_no_goods',
  // 收货地址不存在
  DELIVERY_ADDRESS_NOT_EXIST = 'delivery_address_not_exist',
  // 券不存在
  ORDER_COUPON_NOT_FOUND = 'order_coupon_not_found',
  // 商品状态异常 已经被下架 或者 被删除
  ORDER_GOODS_STATUS_ERROR = 'order_goods_status_error',
  // 库存不足
  ORDER_STOCK_ERROR = 'order_stock_error',
  // 不是销售时间
  ORDER_SALE_AT_INACTIVE_ERROR = 'order_sale_at_inactive_error',
  // 积分不足
  ORDER_POINT_NOT_ENOUGH = 'order_point_not_enough',
  // 库存不足
  GOODS_STOCK_OUT = 'goods_stock_out',
  // 收货地址不支持
  DELIVERY_ADDRESS_NOT_SUPPORT = 'delivery_address_not_support',
}

export const ORDER_STOCK_ERROR_TEXT = {
  [ORDER_STOCK_ERROR.ORDER_NO_GOODS]: '购买物品不存在',
  [ORDER_STOCK_ERROR.DELIVERY_ADDRESS_NOT_EXIST]: '收货地址不存在',
  [ORDER_STOCK_ERROR.ORDER_COUPON_NOT_FOUND]: '券不存在',
  [ORDER_STOCK_ERROR.ORDER_GOODS_STATUS_ERROR]: '订单有商品已下架',
  [ORDER_STOCK_ERROR.ORDER_STOCK_ERROR]: '库存不足',
  [ORDER_STOCK_ERROR.ORDER_SALE_AT_INACTIVE_ERROR]: '不是销售时间',
  [ORDER_STOCK_ERROR.ORDER_POINT_NOT_ENOUGH]: '积分不足',
  [ORDER_STOCK_ERROR.DELIVERY_ADDRESS_NOT_SUPPORT]: '该地区不支持配送',
} as const;

export enum AFTER_SALE_STATUS {
  /**等待处理 */
  PENDING = 'pending',
  /** 拒绝 */
  REFUSE = 'refuse',
  /** 无用 */
  APPROVE = 'approve',
  /** 等待填写物流 */
  PENDING_FILL_UP_LOGISTIC = 'pending_fill_up_logistic',
  /** 等待物流寄回 */
  PENDING_SHIPMENT = 'pending_shipment',
  /** 等待三方支付退款 */
  REFUND_PENDING = 'refund_pending',
  /** 退款成功 */
  REFUND_SUCCESS = 'refund_success',
  /** 关闭(用户取消) */
  CLOSE = 'close',
}

export const AFTER_SALE_REFUND_TEXT = {
  [RefundType.MONEY_ONLY]: '仅退款',
  [RefundType.MONEY_GOODS]: '退货退款',
  [RefundType.INITIATIVE]: '主动退款',
};

export const AFTER_SALE_STATUS_MONEY_ONLY_TEXT = {
  [AFTER_SALE_STATUS.PENDING]: '退款处理中', // 等待商家处理申请
  [AFTER_SALE_STATUS.REFUSE]: '拒绝退款', // 后台拒绝理由 / 该商品无法二次销售
  [AFTER_SALE_STATUS.REFUND_PENDING]: '退款中', // 已同意退款,退款处理中
  [AFTER_SALE_STATUS.REFUND_SUCCESS]: '退款成功', // 退款金额已原路返回到您的账户
  [AFTER_SALE_STATUS.CLOSE]: '已取消', // 已取消
};

export const AFTER_SALE_STATUS_MONEY_GOODS_TEXT = {
  [AFTER_SALE_STATUS.PENDING]: '退款申请待处理', // 无
  [AFTER_SALE_STATUS.REFUSE]: '拒绝退款申请待买家处理', // 后台拒绝理由 / 该商品无法二次销售
  [AFTER_SALE_STATUS.APPROVE]: '审核中',
  [AFTER_SALE_STATUS.PENDING_FILL_UP_LOGISTIC]: '同意退款申请待买家退货', // 规定时间内示提交物流单号将自动拒绝退款申请
  [AFTER_SALE_STATUS.PENDING_SHIPMENT]: '买家已退货待确认收货', // 无
  [AFTER_SALE_STATUS.REFUND_PENDING]: '退款中', // 已同意退款,退款处理中
  [AFTER_SALE_STATUS.REFUND_SUCCESS]: '退款成功', // 退款金额已原路返回到您的账户
  [AFTER_SALE_STATUS.CLOSE]: '已取消', // 后台拒绝理由 / 该商品无法二次销售
};

export enum AFTER_SALE_ERROR {
  // 已经存在正在进行的售后单
  GOODS_ORDER_EXIST = 'goods_order_exist',
  // 已退过运费
  REFUND_COST_FREIGHT_EXIST = 'refund_cost_freight_exist',
  // 退款金额超过可退金额
  GREATER_THAN_REMAIN_AMOUNT = 'greater_than_remain_amount',
  // 售后单状态异常
  AFTERSALE_ORDER_STATUS_ERROR = 'aftersale_order_status_error',
  // 售后单不存在
  ORDER_NOT_FOUND = 'order_not_found',
  // 售后单不存在
  AFTERSALE_NOT_FOUND = 'aftersale_not_found',
  // 已经填写过退款物流
  AFTERSALE_ALREADY_FILL_LOGISTIC = 'aftersale_already_fill_logistic',
  // 已存在退款单
  AFTERSALE_ITEM_EXISTS = 'aftersale_item_exists',
  // 超过退款时间
  AFTERSALE_OVER_AFTERSALE_DAYS = 'aftersale_over_aftersale_days',
}

export const AFTER_SALE_ERROR_TEXT = {
  [AFTER_SALE_ERROR.GOODS_ORDER_EXIST]: '已经存在正在进行的售后单',
  [AFTER_SALE_ERROR.REFUND_COST_FREIGHT_EXIST]: '已退过运费',
  [AFTER_SALE_ERROR.GREATER_THAN_REMAIN_AMOUNT]: '退款金额超过可退金额',
  [AFTER_SALE_ERROR.AFTERSALE_ORDER_STATUS_ERROR]: '售后单状态异常',
  [AFTER_SALE_ERROR.ORDER_NOT_FOUND]: '售后单不存在',
  [AFTER_SALE_ERROR.AFTERSALE_NOT_FOUND]: '售后单不存在',
  [AFTER_SALE_ERROR.AFTERSALE_ALREADY_FILL_LOGISTIC]: '已经填写过退款物流',
  [AFTER_SALE_ERROR.AFTERSALE_ITEM_EXISTS]: '已存在退款单',
  [AFTER_SALE_ERROR.AFTERSALE_OVER_AFTERSALE_DAYS]: '超过退款时间',
};

export const ORDER_BIZ_CODE_TEXT = {
  [OrderBizCode.Default]: '普通订单',
  [OrderBizCode.DrawLots]: '抽签订单',
  [OrderBizCode.FlashSale]: '秒杀订单',
  [OrderBizCode.GiftCard]: '礼品卡订单',
  [OrderBizCode.Point]: '积分订单',
};
export const AFTER_SALE_STATUS_TIPS = {
  [AFTER_SALE_STATUS.PENDING]: '等待商家处理申请',
  [AFTER_SALE_STATUS.PENDING_FILL_UP_LOGISTIC]: '同意退款申请待买家退货',
  [AFTER_SALE_STATUS.REFUND_PENDING]: '已同意退款，退款处理中',
  [AFTER_SALE_STATUS.REFUND_SUCCESS]: '退款金额已原路返回到您的账户',
  [AFTER_SALE_STATUS.REFUSE]: '退款金额已原路返回到您的账户',
};

export const LINK_FLOW_ORDER_STATUS = {
  [ORDER_STATUS.PENDING_PAID]: 'WAIT_BUYER_PAY',
  [ORDER_STATUS.PENDING_SHIPMENT]: 'WAIT_SELLER_SEND_GOODS',
  [ORDER_STATUS.PENDING_RECEIPT]: 'WAIT_BUYER_CONFIRM_GOODS',
  [ORDER_STATUS.COMPLETED]: 'TRADE_SUCCESS',
  [ORDER_STATUS.CANCELED]: 'TRADE_CLOSED',
  [ORDER_STATUS.CLOSED]: 'TRADE_CLOSED_ALL_REFUND',
};
