import {
  loginApi,
  loginMemberApi,
  registerMemberApi,
  updatePhoneApi,
  updateUsersProfileApi,
  userTrace,
  usersProfileApi,
} from '@/api/user';
import { ORDER_STATUS, WX_SCENE } from '@/constants';
import { IGeneralInfo } from '@/dto/order';
import { MemberParams, UpdateUserParams, UserInfo } from '@/dto/user';
import { LOGIN_STATUS_KEY, MEMBER_RIGHTS_REMINDED_KEY, TOKEN_KEY, USER_KEY, useOrderStore } from '@/stores';
import { LinkType, taroPromise } from '@/utils';
import Taro from '@tarojs/taro';
import addDays from 'date-fns/addDays';
import { cloneDeep } from 'lodash';
import { defineStore } from 'pinia';

interface UserToken {
  token?: string;
  expiredAt?: number;
}

interface MemberRightsRemindeds {
  [key: string]: MemberRightsRemindedsVal[];
}
interface MemberRightsRemindedsVal {
  code: string;
  name: string;
  clickAt: number;
}

interface UserState {
  userInfo: UserInfo | null;
  token: UserToken | null;
  lastUpdateTime: number;
  introducer?: string;
  onShowOptions?: { path?: string; scene: number } | null;
  appScene?: number;
  memberRightsRemindeds?: MemberRightsRemindeds | null;
  orderList?: [];
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: Taro.getStorageSync(USER_KEY),
    token: Taro.getStorageSync(TOKEN_KEY),
    lastUpdateTime: 0,
    introducer: '',
    onShowOptions: null,
    appScene: 0,
    memberRightsRemindeds: Taro.getStorageSync(MEMBER_RIGHTS_REMINDED_KEY) || {},
    orderList: [],
  }),
  getters: {
    getUserInfo(state): UserInfo | null {
      return state.userInfo;
    },
    getToken(state): string | undefined {
      if (!state.token) return;
      console.debug('getToken 1', state);
      if (state.token.expiredAt && state.token.expiredAt - Date.now() < 3600 * 12 * 1000) {
        // TOKEN时效不足12小时
        return;
      }
      return state.token.token;
    },
    isMemberLevel(state) {
      return !!state.userInfo?.memberLevel;
    },
    isPhone(state) {
      // Taro.getStorageSync(LOGIN_STATUS_KEY)为空代表缓存仲没有该状态，使用默认值true
      const isLogedIn = Taro.getStorageSync(LOGIN_STATUS_KEY) === '' ? true : Taro.getStorageSync(LOGIN_STATUS_KEY);
      // console.log('!!state.userInfo?.phone && this.getLoginStatus: ', !!state.userInfo?.phone, isLogedIn);
      return !!state.userInfo?.phone && isLogedIn;
    },
    getMemberRightsRemindeds(state) {
      return state.memberRightsRemindeds;
    },
    getOrderList() {
      const generalInfo: IGeneralInfo = useOrderStore().getOrderGeneralInfo;

      const res = [
        {
          url: `/packageA/pages/order/orderList/orderList?feedStatus=${ORDER_STATUS.PENDING_PAID}`,
          icon: require('@/static/icon/to-paid.png'),
          name: '待付款',
          type: LinkType.path,
          redDot: generalInfo.pendingPaidCount > 0,
        },
        {
          url: `/packageA/pages/order/orderList/orderList?feedStatus=${ORDER_STATUS.PENDING_SHIPMENT}`,
          icon: require('@/static/icon/to-ship.png'),
          name: '待发货',
          type: LinkType.path,
          redDot: generalInfo.pendingShipment > 0,
        },
        {
          url: `/packageA/pages/order/orderList/orderList?feedStatus=${ORDER_STATUS.PENDING_RECEIPT}`,
          icon: require('@/static/icon/to-received.png'),
          name: '待收货',
          type: LinkType.path,
          redDot: generalInfo.pendingReceipt > 0,
        },
        {
          url: `/packageA/pages/order/orderList/orderList?feedStatus=${ORDER_STATUS.PENDING_COMMENT}`,
          icon: require('@/static/icon/finish.png'),
          name: '待评价',
          type: LinkType.path,
          redDot: generalInfo.pendingCommentCount > 0,
        },
        {
          url: `/packageA/pages/order/aftersales/aftersales`,
          icon: require('@/static/icon/after-sales.png'),
          name: '售后',
          type: LinkType.path,
          redDot: generalInfo.serving > 0,
        },
      ];
      return res;
    },
    isShareToGoodsDetail(state) {
      return (
        state.introducer &&
        state.onShowOptions?.scene &&
        [WX_SCENE.SCENE_1007, WX_SCENE.SCENE_1008, WX_SCENE.SCENE_1047].includes(state.onShowOptions.scene)
      );
    },
  },
  actions: {
    setToken(tokenInfo: UserToken | null) {
      if (!tokenInfo || !tokenInfo.token) {
        this.token = null;
        Taro.removeStorageSync(TOKEN_KEY);
        return;
      }
      this.token = tokenInfo;
      Taro.setStorageSync(TOKEN_KEY, tokenInfo);
    },
    setUserInfo(info: UserInfo | null) {
      const merged = { ...this.userInfo, ...info };
      this.userInfo = merged;
      this.lastUpdateTime = new Date().getTime();
      Taro.setStorageSync(USER_KEY, merged);
    },
    logout() {
      console.debug('relogin');
      this.setUserInfo(null);
      this.setToken(null);
    },
    /**
     * @description: login
     */
    async login(fromUser?: string) {
      if (this.getToken) return;

      try {
        const res = await taroPromise<{ code: string }>(Taro.login, {
          onlyAuthorize: true,
        });
        const launchOptions = Taro.getLaunchOptionsSync();
        const data = await loginApi({ code: res.code, fromUser, scene: String(launchOptions.scene) });
        const { token, openId, unionId } = data;
        this.setToken({ token, expiredAt: addDays(new Date(), 6).getTime() });
        this.setUserInfo({ openid: openId, unionid: unionId });
        // 获取用户资料
        await this.getUsersProfile();
      } catch (error) {
        return Promise.reject(error);
      }
    },

    /**
     * @description: loginOld
     */
    // async loginOld() {
    //   // 老API登录
    //   try {
    //     const res = await taroPromise<{ code: string }>(Taro.login, {
    //       onlyAuthorize: true,
    //     });
    //     const loginData = await oldLoginApi({ code: res.code });
    //     this.setUserInfo(loginData);
    //     // 获取用户资料
    //     await this.getInintmembers();
    //   } catch (error) {
    //     return Promise.reject(error);
    //   }
    // },

    async updatePhonenumber(data: { code: string }) {
      return updatePhoneApi(data);
    },

    async getUsersProfile() {
      if (!this.getToken) return;
      const result: UserInfo = await usersProfileApi();
      this.setUserInfo(result);
      // usePointStore().load({ withoutList: 1 });
      return result;
    },

    async registerMember(data: MemberParams) {
      const result = await registerMemberApi(data);
      await this.getUsersProfile();
      // 更新 store
      return result;
    },

    async loginMember(data: MemberParams) {
      const result = await loginMemberApi(data);
      await this.getUsersProfile();
      // 更新 store
      return result;
    },

    async updateUsersProfile(data: UpdateUserParams) {
      const result: UpdateUserParams = await updateUsersProfileApi(data);
      const _info = { ...this.userInfo, ...result };
      this.setUserInfo(_info);
      return {};
    },

    async trace({ introducer }) {
      console.debug('user trace', introducer);
      if (introducer) this.introducer = introducer;
      try {
        const res = await userTrace({ introducer });
        if (res.guide && this.getUserInfo) {
          this.userInfo.guide = res.guide;
        }
      } catch (err) {
        console.error('userTrace error=', err);
      }
    },

    setOnShowOptions(options) {
      this.onShowOptions = options;
    },

    setAppScene(options) {
      this.appScene = options;
    },

    // old zippo
    // async updatemember(data: UpdateUserOldParams) {
    //   return updatememberApi(data);
    // },

    // async getInintmembers() {
    //   if (!this.getUserInfo.session_key) return;
    //   const res = await inintmembersApi();
    //   if (res.errcode == -99) {
    //     // 非会员
    //     this.setUserInfo({ ...this.getUserInfo, memberLevel: null, phone: '' });
    //   } else {
    //     const result = res[0] as UserOldInfo;
    //     const userInfo = (result && regroupUserInfo(result)) || {};
    //     this.setUserInfo(userInfo);
    //   }
    //   return {};
    // },

    // async registerOldMember(data: any) {
    //   const result = await registerApi(data);
    //   await this.getInintmembers();
    //   // 更新 store
    //   return result;
    // },

    // async getInintNoMembers() {
    //   this.setUserInfo({ ...this.getUserInfo, memberLevel: null, phone: '' });
    //   return {};
    // },

    setMemberRightsRemindeds(key: string, value: MemberRightsRemindedsVal) {
      const merged: MemberRightsRemindeds = cloneDeep(this.memberRightsRemindeds);
      if (merged[key]) {
        // 已存在 覆盖更新
        const idx = merged[key].findIndex(i => i.code === value.code);
        idx >= 0 ? (merged[key][idx] = value) : merged[key].push(value);
      } else {
        merged[key] = [{ ...value }];
      }

      this.memberRightsRemindeds = merged;
      Taro.setStorageSync(MEMBER_RIGHTS_REMINDED_KEY, merged);
    },

    updateMemberRightsRemindeds(key: string, values: MemberRightsRemindedsVal[]) {
      const merged = cloneDeep(this.memberRightsRemindeds);
      if (merged[key]) merged[key] = values;

      this.memberRightsRemindeds = merged;
      Taro.setStorageSync(MEMBER_RIGHTS_REMINDED_KEY, merged);
    },
  },
});
