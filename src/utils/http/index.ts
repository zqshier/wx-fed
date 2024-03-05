import { HTTP_ERROR, RESPONSE_400, RESPONSE_401 } from '@/constants';
import { useUserStore } from '@/stores/modules/user';
import Taro from '@tarojs/taro';
import { Toast, routerPathUrl } from '..';

export interface ErrorBody {
  code: string;
  message?: string;
}

let handler: NodeJS.Timeout;
function relogin() {
  clearTimeout(handler);
  handler = setTimeout(() => {
    useUserStore().logout();
    const router = Taro.getCurrentInstance().router; // 当前页
    const pageParams: any = router?.params;
    const pagePath: any = router?.path;
    console.debug('relogin Taro.getCurrentInstance().router', Taro.getCurrentInstance().router);
    console.debug('relogin pageParams', pageParams);
    console.debug('relogin pagePath', pagePath);
    const url = routerPathUrl({ path: pagePath, params: pageParams });
    console.debug('relogin url', url);
    Taro.reLaunch({ url });
  }, 200);
}

// 运行时获取微信AppId
let wxAppId = '';
let envVersion = '';

const ais = Taro.getAccountInfoSync();
console.debug('getAccountInfoSync', ais);
wxAppId = ais.miniProgram.appId;
envVersion = ais.miniProgram.envVersion;

const sysInfo = Taro.getSystemInfoSync();
const environment = sysInfo.environment || ''; // 小程序运行环境，微信还是企业微信？不确认是否一定会有？

interface IRequestConfig {
  url: string;
  method?: 'POST' | 'PUT' | 'GET' | 'DELETE';
  headers?: { [key: string]: any };
  timeout?: number;
  data?: any;
  params?: { [key: string]: any };
}

const headerDefaults: { [key: string]: any } = {
  'Content-Type': 'application/json;charset=UTF-8',
  'x-app-id': process.env.APP_ID,
  'x-platform': 'wxmp',
  'x-platform-id': wxAppId,
  'x-platform-env': envVersion,
  'x-environment': environment,
};

const parseUrl = (url: string, params?: { [key: string]: any }) => {
  if (!params) return url;
  const keys = Object.keys(params);
  const arr = keys.map(key => `${key}=${params[key]}`);
  if (url.includes('?')) return `${url}&${arr.join('&')}`;
  return `${url}?${arr.join('&')}`;
};

function createClient(clientConfig: { baseURL?: string }) {
  async function request<T>(config: IRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      const header: { [key: string]: any } = {
        ...headerDefaults,
        ...config.headers,
      };
      const token = useUserStore().getToken;
      if (token) {
        header.Authorization = `Bearer ${token}`;
      }

      let url = config.url;
      if (!url.startsWith('http')) {
        url = `${clientConfig.baseURL}${url}`;
      }

      url = parseUrl(url, config.params);

      Taro.request({
        url,
        timeout: config.timeout || 30000,
        method: config.method,
        data: config.data,
        header,
        enableHttp2: true,
        enableCache: true,
        enableQuic: true,
        success: res => {
          const statusCode = res.statusCode;
          if (statusCode === RESPONSE_401) {
            // 重新登陆 清除登录信息重新登录
            reject({ code: '401', message: '请重新登录' });
            relogin();
            return;
          }

          let body = res.data;
          console.debug('http request res', url, body, res);

          if (typeof body === 'string') {
            try {
              body = JSON.parse(body);
            } catch (err) {
              console.debug('parse resp error', err);
            }
          }

          if (statusCode < 200 || statusCode >= 300) {
            if (Array.isArray(body.message)) body.message = body.message.join('\n');

            if (statusCode === RESPONSE_400 && body?.code === HTTP_ERROR.show_error_message)
              Toast(`${body?.message || '网络异常，连接超时'}`); // 黑名单提示

            reject(body);
            return;
          }

          resolve(body);
        },
        fail: err => {
          console.log(err);
          reject(err);
        },
      });
    });
  }

  const post = async <T>(config: IRequestConfig) => {
    return request<T>({ method: 'POST', ...config });
  };

  const put = async <T>(config: IRequestConfig) => {
    return request<T>({ method: 'PUT', ...config });
  };

  const get = async <T>(config: IRequestConfig) => {
    return request<T>({ method: 'GET', ...config });
  };

  const del = async <T>(config: IRequestConfig) => {
    return request<T>({ method: 'DELETE', ...config });
  };

  return { post, put, get, del, request };
}

export function getRequest<T>(url) {
  return new Promise<T>((resolve, reject) => {
    Taro.request({
      url,
      method: 'GET',
      success: res => resolve(res.data),
      fail: err => reject(err),
    });
  });
}

export function getQrCodeUrl(options: { page?: string; params?: { [key: string]: any }; isHyaline?: number }) {
  const pstr = JSON.stringify(options.params || {});
  const is_hyaline = options.isHyaline || 0;

  return `${process.env.API_HOST}/api/tpms/wx_qrcode?appId=${
    process.env.APP_ID
  }&platform=wxmp&platformId=${wxAppId}&page=${options.page || ''}&params=${encodeURIComponent(
    pstr,
  )}&isHyaline=${is_hyaline}&envVersion=${envVersion}`;
}

export const client = createClient({ baseURL: process.env.API_HOST as string });
export const post = client.post;
export const put = client.put;
export const get = client.get;
export const del = client.del;
