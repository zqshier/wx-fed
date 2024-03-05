export enum MISSIONS_CODE {
  /** 每日签到 */
  signin = 'signin',
  /** 分享 */
  share = 'share',
  /** 保存日签 */
  saveimage = 'saveimage',
  /** 邀请新会员 */
  invitemember = 'invitemember',
  /** 关注公众号 */
  subwxoa = 'subwxoa',
  /** 完善个人信息 */
  userinfo = 'userinfo',
  /** 浏览指定页面 */
  pageview = 'pageview',
  /** 完成问答 */
  question = 'question',
  /** 商品评分 */
  goodsrate = 'goodsrate',
  /** 收藏商品 */
  goodsfav = 'goodsfav',
  /** 上传订单截图获得小火苗 */
  uploadorder = 'uploadorder',
}

/** 根据任务操作展示不同按钮文案 */
export const MISSIONS_CODE_BTN_TEXT = {
  share: '去完成',
  invitemember: '去完成',
  goodsrate: '去完成',
  pageview: '去完成',
  goodsfav: '去完成',
  uploadorder: '去上传',
  signin: '去签到',
  question: '去完成',
  subwxoa: '去完成',
  userinfo: '去完成',
  saveimage: '去完成',
} as const;

export const MISSIONS_CODE_URL = {
  goodsfav: '/pages/shop/shop',
  goodsrate: '/pages/shop/shop',
  invitemember: '/packageA/pages/inviteFriends/inviteFriends',
  pageview: '/pages/shop/shop',
  share: '/pages/shop/shop',
  uploadorder: '/packageA/pages/order/orderUpload/orderUpload',
  signin: '/packageA/pages/signin/signin',
  question: '/packageA/pages/questionnaire/questionnaire',
  // subwxoa: '去完成',
  userinfo: '/packageA/pages/userInfo/userInfo',
  // saveimage: '去完成',
};

export enum MISSIONS_TYPE {
  daily = 'daily', //每日
  lifetime = 'lifetime', //永久
}

export const MISSIONS_TYPE_TEXT = {
  [MISSIONS_TYPE.daily]: '每日任务',
  [MISSIONS_TYPE.lifetime]: '会员任务',
} as const;
