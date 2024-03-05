import { getDailySigninMonthApi } from '@/api/daily';
import { ISigninMonthData } from '@/dto/daily';
import isSameDay from 'date-fns/isSameDay';
import { isEmpty } from 'lodash';
import { defineStore } from 'pinia';

interface ISigninDataMap {
  [key: string]: ISigninMonthData;
}

interface ISigninState {
  signinDatas: ISigninDataMap;
}

export const useSigninStore = defineStore({
  id: 'signin-store',

  state: (): ISigninState => ({
    signinDatas: {},
  }),

  getters: {
    getSigninDatas(): ISigninDataMap {
      return this.signinDatas;
    },
    isSignedIn() {
      const today = new Date();
      const keys = Object.keys(this.signinDatas);
      for (const key of keys) {
        for (const d of this.signinDatas[key].days) {
          if (isSameDay(new Date(d.signInDate), today)) return true;
        }
      }
      return false;
    },
  },

  actions: {
    setSigninData(key: string, info: ISigninMonthData) {
      this.signinDatas[key] = info;
    },

    async load(month: string) {
      if (!isEmpty(this.getSigninDatas[month])) return;

      let result = {} as ISigninMonthData;

      try {
        result = await getDailySigninMonthApi({ month });
      } catch (err) {
        /* empty */
      }

      // result.days = [{ signInDate: new Date(), isSignIn: true }];
      this.setSigninData(month, result);
    },
  },
});
