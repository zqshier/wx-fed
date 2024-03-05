import { defineStore } from 'pinia';

import { getItemStatus } from '@/api/aftersales';
import { IReturnableInfo } from '@/dto/aftersales';
import { getOrdersDetailApi } from '@/api/order';

interface ItemStatue {
  itemStatusVal: IReturnableInfo | null;
  orderStatus: string;
}

export const useReversibleStore = defineStore({
  id: 'reversible-store',
  state: (): ItemStatue => ({
    itemStatusVal: null,
    orderStatus: '',
  }),

  getters: {},

  actions: {
    async getAfterSalesStatus(orderNo: string) {
      try {
        const result: IReturnableInfo = await getItemStatus(orderNo);
        this.itemStatusVal = result;
        return result;
      } catch (error) {
        console.error('getAfterSalesStatus error=', error);
        return;
      }
    },

    async getOrderStatus(orderNo: string) {
      console.log('orderNo: ', orderNo);
      if (!orderNo) return;

      try {
        const result = await getOrdersDetailApi(orderNo);
        this.setOrderStatus(result.status);
        // this.orderStatus = result.status;
      } catch (error) {
        console.error('getAfterSalesStatus error=', error);
        return;
      }
    },

    setOrderStatus(status: string) {
      this.orderStatus = status;
    },
  },
});
