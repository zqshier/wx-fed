import Taro from '@tarojs/taro';
import { defineStore } from 'pinia';
import { getDailyApi } from '@/api/daily';
import { IDaily } from '@/dto/daily';
import { DAILY_KEY } from '@/stores';

interface IdailyData {
  data: IDaily;
  expiredAt: number;
}

interface IDailyState {
  dailyData: IdailyData;
}

export const useDailyStore = defineStore({
  id: 'daily-store',

  state: (): IDailyState => ({
    dailyData: Taro.getStorageSync(DAILY_KEY),
  }),

  getters: {
    getDaily(state): IDaily | undefined {
      if (!state.dailyData) return;
      if (state.dailyData.expiredAt && new Date(state.dailyData.expiredAt).getDate() !== new Date().getDate()) return;
      return state.dailyData.data;
    },
  },

  actions: {
    setDaily(dailyInfo: IdailyData | null) {
      if (!dailyInfo || !dailyInfo.data) {
        this.dailyData = null;
        Taro.removeStorageSync(DAILY_KEY);
        return;
      }
      this.dailyData = dailyInfo;
      Taro.setStorageSync(DAILY_KEY, dailyInfo);
    },

    async load() {
      if (this.getDaily) return;
      const data = await getDailyApi();
      this.setDaily({ data, expiredAt: new Date().getTime() });
    },
  },
});
