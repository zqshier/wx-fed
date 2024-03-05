import { GoodsInfoSkuConfigs, GoodsInfoSkus } from './goods';
import { IOrderInfo } from './order';

/** 积分信息 */
export interface IPointItem {
  id: number;
  changed: number; // 变更值
  channel: string; // 来源
  memo: string; // 备注
  sn: string; // 序列号
  type: 'credit' | 'debit';
  createdAt: Date;
}

// / 积分列表 /;
export interface IPointsList {
  total: number; // 总数量
  balance: number; //   积分余额
  list: IPointItem[];
  rule: {
    amount: number;
    points: number;
    limit: number;
  };
}

export interface IPointsParams {
  page?: number;
  perPage?: number;
  withoutList?: number; // 无需返回明细列表
}

export interface IPointsListParams {
  page: number;
  perPage: number;
}

export enum pointMallType {
  point = 'point',
  pointAndPrice = 'pointAndPrice ',
}

export enum pointMallTypeTargetType {
  goods = 'goods',
  coupon = 'coupon',
}

export interface IPointsGoodsInfo {
  image: string;
  promotion: string; //兑换类型 加价购或者纯积分
  pointMallType: pointMallType; //兑换类型 加价购或者纯积分
  pointMallTypeTargetType: pointMallTypeTargetType; // 兑换物品类型 卡券或者商品 Allowed: goods┃coupon
  goodsInfo: {
    //商品详情
    id: number; //商品id
    name: string; //商品名称
    type: number; // 商品类型, 0 实物, 1 优惠券Allowed: 0┃1
    saleStatus: number; //1 上架, 2 下架
    image: string; //主图
    price: number; //价格
    guidePrice: number; //划线价
    skuConfigs: GoodsInfoSkuConfigs[];
    skus: IPointsGoodsSkus[];
    extends: {
      releaseDate: Date; // 上市日期
      technology: string; // 工艺
      aftersales: { url: string }[];
    };
    images: string[]; // 商品图片
    video: {
      // 商品视频
      url: string; // 视频地址
      cover: string; // 视频封面
    };
    sn: string; // 商品编码
  };
  targetId: pointMallTypeTargetType; // 兑换物品IdAllowed: goods┃coupon
  group: string; //分组信息
  startTime: string; //开售时间
  displayStartTime: string; //开始展示时间
  booking: {
    //预约活动
    id: number; //预约活动ID
    booked: boolean; //本人是否已预约
    numbers: number; //预约人数
    templateIds: [string]; //订阅消息模板
    start: string; //预约开始时间
    sendAt: string; //通知发送时间
  };
  shareImage: string; // 分享图
  promotionId: string; // 积分商城活动Id
  jumpToDetail: boolean;
  disable: boolean;
}

export interface IPointsGoodsSkus extends GoodsInfoSkus {
  meta: {
    //附加元数据, 礼品卡: { "giftCardId": 1 }, 优惠券: { "couponCode": "czzxs30hrfx1" }
    giftCardId: number; //礼品卡ID，当商品类型为优惠券时有效
    couponCode: string; //优惠券编码，当商品类型为优惠券时有效
  };
  pointMallSaleData: {
    //积分兑换价格相关信息
    point: number; //所需积分数量
    price: number; //所需支付金额
    remainStock: number; //剩余库存
  };
}

export interface PointsGoodsSkusItem extends GoodsInfoSkus {
  pointMallSaleData: {
    //积分兑换价格相关信息
    point: number; //所需积分数量
    price: number; //所需支付金额
    remainStock: number; //剩余库存
  };
}

export interface IPointsGoodsList {
  list: IPointsGoodsInfo[];
  total: number;
}

export interface IPointsConfigs {
  groups: [
    {
      name: string;
      sort: number;
    },
  ]; //组相关配置
}

export enum posterSource {
  normalGoods = 'normalGoods',
  pointGoods = 'pointGoods',
}

export interface IPointGoodsExchangeInfo {
  total: number;
  list: IPointsGoodsInfo[];
}

export interface IPointGoodsExchange {
  promotionId: string; //活动id
  appId: string; //appid
  userId: number; //用户id
  title: string; //标题
  count: number; //数量
  targetId: string; //目标id
  targetType: 'order' | ' coupon'; // 目标类型
  image: string; //图片
  targetData: {
    //目标附加信息
  };
  orderInfo: IOrderInfo;
  logisticsId: number;
}
