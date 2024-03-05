export interface GoodsListParams {
  page: number; // 第几页
  perPage: number; // 每页数据条数
  catalogId: number; // 分类ID
  sort: string; // '' | 'price-asc' | 'price-desc';
  ids?: Array<string> | string; // 指定IDs
}

export interface GoodsSearchParams {
  page: number; // 第几页
  perPage: number; // 每页数据条数
  q: string; // 关键词搜索
  sort?: string; // 默认按推荐排序, price-asc 价格从低到高, price-desc 价格从高到低
  catalogIds?: Array<number>; // 分类ID
  properties?: string | Array<string>; // 参数筛选, 格式: 参数名:参数值, 支持多个
  priceRange?: string | Array<string>; // 价格区间
  finished?: boolean; // 是否加载完成
}

export interface GoodsListInfo {
  id: number; // 商品ID
  name: string; // 商品名称
  type: number; // 商品类型, 0 实物, 1 优惠券
  saleStatus: number; // 1 上架, 2 下架
  image: string; // 主图
  price: number; // 价格
  guidePrice: number; // 划线价
}

interface GoodsInfoCatalogs {
  id: number;
  name: string;
}

export interface GoodsInfoSkuConfigs {
  k: string;
  values: string[];
}

export interface GoodsInfoSkusComb {
  k: string;
  v: string;
  kId: number;
  vId: number;
}

export interface GoodsInfoSkus {
  comb: GoodsInfoSkusComb[]; // 规格组合
  combKey: string;
  id: number; // SKU ID
  image: string; // 图片
  isSoldOut: boolean; // 无货
  favorited?: boolean; // 是否收藏
  subscribed?: boolean; // 是否订阅缺货提醒
  price: string; // 价格
  guidePrice: string | null; // 划线价
  sn: string; // 商品编码
  barcode: string; // 商品条码
}

export interface GoodsInfoSkusItem extends GoodsInfoSkus {
  priceAlias?: string;
}

export interface GoodsInfo {
  id: number; // 商品id
  name: string; // 商品名称
  type: number; // 商品类型, 0 实物, 1 优惠券
  saleStatus: number; // 1 上架, 2 下架
  image: string; // 主图
  onSaleAt: Date; // 开售时间, 默认为立即开售
  guidePrice: number; // 划线价
  sn: string; // 商品编码
  barcode: string; // 商品条码
  images: string[]; // 商品图片
  video: {
    // 商品视频
    url: string; // 视频地址
    cover: string; // 视频封面
  };
  shareImage: string; // 分享图
  deliveryTemplateId: number; // 发货模板ID
  openedAt: Date | null; // 自动上架时间
  closedAt: Date | null; // 自动上架时间
  paymentExpiration: number; // 下单后付款有效时间(分钟)
  skuConfigs: GoodsInfoSkuConfigs[]; // SKU组合配置, 如果为空说明是单SKU商品
  skus: GoodsInfoSkus[]; // SKUs
  price: string; // 价格
  catalogs: GoodsInfoCatalogs[]; // 目录
  /** 活动 */
  availablePromotions: IGoodsAct[];
  booking: {
    id: number; // 预约活动ID
    booked: boolean; // 本人是否已预约
    numbers: number; // 预约人数
    templateIds: string[]; // 订阅消息模板
    start: Date; // 预约开始时间
    sendAt: Date; // 预计通知发送时间
  };
  extends: {
    releaseDate: Date; // 上市日期
    technology: string; // 工艺
    aftersales: { url: string }[];
  };
}

export interface GoodsDetailInfo {
  type: string; // image 图片, text 文字, video 视频
  content: string; //内容
}

export interface ICatalog {
  id: number; // 类目ID
  code: string; // 类目编码
  name: string; // 类目名称
  style: string; // 类目前端展示样式
  image?: string; // 类目图片
  children: ICatalog[]; // 类目子项
  hidden: boolean; // 是否隐藏
  // num: number; // 商品数量
  properties: { name: string; values: string[] }[];
  // feature: string;
  position: number;
  sys: number; // 是否系统类目
}

export interface ICatalogRes {
  list: ICatalog[];
}

export enum sortType {
  default = '',
  /**  价格从低到高 */
  priceAsc = 'price-asc',
  /**  价格从高到低 */
  priceDesc = 'price-desc',
}

export interface IGoodsList {
  list: GoodsListInfo[];
  total: number;
}

export interface IPromotionInfo {
  /** 活动id */
  promotionId: string;
  /** 活动名称 */
  name: string;
  /** 开始时间 */
  startTime: Date;
  /** 结束时间 */
  endTime: Date;
  /** appId */
  appId: string;
  /** 价格别名 */
  priceAlias: string;
  /** 价格别名 */
  allowCouponUse: boolean;
}

export interface IGoodsActItems {
  /** skuId */
  skuId: number;
  /** goodsId */
  goodsId: number;
  /** price */
  price: string;
  /** promotionId */
  promotionId: string;
  /** 购买次数总数 */
  buyingCount: number;
  /** 可购买总次数 */
  usableCount: number;
  /** 一口价限购次数 */
  quantity: number;
  /** 是否限购 */
  enableLimit: boolean;
  /** 是否允许使用卡券 */
  allowCouponUse: boolean;
}

export interface IGoodsAct {
  /** 一口价活动 */
  promotionInfo: IPromotionInfo;
  /** 活动类型一口价Default: buyout_price */
  type: string;
  /** 活动Id */
  promotionId: string;
  /** 活动项配置 */
  goodsItems: IGoodsActItems[];
  /** 活动名称 */
  name: string;
  /** 开始时间 */
  startTime: Date | null;
  /** 结束时间 */
  endTime: Date | null;
  id?: number;
}

export interface IGoodsSteps {
  title: string;
  time: string;
}

export enum targetType {
  goods = 'goods',
  sku = 'sku',
}
export interface IFavoritesParams {
  targetType: targetType; //收藏目标类型
  targetId: string; //收藏目标ID
  favorited: boolean; //是否收藏
}

export interface IFavoritesInfo {
  id: number; // skuID
  goodsId: number; // 商品ID
  name: string; // 商品名称
  barcode: string; // 商品名称
  sn: string; // 商品名称
  image: string; // 主图
  price: string; // 价格
  disabled: boolean; // 是否删除
  isSoldOut: boolean; // 无货
  guidePrice: number; // 划线价
  comb: [
    {
      kId: never;
      v: string;
    },
  ];
}

export interface IFavorites {
  createdAt: string;
  target: IFavoritesInfo;
}

export interface IFavoritesRes {
  list: IFavorites[];
  total: number; //总数
}

export interface IGoodsSteps {
  title: string;
  time: string;
}

export interface IRatingInfoParams {
  itemId: number; // 商品id
  skuId: number; // sku id
}

export interface IRatingSubmitParams {
  itemId: number; // 商品id
  skuId: number; // sku id
  star: number; // 推荐指数
  chooseTags: string[]; // 选择的标签
}

export interface IGoodsArriveParams {
  itemId: number; // 商品id
  skuId: number; // sku id
  templateId: string; // 模板ID
}
