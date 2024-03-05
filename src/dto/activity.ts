/** 活动商品 */
export interface IActGoodsItem {
  /** 商品id */
  id: number;
  /** 商品名称 */
  name: string;
  /** 商品类型, 0 实物, 1 优惠券 */
  type: string;
  /** 价格 */
  price: string;
  /** 划线价 */
  guidePrice: string;
  /** 1 上架, 2 下架 */
  saleStatus: number;
  /** 封面图 */
  image: string;
  /** 主图列表 */
  images: {
    id: number;
    url: string;
    thumb?: string;
  }[];
}

export interface IActPromotionInfo {
  appId: string;
  promotionId: string;
  startTime: Date;
  endTime: Date;
  name: string;
  priceAlias: string;
  allowCouponUse: boolean;
}

/** 商品组 */
export interface IActGoods {
  list: IActGoodsItem[];
  promotionInfo: IActPromotionInfo;
  total: number;
}

export interface IActListItem {
  id: number; //主键ID
  appId: string; //appId
  title: string; //活动名称
  start: string; //开始时间
  end: string; //结束时间
  image: string; //活动封面图
  state: number; //活动状态 0 未开始, 1 进行中, 2 已结束
}

export interface IActList {
  list: IActListItem[];
  total: number;
}

export interface IActInfo {
  detail: {
    //活动详情
    id: number; //主键ID
    appId: string; //appId
    title: string; //活动名称
    start: string; //开始时间
    end: string; //结束时间
    image: string; //活动封面图
    mainImage: [string]; //活动详情主图
    detailImage: [string]; //活动详情图
    shareImage: string; //活动分享图
    createdAt: string; //创建时间
    updatedAt: string; //更新时间
  };
  userRecord: {
    name: string; //姓名
    gender: number; // 性别, 0 女|1 男|2 未知Allowed: 0┃1┃2
    province: string; //省
    city: string; //市
    district: string; //区
    address: string; //详细地址
    createdAt: string; //创建时间
  };
  isSubscribe: boolean; //是否订阅
  isSignUp: boolean; //是否报名
}

export interface ISignUp {
  activityId: number; //活动id
  name: string; //姓名
  gender: number; //性别, 0 女|1 男|2 未知
  province: string; //省
  city: string; //市
  district: string; //区
  address: string; //详细地址
}

export interface IActSub {
  activityId: number; //活动id
  templateId: string; //模板ID
}
