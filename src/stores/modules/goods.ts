// import { skuCombs } from './../../utils/goods';
import { goodsApi } from '@/api/goods';
import { GoodsDetailInfo, GoodsInfo, GoodsInfoSkusItem, IGoodsAct } from '@/dto/goods';
import { defineStore } from 'pinia';

interface ActivityInfo extends IGoodsAct {
  id: number;
}

interface GoodsState {
  goodsInfo: GoodsInfo | null;
  goodsDetailInfo: GoodsDetailInfo[] | null;
  couponCodes: string[];
  // activityInfo: {
  //   promotionInfo: { priceAlias: '' };
  //   type: '';
  //   promotionId: '';
  //   goodsItems: [];
  //   name: '';
  //   startTime: null;
  //   endTime: null;
  // };
  activityInfos: ActivityInfo[];
  defActivityInfo: {
    promotionInfo: { priceAlias: '' };
    type: '';
    promotionId: '';
    goodsItems: [];
    name: '';
    startTime: null;
    endTime: null;
  };
  skusData: GoodsInfoSkusItem;
}

export const useGoodsStore = defineStore({
  id: 'goods-store',
  state: (): GoodsState => ({
    goodsInfo: null,
    goodsDetailInfo: null,
    couponCodes: [],
    // activityInfo: {
    //   promotionInfo: {
    //     priceAlias: '',
    //   },
    //   type: '',
    //   promotionId: '',
    //   goodsItems: [],
    //   name: '',
    //   startTime: null,
    //   endTime: null,
    // },
    activityInfos: [],
    defActivityInfo: {
      promotionInfo: {
        priceAlias: '',
      },
      type: '',
      promotionId: '',
      goodsItems: [],
      name: '',
      startTime: null,
      endTime: null,
    },
    skusData: {
      comb: [],
      combKey: '',
      id: 0,
      image: '',
      isSoldOut: false,
      favorited: false,
      subscribed: false,
      price: '',
      guidePrice: '',
      priceAlias: '',
      sn: '',
      barcode: '',
    },
  }),
  getters: {
    getCurrentSkusData(state): GoodsInfoSkusItem | null {
      return state.skusData;
    },
  },

  actions: {
    resetState() {
      useGoodsStore().$reset();
    },

    setCouponCodes(ids: string[]) {
      this.couponCodes = ids;
    },

    async getGoodsInfo(id: number) {
      const result: GoodsInfo = await goodsApi(id);
      this.goodsInfo = result || null;

      return result;
    },

    // setActivityInfo(actItem: IGoodsAct | null) {
    //   this.activityInfo = actItem || {};
    // },

    setActivityInfos(actItem: IGoodsAct | null, goodsId: number) {
      const index = this.activityInfos.findIndex(item => item.id === goodsId);
      if (index === -1) {
        this.activityInfos.push({ ...actItem, id: goodsId });
      } else {
        this.activityInfos[index] = { ...actItem, id: goodsId };
      }
    },

    // 设置选中sku信息
    setSkusData(data: GoodsInfoSkusItem) {
      this.skusData = data;
    },

    // 重置活动信息
    // resetActivityInfo() {
    //   const data = {
    //     promotionInfo: {
    //       priceAlias: '',
    //     },
    //     type: '',
    //     promotionId: '',
    //     goodsItems: [],
    //     name: '',
    //     startTime: null,
    //     endTime: null,
    //   };
    //   this.activityInfo = data;
    // },

    // 重置活动信息
    // resetActivityInfo(gid: number) {
    //   if (!gid) return;
    //   const index = this.activityInfos.findIndex(item => item.id === gid);
    //   if (index === -1) return;
    //   this.activityInfos.splice(index, 1);
    // },
  },
});
