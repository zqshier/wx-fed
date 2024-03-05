// import { skuCombs } from './../../utils/goods';
// import { goodsApi } from '@/api/goods';
import { getInfo } from '@/api/points';
import { GoodsDetailInfo, GoodsInfoSkusItem, IGoodsAct } from '@/dto/goods';
import { IPointsGoodsInfo, IPointsGoodsSkus } from '@/dto/point';
import { defineStore } from 'pinia';

interface ActivityInfo extends IGoodsAct {
  id: number;
}

interface PointsGoodsState {
  goodsInfo: IPointsGoodsInfo | null;
  goodsDetailInfo: GoodsDetailInfo[] | null;
  couponCodes: string[];
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
  skusData: IPointsGoodsSkus;
}

export const usePointsGoodStore = defineStore({
  id: 'pointsGoods-store',
  state: (): PointsGoodsState => ({
    goodsInfo: null,
    goodsDetailInfo: null,
    couponCodes: [],
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
      sn: '',
      barcode: '',
      // priceAlias: '',
      meta: {
        //附加元数据, 礼品卡: { "giftCardId": 1 }, 优惠券: { "couponCode": "czzxs30hrfx1" }
        giftCardId: 0, //礼品卡ID，当商品类型为优惠券时有效
        couponCode: '', //优惠券编码，当商品类型为优惠券时有效
      },
      pointMallSaleData: {
        //积分兑换价格相关信息
        point: 0, //所需积分数量
        price: 0, //所需支付金额
        remainStock: 0, //剩余库存
      },
    },
  }),
  getters: {
    getCurrentSkusData(state): IPointsGoodsSkus | null {
      return state.skusData;
    },
  },

  actions: {
    resetState() {
      usePointsGoodStore().$reset();
    },

    setCouponCodes(ids: string[]) {
      this.couponCodes = ids;
    },

    async getGoodsInfo(promotionId: string) {
      const result: IPointsGoodsInfo = await getInfo(promotionId);
      this.goodsInfo = result || null;

      return result;
    },

    // setActivityInfos(actItem: IGoodsAct | null, goodsId: number) {
    //   const index = this.activityInfos.findIndex(item => item.id === goodsId);
    //   if (index === -1) {
    //     this.activityInfos.push({ ...actItem, id: goodsId });
    //   } else {
    //     this.activityInfos[index] = { ...actItem, id: goodsId };
    //   }
    // },

    // 设置选中sku信息
    setSkusData(data: GoodsInfoSkusItem) {
      this.skusData = data;
    },
  },
});
