import { defineStore } from 'pinia';
import { getUsersPoints } from '@/api/points';
import { IPointsList, IPointsParams } from '@/dto/point';

interface IPointStoreState {
  data: IPointsList;
}

export const usePointStore = defineStore({
  id: 'point-store',
  state: (): IPointStoreState => ({
    data: {
      total: 0,
      list: [],
      balance: 0,
      rule: { amount: 1, points: 100, limit: 100 },
    },
  }),
  getters: {
    scale(): number {
      return this.data.rule.points;
    },
    balance(): number {
      return this.data.balance;
    },
    conversion(): number {
      return Math.floor((this.data.balance * 100) / this.data.rule.points) / 100;
    },
  },

  actions: {
    async load(data?: IPointsParams) {
      data = data || {};
      // 默认不加载明细
      if (typeof data.withoutList === 'undefined') {
        data.withoutList = 1;
      }
      const res = await getUsersPoints(data);
      Object.assign(this.data, res);
      return res;
    },
  },
});
