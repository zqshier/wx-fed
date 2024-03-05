import Taro from '@tarojs/taro';
import { useUserStore } from '@/stores/modules/user';
import { RESPONSE_401 } from '@/constants';
import { routerPathUrl } from '..';

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

const ais = Taro.getAccountInfoSync();
wxAppId = ais.miniProgram.appId;

interface IRequestConfig {
  url: string;
  method?: 'POST' | 'PUT' | 'GET' | 'DELETE';
  headers?: { [key: string]: any };
  timeout?: number;
  data?: any;
  params?: any;
  baseURL?: string;
}

const parseUrl = (url: string, params?: { [key: string]: any }) => {
  if (!params) return url;
  const keys = Object.keys(params);
  const arr = keys.map(key => `${key}=${params[key]}`);
  if (url.includes('?')) return `${url}&${arr.join('&')}`;
  return `${url}?${arr.join('&')}`;
};

const headerDefaults: { [key: string]: any } = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

function createClient(clientConfig: { baseURL?: string }) {
  async function request<T>(config: IRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      const header: { [key: string]: any } = {
        ...headerDefaults,
        ...config.headers,
      };

      if (useUserStore().userInfo) {
        const { openid, session_key, unionid } = useUserStore().userInfo as any;
        config.data = Object.assign(config.data || {}, { openid, session_key, unionid });
        config.params ? (config.params = Object.assign(config.params || {}, { openid, session_key, unionid })) : '';
      }

      config.data = Object.assign(config.data || {});

      console.debug('old_client config.data', config.data);
      console.debug('old_client config.params', config.params);

      let url = config.url;
      if (!url.startsWith('http')) {
        if (config.baseURL) {
          url = `${config.baseURL}${url}`;
        } else {
          url = `${clientConfig.baseURL}${url}`;
        }
      }

      url = parseUrl(url, config.params);

      Taro.request({
        url,
        timeout: config.timeout || 30000,
        method: config.method,
        data: { ...config.data, appid: wxAppId },
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

          let body = res.data.data;
          console.debug('old_client http request res', url, body, res);

          if (typeof body === 'string') {
            try {
              body = JSON.parse(body);
            } catch (err) {
              console.debug('old_client parse resp error', err);
            }
          }

          if (body === null) {
            body = { ...res.data };
          }

          if (statusCode < 200 || statusCode >= 300) {
            if (Array.isArray(body.message)) {
              body.message = body.message.join('\n');
            }
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

export const client = createClient({ baseURL: process.env.API_HOST_OLD as string });
export const post = client.post;
export const put = client.put;
export const get = client.get;
export const del = client.del;
