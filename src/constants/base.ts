export const CUSTOM_PAY_TYPE_ADD_CART = 0; // 加入购物车
export const CUSTOM_PAY_TYPE_BUY = 1; // 立即购买
export const CUSTOM_PAY_TYPE_UPDATE_SKU = 2; // 更新sku
export const STATUS_SALE_ING = 1; // 销售中
export const STATUS_SALE_OUT = 2; // 已下架
export const SETTLE_POINT_TYPE_USE = 1; // 选择使用积分
export const SETTLE_POINT_TYPE_NO_USE = 2; // 选择不使用积分

export enum LOADING_TITLE {
  DEFALUT = '加载中...',
  EMPTY = ' ',
}

export const TARGET_PHOME_AUTH = 'phoneAuth';
export const TARGET_PHOME_AUTH_CALLBACK = 'phoneAuthCallback';
export const TARGET_REFRESH_CART_PAGE = 'refreshCartPage';
export const TARGET_LOCATION_CHANGE = 'loctionChange';
export const TARGET_ORDER_CANCEL_POP = 'orderCancelPop';
export const TARGET_ORDER_R_BATCH_POP = 'orderRbatchPop';
export const TARGET_DAILY_BOX_POP = 'dailyBoxPop';
export const TARGET_VERIFY_FINISH = 'VerifyFinish';
export const TARGET_LOCATION_CHANGE_POINT = 'loctionChangePoint';
export const RECEIVE_CALLBACK = 'receiveCallback';

// export enum LOGISTIC_CODE {
//   SF = '顺丰速运',
//   JD = '京东快递',
//   YTO = '圆通速递',
//   STO = '申通快递',
//   ZTO = '中通快递',
// }

export const DOCUMENTS = {
  GONGLUE: {
    title: '小火苗攻略',
    code: 'gonglue',
  },
  YINSITIAOKUAN: {
    title: '隐私条款',
    code: 'yinsitiaokuan',
  },
  FUWUXIEYI: {
    title: '服务协议',
    code: 'fuwuxieyi',
  },
  QIANDAO: {
    title: '签到规则',
    code: 'qiandao',
  },
  MEMBER_RIGHTS: {
    title: '会员协议',
    code: 'member_rights',
  },
  USER_AGREEMENT: {
    title: '用户协议',
    code: 'user_agreement',
  },
  FULI: {
    title: '社群福利',
    code: 'fuli',
  },
  REMENHUODONG: {
    title: '热门活动',
    code: 'huodong',
  },
  XINSHOUGONGLUE: {
    title: '新手教程',
    code: 'xinshougonglue',
  },
  YAOQINGHAOYOU: {
    title: '邀请好友',
    code: 'yaoqinghaoyou',
  },
} as const;

export const CATALOGDOC = {
  SHOWMORENEW: {
    title: 'ZIPPO',
    code: 'gengduo',
  },
};

export enum COMPONENTS_COUPON_TYPE {
  COUPON_CENTER = 'couponCenter',
  COUPON = 'coupon',
  COUPON_SHARE = 'couponShare',
}

export const TAB_BAR_LIST = [
  '/pages/index/index',
  '/pages/shop/shop',
  '/pages/pointmall/pointmall',
  '/pages/mine/mine',
  '/pages/verify/verify',
]; // 首页tabbar列表

export enum LOGIN_TARGET {
  coupon = '领取优惠券',
  addCart = '商品加入购物车',
  buyGoods = '商品立即购买',
  subscribeGoods = '商品订阅到货通知',
  shareGoods = '商品分享',
  collectGoods = '商品收藏',
  ratingGoods = '商品提交评分',
  exchangePointGoods = '积分商品兑换',
  sharePointsGoods = '积分商品分享',
  gifts = '新人礼',
  signupActivity = '活动报名',
  bookingGoods = '商品上新预约',
  bookingSaleGoods = '商品开售预约',
  uploadSumbitOrder = '上传订单提交审核',
  verificationCode = '防伪验真验码',
  registerClick = '点击登录注册',
  missionPointMallPage = '积分商城今日任务',
  orderUploadSubmit = '上传订单提交',
  lotteryCardClick = '点击卡片抽奖',
  missionLotteryPage = '抽奖任务',
}

export enum WX_SCENE {
  /** 单人聊天会话中的小程序消息卡片 */
  SCENE_1007 = 1007,
  /** 群聊会话中的小程序消息卡片 */
  SCENE_1008 = 1008,
  /** 扫描小程序码 */
  SCENE_1047 = 1047,
}
