import { defineStore } from 'pinia';
import { IAddressesInfo, IAddressesResult, IAddressesParams, AddressInfo } from '@/dto/address';
import { userAddressesGetApi, userAddressesApi } from '@/api/address';
import { isEmpty } from 'lodash';
import LRUCache from 'lru-cache';
import { cdnurl } from '@/utils';
import { getRequest } from '@/utils/http';
import Taro from '@tarojs/taro';

export interface IColumnsInfo {
  text: string;
  value: string;
  children?: IColumnsInfo[];
}

interface AddressState {
  addressList: IAddressesInfo[] | null;
}

const columnsCacheKey = '1';
const dataCacheKey = '2';
const cache = new LRUCache<string, any>({ ttl: 300 * 1000, max: 2 });

export const useAddressStore = defineStore({
  id: 'address-store',
  state: (): AddressState => ({
    addressList: null,
  }),

  getters: {},

  actions: {
    async getUerAddresses() {
      const result: IAddressesResult = await userAddressesGetApi();
      this.addressList = result.list || null;
      return result;
    },

    async addUserAddresses(params: IAddressesParams) {
      const result = await userAddressesApi(params);
      return result;
    },

    addAddressByWx(cb: (res) => void) {
      Taro.chooseAddress({
        success: res => {
          console.log(res);
          if (res.errMsg === 'chooseAddress:ok') {
            Taro.preload({ wxAddr: res });
            cb && cb(res);
          }
        },
      });
    },

    async preload(): Promise<AddressInfo[]> {
      if (cache.has(dataCacheKey)) return cache.get(dataCacheKey) as AddressInfo[];

      let data: AddressInfo[] = [];

      // eslint-disable-next-line no-undef
      const filePath = `${wx.env.USER_DATA_PATH}/arealeveldata`;
      const fm = Taro.getFileSystemManager();

      try {
        const str = fm.readFileSync(filePath, 'utf8');
        if (str) data = JSON.parse(str as string);
      } catch (err) {
        console.log(err);
      }

      if (data?.length) {
        console.debug('load area data from cache');
        // return data;
      } else {
        data = await getRequest<AddressInfo[]>(cdnurl('static/level.json'));
        fm.writeFile({
          data: JSON.stringify(data),
          filePath,
          complete: res => console.debug('writeFile', res),
          encoding: 'utf8',
        });
      }

      cache.set(dataCacheKey, data);
      return data;
    },

    async getAreaData(): Promise<IColumnsInfo[]> {
      if (cache.has(columnsCacheKey)) return cache.get(columnsCacheKey) as IColumnsInfo[];
      const res = await this.preload();

      const columns = res.map(item => {
        const result: IColumnsInfo = {
          text: item.name,
          value: item.code,
          children: [{ text: '', value: '' }],
        };
        if (!isEmpty(item.children)) {
          result.children = item.children?.map(item2 => {
            const _children: IColumnsInfo = {
              text: item2.name,
              value: item2.code,
              children: [{ text: '', value: '' }],
            };
            if (!isEmpty(item2.children)) {
              _children.children = item2.children?.map(item3 => {
                return {
                  text: item3.name,
                  value: item3.code,
                };
              });
            }
            return _children;
          });
        }
        return result;
      });

      cache.set(columnsCacheKey, columns);
      return columns;
    },
  },
});
