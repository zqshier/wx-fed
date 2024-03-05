import { getEventsApi } from '@/api/events';
import { IEventsName, IEventsParams } from '@/dto/events';
import { UserInfo } from '@/dto/user';
import { USER_KEY } from '@/stores/key';
import Taro from '@tarojs/taro';
import getMissionMixin from '../missionMixin';
import trackingConf from './config';

const getUserInfo = () => {
  return (Taro.getStorageSync(USER_KEY) || {}) as UserInfo;
};

// 终端设备信息
export const EventDefaultProperties: {
  $deviceBrand: string;
  $deviceModel: string;
  $deviceSystem: string;
  $devicePixelRatio: string;
  $source?: string;
} = (() => {
  const info = Taro.getSystemInfoSync() as any;
  return {
    $deviceBrand: info.brand,
    $deviceModel: info.model,
    $deviceSystem: info.system,
    $devicePixelRatio: info.devicePixelRatio,
  };
})();

const excludePages = ['pages/landing/landing'];

export const tarckEvents = async (events: IEventsParams[]) => {
  const launchOptions = Taro.getLaunchOptionsSync();
  const param: IEventsParams[] = events.map(e => ({
    path: e.path,
    event: e.event,
    loginId: e.loginId || getUserInfo()?.sid,
    ts: e.ts || Date.now(),
    properties: Object.assign({}, { ...EventDefaultProperties, scene: launchOptions.scene }, e.properties || {}),
  }));

  for (const p of param) {
    console.debug('tarckEvents', p.ts, `${p.event}(${p.path})`, JSON.stringify(p.properties));
  }

  try {
    const result = await getEventsApi(param);
    console.debug('getEventsApi result=', result);
  } catch (error) {
    console.error('getEventsApi error', error);
  }
};

function genRandomId() {
  return `${Date.now()}${Math.random()}`;
}

const injectMethodNames = ['onLoad', 'onUnload', 'onShow', 'onHide'];
const injectMethods = {
  onLoad: (oriFn: Function) => {
    return function (...args) {
      const currentPath = this.route;
      const cfg = trackingConf[currentPath];

      if (cfg?.pageSn) {
        const evt = Object.assign({ path: currentPath }, cfg?.pageSn);
        // if (cfg?.oldCallback) {
        //   Object.assign(evt, cfg.oldCallback(this.options));
        // }

        console.debug('onLoad 自动获取 pageSn', currentPath, evt);
        // track(evt);
      }
      oriFn.call(this, ...args);
    };
  },
  onUnload: (oriFn: Function) => {
    return function (...args) {
      const currentPath = this.route;
      if (!excludePages.includes(currentPath)) {
        const cfg = trackingConf[currentPath];
        const evt = Object.assign({ path: currentPath, event: IEventsName.PG }, cfg?.pageEvents) as IEventsParams;
        if (cfg?.callback) {
          Object.assign(evt, cfg.callback(this.options));
        }
        evt.properties = { ...evt.properties, action: 'leave', $pageUnid: this.___rndId };
        console.debug('onUnload 自动获取 pageEvents', currentPath, evt);
        tarckEvents([evt]);
      }
      oriFn.call(this, ...args);
    };
  },
  onShow: (oriFn: Function) => {
    return function (...args) {
      const currentPath = this.route;
      if (!excludePages.includes(currentPath)) {
        getMissionMixin({ path: this.route, params: this.options });
        this.___rndId = genRandomId();
        const cfg = trackingConf[currentPath];
        const evt = Object.assign({ path: currentPath, event: IEventsName.PG }, cfg?.pageEvents) as IEventsParams;
        if (cfg?.callback) {
          Object.assign(evt, cfg.callback(this.options));
        }
        evt.properties = { ...evt.properties, action: 'enter', $pageUnid: this.___rndId };
        console.debug('onShow 自动获取 pageEvents', currentPath, evt);
        tarckEvents([evt]);
      }
      oriFn.call(this, ...args);
    };
  },
  onHide: (oriFn: Function) => {
    return function (...args) {
      const currentPath = this.route;
      if (!excludePages.includes(currentPath)) {
        const cfg = trackingConf[currentPath];
        const evt = Object.assign({ path: currentPath, event: IEventsName.PG }, cfg?.pageEvents) as IEventsParams;
        if (cfg?.callback) {
          Object.assign(evt, cfg.callback(this.options));
        }
        evt.properties = { ...evt.properties, action: 'leave', $pageUnid: this.___rndId };
        console.debug('onHide 自动获取 pageEvents', currentPath, evt);
        tarckEvents([evt]);
      }
      oriFn.call(this, ...args);
    };
  },
};

export function MyProxy() {
  const OriginPage = Page;
  // const OriginComponent = Component;

  Page = function (conf) {
    for (const methodName of injectMethodNames) {
      if (!conf[methodName]) continue;
      const fn = conf[methodName];
      conf[methodName] = injectMethods[methodName](fn);
    }
    return OriginPage(conf);
  };

  // Component = function (conf) {
  //   // const methods = conf.methods
  //   // methods.forEach(function(e) {
  //   //   // 做你想做的事，如改写 conf 等
  //   // })

  //   return OriginComponent(conf);
  // };
}
