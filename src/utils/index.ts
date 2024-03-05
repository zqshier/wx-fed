import { medalsCom } from '@/api/medal';
import { DOCUMENTS, TAB_BAR_LIST, TARGET_PHOME_AUTH } from '@/constants';
import { IMedalsCom } from '@/dto/medail';
import { AuthFlowParams } from '@/dto/user';
import { useAppStore, useGoodsStore, useUserStore } from '@/stores';
import Taro, { getApp } from '@tarojs/taro';
import { isEmpty, omitBy, sample } from 'lodash';
import { getMissionsRecordsApi } from './../api/missions';
import { ELinkflowEventsName, ILinkflowEventsProps } from './track';
import { getRefererPath } from './track/config';

export * from './goods';
export * from './order';
export * from './regroupData';

export enum LinkType {
  none = 'none',
  path = 'path',
  weapp = 'weapp',
  h5 = 'h5',
}

export interface ToastOption {
  title: string;
  duration?: number;
  icon?: 'none' | 'success' | 'error' | 'loading';
  mask?: boolean;
  sucCallback?: Function;
}

export function Toast(options: ToastOption): void;
export function Toast(
  title: string,
  duration?: number,
  icon?: 'none' | 'success' | 'error' | 'loading',
  mask?: boolean,
  sucCallback?: Function,
): void;
export function Toast(
  title: string | ToastOption,
  duration = 1500,
  icon: 'none' | 'success' | 'error' | 'loading' = 'none',
  mask = false,
  sucCallback?: Function,
) {
  const options: ToastOption =
    typeof title === 'string'
      ? {
          title,
          duration,
          icon,
          mask,
          sucCallback,
        }
      : { duration: 1500, icon: 'none', mask: false, ...title };

  Taro.showToast({
    ...options,
    success: () => options.sucCallback && options.sucCallback(),
  });
}

export const taroPromise = <T>(taroMethod: Function, options: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    options.success = resolve;
    options.fail = reject;
    taroMethod.call(Taro, options);
  });
};

// 图片处理url拼接
export const cdnurl = (str: string) => {
  if (!str) return '';
  return `${process.env.CDN_HOST}/${str}`;
};

/**
 * 用户授权流程:
 *  1. 获取用户信息授权
 *  2. 跳转到手机号授权界面
 * @param target 唤起授权流程的来源及可选的回调函数
 */
export const authFlow = (params: AuthFlowParams = { target: '' }) => {
  // const userInfo: UserInfo = Taro.getStorageSync(USER_KEY) || {};
  if (!useUserStore().isMemberLevel || !useUserStore().isPhone) {
    // Taro.navigateTo({
    //   url: `/pages/phoneAuth/phoneAuth?target=${encodeURIComponent(params.target)}`,
    // });
    console.debug('注册会员 触发功能模块 target', params.target);
    Taro.eventCenter.trigger(TARGET_PHOME_AUTH, params.target);
    return false;
  }
  return true;
};

export const handleLink = (type: LinkType, url: string, appId?: string) => {
  console.debug('handleLink', type, url);
  url = routeMap(url);
  switch (type) {
    case LinkType.path: // 内部路径跳转
      if (TAB_BAR_LIST.includes(url)) {
        Taro.switchTab({ url });
      } else {
        Taro.navigateTo({ url });
      }
      break;
    case LinkType.weapp: // 小程序跳转
      Taro.navigateToMiniProgram({ appId: appId!, path: url });
      break;
    case LinkType.h5: // 打开webview
      Taro.navigateTo({ url: `/pages/webview/webview?src=${encodeURIComponent(url)}` });
      break;
    case LinkType.none:
    default:
      break;
  }
};

/**
 * 价格展示格式
 * 如果是整数，无需显示小数位
 */
export function formatPrice(price: number | string) {
  const n = Number(price);
  if (n > Math.floor(n)) {
    return String(n);
  }
  return String(n);
}

/**
 * OSS图片优化
 */
