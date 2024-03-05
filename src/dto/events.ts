export enum IEventsName {
  BANNER_CL = 'BannerCl', // banner点击

  GOODS_CL = 'GoodsCl', // 商品点击
  GOODS_SKU_CL = 'GoodsSkuCl', // 多规格选择点击
  GOODS_REPLENISH_CL = 'GoodsReplenishCl', // 补货通知点击
  GOODS_EXCHANGE_CL = 'GoodsExchangeCl', // 兑换积分商品点击
  CART_ADD_CL = 'CartAddCl', // 加入购物车点击
  ORDER_SETTLE_CL = 'GoodsSettleCl', // 结算点击
  ORDER_PAY_CL = 'OrderPayCl', // 订单支付点击
  ORDER_CANCEL_CL = 'OrderCancelCl', // 取消订单点击

  MINE_CL = 'MineCl', // 我的页面点击
  FILTER_CL = 'FilterCl', // 筛选页面点击
  SHARE_CL = 'ShareCl', // 分享点击
  POSTER_CL = 'PosterCl', // 海报点击
  MISSION_CL = 'MissionCl', // 任务点击
  SERVICE_CL = 'ServiceCl', // 客服点击
  SCAN_CL = 'ScanCl', // 扫码点击
  DOCUMENTS_CL = 'documentsCl', // 文档点击

  REGISTER_CM = 'RegisterCm', // 注册提交
  ORDER_CM = 'OrderCm', // 订单提交
  VERIFY_COMPLETE_CM = 'VerifyCompleteCm', //完善信息提交
  SUGGEST_CM = 'SuggestCm', // 意见反馈提交

  POPUP_OPEN_CL = 'PopupOpenCl', // 弹窗打开点击
  POPUP_CLOSE_CL = 'PopupCloseCl', // 弹窗关闭点击
  POPUP_LINK_CL = 'PopupLinkCl', // 弹窗链接点击

  UICODE_RT = 'UicodeRt', // Uicode返回状态结果

  // CM = 'Cm', // Cm:Commit提交;
  CL = 'Cl', // 点击
  PG = 'Pg', // Pg:Page页面浏览;
  // SW = 'Sw', // Sw:Show结果列表展示;
  // RF = 'Rf', // Rf:refresh刷新;
  // RT = 'Rt', // Rt:return返回状态结果;
  // IN = 'In', // In:input输入;
  // WP = 'Wp', // Wp:wipe滑动
}

export interface IEventsProperties {
  $pageUnid?: string; // 同一页面的唯一标识
  action?: 'enter' | 'leave';
  scene?: number | string; // 小程序场景值

  searchKey?: string; // 搜索关键字
  id?: number; //id
  idx?: number; // 下标值
  name?: string; // 名称标识
  pathName?: string; // 路径名称
  group?: string; // 编码
  refererPath?: string; // 来源路径
  refererName?: string; // 来源名称
  goodsId?: number; // 商品id
  orderNo?: string; // 订单号
  skuId?: number; // skuid
  channelId?: number | string; // 渠道id
  status?: number; // 状态
  desc?: string; // 描述
  url?: string; // 地址
  categoryId?: number | string; // 筛选分类id
}

export interface IEventsParams {
  path: string; // 页面路径
  event: IEventsName; // 事件名
  loginId?: string; // 用户标识 sid
  ts?: number; // 事件时间戳
  properties?: IEventsProperties; // 事件属性
}

export interface IPageEventsParams {
  pageSn?: { name: string; theaction: string };
  pageEvents: Partial<IEventsParams>;
  callback?: (options) => Partial<IEventsParams>;
  // oldCallback?: (options) => Partial<{ clickparam: string; name: string }>;
}

