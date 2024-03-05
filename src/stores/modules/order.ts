import { getGeneralInfoApi, getOrdersListApi } from '@/api/order';
import { IDelivery, IGeneralInfo, IOrderInfo, IOrderListInfo, IOrderListParams } from '@/dto/order';
import { cdnurl } from '@/utils';
import { getRequest } from '@/utils/http';
import { defineStore } from 'pinia';

interface OrderState {
  orderList: IOrderListInfo | {};
  orderItemInfo: IOrderInfo | {};
  orderGeneralInfo: IGeneralInfo;
  deliveryList: IDelivery[];
  orderPayedList: string[];
}

const defaultDeliveryList = [
  {
    delivery_id: 'SF',
    delivery_name: '顺丰速运',
  },
  {
    delivery_id: 'YTO',
    delivery_name: '圆通速递',
  },
  {
    delivery_id: 'ZTO',
    delivery_name: '中通快递',
  },
  {
    delivery_id: 'STO',
    delivery_name: '申通快递',
  },
  {
    delivery_id: 'YD',
    delivery_name: '韵达速递',
  },
  {
    delivery_id: 'YZBK',
    delivery_name: '邮政国内标快',
  },
  {
    delivery_id: 'YZPY',
    delivery_name: '邮政快递包裹',
  },
];

export const useOrderStore = defineStore({
  id: 'order-store',
  state: (): OrderState => ({
    orderList: {},
    orderItemInfo: {},
    orderGeneralInfo: {
      pendingCommentCount: 0,
      pendingPaidCount: 0,
      pendingReceipt: 0,
      pendingShipment: 0,
      serving: 0,
    },
    deliveryList: [...defaultDeliveryList],
    orderPayedList: [],
  }),
  getters: {
    getOrdersList(): IOrderListInfo {
      return this.orderList || null;
    },
    getOrderItemInfo(): IOrderInfo {
      return this.orderItemInfo || null;
    },
    getOrderGeneralInfo(): IGeneralInfo {
      return this.orderGeneralInfo;
    },
    getDeliveryList(): IDelivery[] {
      return this.deliveryList;
    },
    getOrderPayedList(): string[] {
      return this.orderPayedList;
    },
  },

  actions: {
    setOrderItemInfo(info: IOrderInfo | null) {
      this.orderItemInfo = info;
    },

    setOrderList(key: string, info: IOrderInfo[] | null) {
      if (!info) return;
      this.orderList[key] = info;
    },

    setOrderPayedList(orderNo: string) {
      const list = [...this.orderPayedList, orderNo];
      this.orderPayedList = Array.from(new Set(list));
    },

    async getOrdersListApi(params: IOrderListParams) {
      const result = await getOrdersListApi(params);
      return result;
    },

    async getGeneralInfoApi() {
      const result = await getGeneralInfoApi();
      this.orderGeneralInfo = result;
    },

    async getDeliveryListApi() {
      try {
        const { delivery_list } = await getRequest<{ errcode: number; delivery_list: IDelivery[]; count: number }>(
          cdnurl('static/get_delivery_list.json'),
        );
        this.deliveryList = [...defaultDeliveryList, ...delivery_list];
      } catch (err) {
        console.error(err);
      }
    },
  },
});