export function imageProcess(url: string, size: 'L' | 'M' | 'S', format: 'jpg' | 'png' | 'webp' = 'jpg') {
  if (!url || !url.length) return '';
  if (!url.startsWith('http')) return url;
  if (/(jpg|jpeg|png)$/.test(url)) {
    const width = size === 'L' ? 1200 : size === 'M' ? 800 : 300;
    return `${url}?x-oss-process=image/resize,w_${width},limit_1/format,${format}/quality,Q_90/interlace,1`;
  }
  return url;
}

export function shareOptions(options: {
  page?: string;
  params?: { [key: string]: any };
  title?: string;
  imageUrl?: string;
  useDefaultImage?: boolean;
}) {
  const { useDefaultImage = true } = options;
  const arr: string[] = [];
  if (options.page) arr.push(`page=${encodeURIComponent(options.page)}`);

  if (options.params) {
    for (const key of Object.keys(options.params)) {
      arr.push(`${key}=${encodeURIComponent(options.params[key])}`);
    }
  }

  if (useUserStore().getUserInfo?.sid) {
    // 默认传参uid
    arr.push(`uid=${encodeURIComponent(useUserStore().getUserInfo!.sid)}`);
  }

  let imageUrl = options.imageUrl;
  if (!imageUrl && useDefaultImage) {
    const sharePosterData = useAppStore().sharePosterData.map(item => item.content);
    imageUrl = sample(sharePosterData);
  }
  return omitBy(
    {
      title: options.title || '加入Zippo会员中心,赢免费周边',
      path: '/pages/landing/landing?' + arr.join('&'),
      imageUrl,
    },
    isEmpty,
  );
  // return '/pages/landing/landing?' + arr.join('&');
}

export function strlen(str: string) {
  let len = 0;
  if (!str) return len;
  str = str.replace(/\s+/g, '');
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
}

export function getRect(selector, all) {
  return new Promise(resolve => {
    const query = Taro.createSelectorQuery();
    if (all) {
      query
        .selectAll(selector)
        .boundingClientRect(rect => {
          if (all && Array.isArray(rect) && rect.length) {
            resolve(rect);
          }
        })
        .exec();
    } else {
      query
        .select(selector)
        .boundingClientRect(rect => {
          if (!all && rect) {
            resolve(rect);
          }
        })
        .exec();
    }
  });
}

// 获取各个标签的尺寸
export function queryRect(el, type) {
  return new Promise(resolve => {
    getRect(`#${el}`, type).then(size => {
      resolve(size);
    });
  });
}

// 完成任务条件回调
export function getMissionsRecords(data) {
  return new Promise(resolve => {
    getMissionsRecordsApi(data).then(res => {
      resolve(res);
    });
  });
}

// 完成分享任务条件回调
export function getShareMissionsRecords(data) {
  setTimeout(() => {
    getMissionsRecords(data);
  }, 2000);
}

/**
 * 手机号校验
 */
export function phoneVerify(val: string) {
  return /^(?:(?:\+|00)86)?1\d{10}$/.test(val);
}

/**
 * 订阅消息
 */
export function subscribeMessage(tmplIds: string[]): Promise<Taro.requestSubscribeMessage.SuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    Taro.requestSubscribeMessage({
      tmplIds,
      success: res => {
        console.log(res);
        resolve(res);
      },
      fail: err => {
        console.error(err);
        reject(err);
      },
    });
  });
}

/**根据数字获取汉字*/
export function changeToCN(num: number): string {
  const words = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const adds = ['', '十', '百', '千', '万', '亿', '十', '百', '千'];
  if (words[num]) {
    return words[num];
  } else if (num > 10 && num < 20) {
    const numStr = num.toString();
    const n = numStr.substring(1, 2);
    const result = adds[1] + words[n];
    return result;
  } else if (num > 10) {
    let result = '';
    const numStr = num.toString();
    for (let i = 0; i < numStr.length; ++i) {
      const n = numStr.substring(i, i + 1);
      const m = numStr.length - i - 1;
      result += words[n] + adds[m];
    }
    return result;
  } else return '零';
}

