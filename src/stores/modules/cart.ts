import { defineStore } from 'pinia';
import { ICartInfo, IAddCartParams, ISelectCartParams, IUpdateItemCountParams, IUpdateSkuParams } from '@/dto/cart';
import {
  getCartAddItemApi,
  getCartInfoApi,
  getSelectItemsApi,
  getRemoveItemsApi,
  getUpdateItemCountApi,
  getUpdateSkuApi,
} from '@/api/cart';
interface CartState {
  cartInfo: ICartInfo | null;
}

export const useCartStore = defineStore({
  id: 'cart-store',
  state: (): CartState => ({
    cartInfo: null,
  }),

  getters: {
    getCartInfos(state): ICartInfo | null {
      return state.cartInfo;
    },
  },

  actions: {
    setCartInfo(info: ICartInfo | null) {
      this.cartInfo = info || null;
    },

    async addShopCart(params: IAddCartParams) {
      const result = await getCartAddItemApi(params);
      return result;
    },

    async load() {
      if (this.cartInfo) return;
      this.getCartInfo();
    },

    async getCartInfo() {
      const result = await getCartInfoApi();
      this.setCartInfo(result);
      return result;
    },

    async getSelectItems(data: ISelectCartParams) {
      const result: ICartInfo = await getSelectItemsApi(data);
      this.setCartInfo(result);
      return result;
    },

    async getUpdateItemCount(data: IUpdateItemCountParams) {
      const result = await getUpdateItemCountApi(data);
      this.setCartInfo(result);
      return result;
    },

    async getRemoveItems(data: number[]) {
      const result = await getRemoveItemsApi(data);
      this.setCartInfo(result);
      return result;
    },

    async getUpdateSku(data: IUpdateSkuParams) {
      const result: ICartInfo = await getUpdateSkuApi(data);
      this.setCartInfo(result);
      return result;
    },
  },
});