export enum ELinkflowEventsName {
  /** 底部菜单点击 */
  BottomMenu_Click = 'BottomMenu_Click',
  /** 注册及登录 */
  Login_Register = 'Login_Register',
  /** 邀请_注册成功 */
  Invitation_RegistrationSuccessful = 'Invitation_RegistrationSuccessful',
  /** 产品商城_点击 */
  Shop_Click = 'Shop_Click',
  /** 点击商品行为 */
  PrductDetail_Click = 'PrductDetail_Click',
  /** 离开浏览商品详情 */
  PrductDetailLeave_View = 'PrductDetailLeave_View',
  /** 提交订单-主订单 */
  Order_Submit = 'Order_Submit',
  /** 提交订单-子订单 */
  OrderDetail_Submit = 'OrderDetail_Submit',
  /** 商品评价 */
  Product_Comment = 'Product_Comment',
  /** 商品评价标签 */
  ProductTag_Comment = 'ProductTag_Comment',
  /** 完善/修改个人信息 */
  SettingInfo_Submit = 'SettingInfo_Submit',
  /** 扫码验真 */
  QRCodeVerification_Submit = 'QRCodeVerification_Submit',
  /** 首页_banner */
  Home_Banner_Click = 'Home_Banner_Click',
  /** 首页_品牌故事 */
  Home_BrandStory_Click = 'Home_BrandStory_Click',
  /** 互动任务_点击 */
  InteractiveTask_Click = 'InteractiveTask_Click',
  /** 互动任务_完成_领取奖励 */
  InteractiveTask_Complete_ReceiveAward = 'InteractiveTask_Complete_ReceiveAward',
  /** 搜索 */
  Content_Search = 'Content_Search',
  /** 产品详情页分享 */
  PrductDetail_Share = 'PrductDetail_Share',
  /** 会员中心_页面点击 */
  MemberCenter_Page_Click = 'MemberCenter_Page_Click',
  /** 弹窗点击 */
  Popup_Click = 'Popup_Click',
  /** 客服点击 */
  Service_Click = 'Service_Click',
  /** 设置_页面点击 */
  Setting_Page_Click = 'Setting_Page_Click',
  /** 产品详情_归属分类 */
  ProductDetail_Sort = 'ProductDetail_Sort',
  /** 产品详情_产品细分筛选 */
  ProductDetail_Subdivide_Search = 'ProductDetail_Subdivide_Search',
  /** 产品详情 产品筛选 */
  ProductDetail_Search = 'ProductDetail_Search',
  /** 购物车_结算明细 */
  ShoppingCart_Detail_Settlement = 'ShoppingCart_Detail_Settlement',
  /** 购物车_结算 */
  ShoppingCart_Settlement = 'ShoppingCart_Settlement',
  /** 订单详情_点击 */
  OrderDetail_Click = 'OrderDetail_Click',
  /** 互动任务_提交购买目的 */
  InteractiveTask_BuyPurpose_Submit = 'InteractiveTask_BuyPurpose_Submit',
  /** 互动任务_订单转化提交 */
  InteractiveTask_Order_Submit = 'InteractiveTask_Order_Submit',
  /** 券中心_浏览 */
  CouponCenter_View = 'CouponCenter_View',
  /** 券中心_券的点击 */
  CouponCenter_Coupon_Click = 'CouponCenter_Coupon_Click',
  /** 活动_点击 */
  Campaign_Click = 'Campaign_Click',
  /** 活动报名_提交 */
  Campaign_Submit = 'Campaign_Submit',
  /** 订单评价_提交 */
  OrderDetail_Comment_Submit = 'OrderDetail_Comment_Submit',
  /** 互动任务_提交问卷 */
  InteractiveTask_Questionnaire_Submit = 'InteractiveTask_Questionnaire_Submit',
  /** 互动任务_提交问卷_回答问题 */
  InteractiveTask_Questionnaire_Answer = 'InteractiveTask_Questionnaire_Answer',
  /** 产品详情_分享被打开 */
  PrductDetail_SharingOpened = 'PrductDetail_SharingOpened',
  /** 产品详情_打开分享页 */
  PrductDetail_Open = 'PrductDetail_Open',
  /** 产品商城_banner点击 */
  Shop_Banner_Click = 'Shop_Banner_Click',
}

export type ILinkflowTaskStatus = '待完成' | '已完成';
export type ILinkflowShareTarge = '微信好友' | '微信朋友圈';
export type ILinkflowInviteWay = '邀请海报' | '分享产品' | '';