function trimExtraChar(value: string, char: string, regExp: RegExp) {
  const index = value.indexOf(char);

  if (index === -1) {
    return value;
  }

  if (char === '-' && index !== 0) {
    return value.slice(0, index);
  }

  return value.slice(0, index + 1) + value.slice(index).replace(regExp, '');
}
/**
 * 数字校验
 * @param value 值
 * @param allowDot 允许小数点
 * @param allowMinus 允许负数
 * @returns
 */
export function formatNumber(value: string, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g);
  } else {
    value = value.split('.')[0];
  }

  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g);
  } else {
    value = value.replace(/-/, '');
  }
  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;

  return value.replace(regExp, '');
}

/**
 * 去除字符串全部空格
 * @param ele 字符串
 * @returns
 */
export function trimAll(ele) {
  if (typeof ele === 'string') {
    return ele.split(/[\t\r\f\n\s]*/g).join('');
  } else {
    console.error(`${typeof ele} is not the expected type, but the string type is expected`);
  }
}

export function routeMap(oUrl: string) {
  let url = oUrl;
  if (url.charAt(0) !== '/') url = `/${url}`;
  const map = {
    '/pages/changeOrder/changeOrder': '/packageA/pages/pointOrderList/pointOrderList', // 兑换订单
    '/pages/feedback/feedback': '/packageA/pages/feedback/feedback', // 意见与建议
    '/pages/invite/invite': '', // 邀请好友
    '/pages/mall/mall': '/pages/pointmall/pointmall', // 积分商城
    '/pages/management/management': '/packageA/pages/userInfo/userInfo',
    '/pages/new-product/new-product': '', // 上新日历
    '/pages/new-product-detail/new-product-detail': '', // 上新日历商品详情
    '/pages/noRegisterIndex/noRegisterIndex': '/pages/verification/verification', // 扫码验真进入首页
    '/pages/online-service/online-service': '',
    '/pages/point/point': '/packageA/pages/myIntegral/myIntegral',
    '/pages/product-detail/product-detail': '/packageA/pages/pointGoodsDetail/pointGoodsDetail', // 积分商品详情
    '/pages/right/right': '/packageA/pages/memberRights/memberRights', // 会员权益
    '/pages/service-terms/service-terms': `/packageA/pages/help/help?title=${DOCUMENTS.FUWUXIEYI.title}&code=${DOCUMENTS.FUWUXIEYI.code}`, // 服务协议
    '/pages/signin/signin': '/packageA/pages/signin/signin',
    '/pages/signin-rule/signin-rule': '', //签到规则
    '/pages/system-notice/system-notice': '/packageA/pages/noticeCenter/noticeCenter', // 消息通知
    '/pages/verification-complete-info/verification-complete-info': '/packageA/pages/verifyFinishInfo/verifyFinishInfo', // 完善信息
  };

  return map[url] || oUrl;
}

export function compareVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

export function openCustomerServiceChat() {
  // const url = process.env.SERVICE_LINK || '';
  // const corpId = process.env.CORP_ID || '';
  // if (!url || !corpId) return;

  const path = Taro.getCurrentInstance().page?.route;
  // tarckEvents([{ path, event: IEventsName.SERVICE_CL }]);
  const linkflow = getApp()[`${process.env.APP_ID}`];
  if (linkflow) {
    const triggerPagePath = getRefererPath();
    let skuId,
      outerSkuId,
      miniSkuId = '';
    // 判断当前页面是商详，取商详信息
    if (path === 'packageA/pages/goodsDetail/goodsDetail') {
      const cSkuData = useGoodsStore().getCurrentSkusData;
      skuId = cSkuData?.barcode || '';
      outerSkuId = cSkuData?.sn || '';
      miniSkuId = `${cSkuData?.id || ''}`;
    }

    linkflow.track({
      event: ELinkflowEventsName.Service_Click,
      props: { skuId, outerSkuId, miniSkuId, triggerPagePath } as ILinkflowEventsProps,
    });
  }

  // Taro.openCustomerServiceChat({
  //   extInfo: { url },
  //   corpId,
  //   success(res) {
  //     console.debug('成功进入企业微信客服 res=', res);
  //   },
  //   fail(error) {
  //     Toast('客服功能暂不可用');
  //     console.debug('进入企业微信客服失败 error=', error);
  //   },
  // });
}

