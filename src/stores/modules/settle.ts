import { defineStore } from 'pinia';
import { getSettleApi } from '@/api/settle';
import { ISettleInfo, ISettleParams } from '@/dto/settle';

interface SettleState {
  settleInfo: ISettleInfo | null;
}

export const useSettleStore = defineStore({
  id: 'settle-store',
  state: (): SettleState => ({
    settleInfo: null,
  }),
  getters: {},

  actions: {
    setSettleInfo(info: ISettleInfo) {
      this.settleInfo = info || null;
    },

    async getSettle(params: ISettleParams) {
      const result = await getSettleApi(params);
      this.setSettleInfo(result);
      return result;
    },

    // async getSettleBuyNow(params: ISettleBuyNowParams) {
    //   const result = await getSettleBuyNowApi(params);
    //   this.setSettleInfo(result);
    //   return result;
    // },

    // async getSettleCart(params: ISettleCartParams) {
    //   const result = await getSettleCartApi(params);
    //   this.setSettleInfo(result);
    //   return result;
    // },
  },
});