export interface ILinkflowEventsProps {
  /** 登录状态 */
  loginStatus?: boolean;
  /** 菜单ID */
  menuId?: number;
  /** 菜单名称 */
  menuName?: string;
  /** skuid barcode */
  skuId?: string;
  /** 平台skuId 需传入小程序的货号sn */
  outerSkuId?: string;
  /** 小程序skuid：skuId */
  miniSkuId?: string;
  /** 商品系列 */
  series?: string;
  /** 商品名称、用户姓名 */
  name?: string;
  /** 当前价格 */
  currentPrice?: number;
  /** 用户行为 => 浏览，加入购物车，立即购买，点赞，分享 */
  userAction?: string;
  /** 触发入口页 */
  triggerPagePath?: string;
  /** 页面停留时间 */
  s_pageStayTime?: number;
  /** 推荐指数 */
  recommendationIndex?: number;
  /** 标签名称 */
  tagName?: string;
  /** 失败原因 */
  failReason?: string;
  /** 手机号 */
  mobilePhone?: string;
  /** 会员级别ID */
  memberId?: string;
  /** 触发功能模块 */
  triggerFunction?: string;
  /** 产品归属：Zippo火机，Zippo户外，Zippo积分商品等名字 */
  productSort?: string;
  /** 产品归属细分：未来无垠等 */
  productSubdivide?: string;
  /** 产品归属细分id */
  productSubdivideId?: string;
  /** 订单总金额 */
  totalPrice?: number;
  /** 商品总数 */
  totalQuantity?: number;
  /** 订单实付金额 */
  paymentPrice?: number;
  /** 收货人姓名 */
  receiverName?: string;
  /** 收件人手机号 */
  receiverMobile?: string;
  /** 收货人所在省份 */
  deliveryProvince?: string;
  /** 收货人所在城市 */
  deliveryCity?: string;
  /** 收货人所在地区 */
  deliveryDistrict?: string;
  /** 收货人详细地址 */
  deliveryAddress?: string;
  /** 订单支付时间 */
  payDate?: Date;
  /** 订单号 */
  orderId?: string;
  /** 运费 */
  shippingFee?: number;
  /** 优惠券数量 */
  couponNum?: string;
  /** 订单类型 */
  orderType?: string;
  /** 订单备注 */
  orderRemark?: string;
  /** 订单渠道 */
  saleChannel?: string;
  /** 店铺ID */
  storeId?: string;
  /** 店铺名称 */
  storeName?: string;
  /** 订单行ID */
  lineId?: string;
  /** 子订单状态 */
  lineStatus?: string;
  /** 订单 商品名称 */
  productName?: string;
  /** 商品单价 */
  price?: number;
  /** 商品总价 */
  itemTotalPrice?: number;
  /** 商品数量 */
  quantity?: number;
  /** 商品实付金额 */
  itemPaymentPrice?: number;
  /** 优惠券优惠金额（均摊） */
  couponAllocatedAmount?: number;
  /** 积分抵扣金额（均摊） */
  pointAllocatedAmount?: number;
  /** 改价金额（均摊） */
  priceAllocatedAmount?: number;
  /** 券id */
  couponId?: string;
  /** 券名称 */
  couponName?: string;
  /** 昵称 */
  nickname?: string;
  /** 性别 */
  gender?: string;
  /** 手机号 */
  mobile?: string;
  /** 所在省 */
  state?: string;
  /** 所在市 */
  city?: string;
  /** 街道 */
  street?: string;
  /** 地址 */
  address?: string;
  /** 渠道id */
  channelId?: string;
  /** 是否首次验真 */
  isFirstVerify?: boolean;
  /** 是否首位用户 */
  isFirstVerifyUser?: boolean;
  /** 验真码id */
  verifyId?: string;
  /** 目标类别 */
  targetClass?: string;
  /** 目标地址 */
  targetAddress?: string;
  /** 目标名称 */
  targetName?: string;
  /** 下标值 */
  Index?: string;
  /** 任务名称 */
  taskName?: string;
  /** 任务id */
  taskId?: string;
  /** 任务状态 */
  taskStatus?: ILinkflowTaskStatus;
  /** 领取方式 */
  receiveWay?: '手动领取' | '系统自动发放';
  /** 搜索内容 */
  searchtText?: string;
  /** 分享目标 */
  shareTarge?: ILinkflowShareTarge;
  /** 分享状态 */
  shareStatus?: string;
  /** 模块名称 */
  modelName?: string;
  /** 按钮名称 */
  buttonName?: string;
  /** 筛选一级类目 */
  primaryCategory?: string;
  /** 筛选二级类目 */
  secondaryCategory?: string;
  /** 购买目的 */
  buyPurpose?: string;
  /** 订单截图 */
  orderImage?: string;
  /** 活动名称 */
  campaignName?: string;
  /** 活动id */
  campaignId?: string;
  /** 活动状态 */
  campaignStatus?: string;
  /** 产品满意度 */
  productSatisfaction?: number;
  /** 包装满意度 */
  packagingSatisfaction?: number;
  /** 客服满意度 */
  customerServiceSatisfaction?: number;
  /** 物流满意度 */
  logisticsSatisfaction?: number;
  /** 推荐的可能性 */
  possibilityOfRecommendation?: number;
  /** 当前积分 */
  currentPoint?: number;
  /** 是否积分商品 */
  isPointProduct?: boolean;
  /** 是否积分商品 */
  isInviteRegistration?: boolean;
  /** 邀请方式 */
  inviteWay?: ILinkflowInviteWay;
  /** 问卷ID */
  s_questionnaireId?: string;
  /** 问卷名称 */
  s_questionnaireName?: string;
  /** 问卷 */
  s_question?: string;
  /** 问题序号 */
  s_questionNumber?: string;
  /** 回答 */
  s_answer?: string;
  /** 被邀人openid */
  inviteeOpenId?: string;
  /** 被邀人unionid */
  inviteeUnionId?: string;
  /** 被邀人昵称 */
  inviteeNickname?: string;
  /** 分享人加密userid */
  shareEncodeMiniUserId?: string;
  /** 是否新会员 */
  isNewMember?: boolean;
}
