import { defineStore } from 'pinia';
import { IAftersalesInfo } from '@/dto/aftersales';

interface AfterSalesStore {
  orderItemInfo: IAftersalesInfo | {};
}

export const useAfterSalesStore = defineStore({
  id: 'afterSales-store',
  state: (): AfterSalesStore => ({
    orderItemInfo: {},
  }),
  getters: {
    getOrderItemInfo(): IAftersalesInfo {
      return this.orderItemInfo || null;
    },
  },

  actions: {
    setOrderItemInfo(info: IAftersalesInfo | null) {
      this.orderItemInfo = info;
    },
  },
});