// 加载文件字体转 base64，load
function loadFontFace(fontFamily, filePath) {
  return new Promise((resolve, reject) => {
    Taro.getFileSystemManager().readFile({
      //读文件
      filePath, // 本地文件地址
      encoding: 'base64',
      success: res => {
        console.debug(`loadFontFace getFileSystemManager readFile success=`, res);
        Taro.loadFontFace({
          global: true,
          family: fontFamily, // 字体名称
          source: `url("data:font/woff2;charset=utf-8;base64,${res.data}")`,
          complete: res => {
            console.debug(`loadFontFace ${fontFamily} complete=`, res);
            resolve(res);
          },
        } as any);
      },
      fail: err => {
        console.debug(`loadFontFace getFileSystemManager readFile fail err=`, err);
        reject(err);
      },
    });
  });
}

function downloadFont(url, filePath, fontFamily) {
  return new Promise((resolve, reject) => {
    Taro.downloadFile({
      url, // cdn文件
      success: res => {
        console.debug('downloadFont downloadFile success res=', res);
        Taro.getFileSystemManager().saveFile({
          // 下载成功后保存到本地
          tempFilePath: res.tempFilePath,
          filePath,
          success: res => {
            // 加载字体
            console.debug('downloadFont getFileSystemManager saveFile success res=', res);
            resolve(loadFontFace(fontFamily, res.savedFilePath));
          },
          fail: err => {
            console.debug('downloadFont getFileSystemManager saveFile fail err=', err);
            reject(err);
          },
        });
      },
      fail: err => {
        console.debug('downloadFont downloadFile fail err=', err);
        reject(err);
      },
    });
  });
}

export function loadCdnFontFace(url, fontFamily) {
  const filePath = `${wx.env.USER_DATA_PATH}/${fontFamily}`;
  return new Promise(resolve => {
    Taro.getFileSystemManager().access({
      path: filePath,
      success: async () => {
        console.debug('loadCdnFontFace getFileSystemManager access success');
        resolve(loadFontFace(fontFamily, filePath));
      },
      fail: () => {
        console.debug('loadCdnFontFace getFileSystemManager access fail');
        resolve(downloadFont(url, filePath, fontFamily));
      },
    });
  });
}

export async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function findNode(selector: string): Promise<any> {
  return new Promise(resolve => {
    Taro.nextTick(() => {
      Taro.createSelectorQuery()
        .select(selector)
        .node(res => resolve(res && res.node))
        .exec();
    });
  });
}

export function routerPathUrl({
  url = '/pages/landing/landing',
  path = '',
  params = {},
}: {
  url?: string;
  path?: string;
  params?: any;
}) {
  const arr: string[] = [];
  if (path) arr.push(`page=${path}`);
  if (params) {
    for (const key of Object.keys(params)) {
      if (key !== '$taroTimestamp') {
        arr.push(`${key}=${params[key]}`);
      }
    }
  }
  return `${url}?${arr.join('&')}`;
}

export function goBack() {
  const pages = Taro.getCurrentPages(); // 当前页
  const beforePage = pages[pages.length - 2];
  if (!beforePage) {
    Taro.switchTab({ url: '/pages/index/index' });
  } else {
    Taro.navigateBack();
  }
}

export const getQueryString = (name: string, url: string) => {
  const reg = new RegExp('[&, ?]' + name + '=([^\\&,\\#]*)', 'i');
  const value = reg.exec(url);
  return value ? value[1] : '';
};
export function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 完成勋章
 */
export async function unlockMedal(data: IMedalsCom) {
  try {
    await medalsCom(data);
  } catch (error) {
    console.log('error: ', error);
  }
}
