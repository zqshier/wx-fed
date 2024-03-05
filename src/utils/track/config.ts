import Taro from '@tarojs/taro';
import { IEventsName, IPageEventsParams } from './../../dto/events';

export function getRefererPath() {
  // 获取当前页面附加属性
  const pages = Taro.getCurrentPages();
  const preIndex = pages.length - 2 < 0 ? -1 : pages.length - 2;
  const refererPath = preIndex != -1 ? pages[preIndex].route : '';
  return refererPath;
}

const configs: { [key: string]: IPageEventsParams } = {
  'pages/index/index': {
    pageSn: { name: '首页初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'pages/shop/shop': {
    pageEvents: {},
  },
  'pages/pointmall/pointmall': {
    pageSn: { name: '积分商城页面初始化', theaction: 'pv' },
    pageEvents: {},
    callback: () => {
      const refererPath = getRefererPath();
      return { properties: { refererPath } };
    },
  },
  'pages/mine/mine': {
    pageSn: { name: '我的页面初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'pages/verification/verification': {
    pageEvents: {},
    callback: options => ({ properties: { refererName: options.refererName } }),
  },
  'packageA/pages/feedback/feedback': {
    pageSn: { name: '意见与建议页面初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'packageA/pages/userInfo/userInfo': {
    pageSn: { name: '资料管理页面初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'packageA/pages/myIntegral/myIntegral': {
    pageSn: { name: '我的积分页面初始化', theaction: 'pv' },
    pageEvents: {},
    callback: () => {
      const refererPath = getRefererPath();
      return { properties: { refererPath } };
    },
  },
  'packageA/pages/pointGoodsDetail/pointGoodsDetail': {
    pageSn: { name: '积分产品详情页初始化', theaction: 'pv' },
    // oldCallback: options => ({ clickparam: options?.id || '' }),

    pageEvents: {},
    callback: options => {
      return { properties: { goodsId: options.id } };
    },
  },
  'packageA/pages/help/help': {
    pageSn: { name: '帮助', theaction: 'pv' },
    // oldCallback: options => ({ name: `${options?.title || ''}页面初始化` }),

    pageEvents: {},
    callback: options => {
      return { properties: { name: options?.title || '' } };
    },
  },
  'packageA/pages/signin/signin': {
    pageSn: { name: '每日签到页面初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'packageA/pages/noticeCenter/noticeCenter': {
    pageSn: { name: '系统信息页面初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'packageA/pages/verifyFinishInfo/verifyFinishInfo': {
    pageSn: { name: '产品验真完善信息页面初始化', theaction: 'pv' },
    pageEvents: {},
    callback: options => {
      let goods = { code: 0 };
      try {
        goods = JSON.parse(options.goods);
      } catch (e) {
        /* empty */
      }
      return { properties: { goodsId: (goods && goods.code) || 0, channelId: options.recordId || 0 } };
    },
  },
  'packageA/pages/search/search': {
    pageEvents: { event: IEventsName.PG },
    callback: () => {
      // 获取当前页面附加属性
      const refererPath = getRefererPath();
      // console.debug('pages===========', pages);
      // console.debug('refererPath===========', refererPath);
      // const { eventsInfo } = pages[pages.length - 1]?.data as any;
      // if (eventsInfo) {
      //   // console.debug('eventsInfo', eventsInfo);
      //   return { properties: { searchKey: eventsInfo.q, refererPath } };
      // }
      return { properties: { refererPath } };
    },
  },
  'packageA/pages/cart/cart': {
    pageEvents: {},
    callback: () => {
      const refererPath = getRefererPath();
      return { properties: { refererPath } };
    },
  },
  'packageA/pages/secondClassify/secondClassify': {
    pageEvents: {},
    callback: options => ({ properties: { name: options?.sonTitle || '' } }),
  },
  'packageA/pages/advancedFilter/advancedFilter': {
    pageEvents: {},
    callback: options => ({ properties: { name: options?.title || '' } }),
  },
  'packageA/pages/goodsDetail/goodsDetail': {
    pageEvents: {},
    callback: options => {
      const refererPath = getRefererPath();
      return { properties: { goodsIds: options.id, refererPath } };
    },
  },
  'packageA/pages/inviteFriends/inviteFriends': {
    pageSn: { name: '邀请好友页初始化', theaction: 'pv' },
    pageEvents: {},
  },
  'packageA/pages/posterImage/posterImage': {
    pageEvents: {},
  },
  'packageA/pages/order/orderList/orderList': {
    pageEvents: {},
  },
  'packageA/pages/order/aftersales/aftersales': {
    pageEvents: {},
  },
  'packageA/pages/newsGuide/newsGuide': {
    pageEvents: {},
    callback: options => ({ properties: { name: options?.code || '' } }),
  },
  'packageA/pages/myFavorites/myFavorites': {
    pageEvents: { properties: { name: '我的收藏页面' } },
  },
  'packageA/pages/pointOrderList/pointOrderList': {
    pageEvents: {},
  },
  'packageA/pages/coupon/couponList/couponList': {
    pageEvents: {},
  },
  'packageA/pages/coupon/couponCenter/couponCenter': {
    pageEvents: {},
  },
  'packageA/pages/memberRights/memberRights': {
    pageEvents: {},
  },
  'packageA/pages/setting/setting': {
    pageEvents: {},
  },
};
export default configs;
