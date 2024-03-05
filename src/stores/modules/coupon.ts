import { getCoupon, getCouponAvailables, getCouponRecordsPar, getCouponsCenter } from '@/api/coupons';
import {
  CouponType,
  ICouponRecordList,
  ICouponRecordParams,
  ICouponsCenterList,
  ICouponsItem,
  IGetCouponParams,
} from '@/dto/coupons';
import { defineStore } from 'pinia';

interface ICouponRecordData {
  type: CouponType;
  name: string;
  list: any[];
  total: number;
  params: ICouponRecordParams;
  loaded: boolean; // 渲染加载
  finished: boolean; // 全部加载
  loading: boolean; // 加载中
}

interface ICouponState {
  datas: ICouponRecordData[];
  couponCenterList: ICouponsItem[];
}

export const useCouponStore = defineStore({
  id: 'coupon-store',
  state: (): ICouponState => ({
    datas: [
      {
        type: CouponType.unused,
        name: '未使用',
        list: [],
        total: 0,
        params: { page: 1, perPage: 10, status: CouponType.unused },
        loaded: false,
        finished: false,
        loading: false,
      },
      {
        type: CouponType.used,
        name: '已使用',
        list: [],
        total: 0,
        params: { page: 1, perPage: 10, status: CouponType.used },
        loaded: false,
        finished: false,
        loading: false,
      },
      {
        type: CouponType.expired,
        name: '已过期',
        list: [],
        total: 0,
        params: { page: 1, perPage: 10, status: CouponType.expired },
        loaded: false,
        finished: false,
        loading: false,
      },
    ],
    couponCenterList: [],
  }),
  getters: {
    getData: state => (type: CouponType) => state.datas.find(o => o.type === type),

    getTotal() {
      const type = CouponType.unused;
      return this.datas.find(o => o.type === type)?.total || 0;
    },
  },

  actions: {
    async pull(params: IGetCouponParams) {
      const res = await getCoupon({ ...params });
      this.$reset();
      return res;
    },
    async load(type = CouponType.unused, reload = false) {
      const data = this.getData(type) as ICouponRecordData;

      if (reload) {
        data.list = [];
        data.total = 0;
        data.finished = false;
        data.loaded = false;
        data.params.page = 1;
      }

      // 如果已经全部加载完成直接终止执行
      if (data.finished) return;

      // 正在加载
      if (data.loading) return;
      data.loading = true;

      let result: ICouponRecordList;

      try {
        result = await getCouponRecordsPar(data.params);
      } catch (err) {
        console.error('getCouponRecordsPar error:', err);
        return;
      } finally {
        data.loading = false;
      }

      data.loaded = true;
      data.params.page += 1;

      if (!result) return;

      const list = result.list || [];
      if (list.length < data.params.perPage) {
        data.finished = true;
      }

      list.forEach(o => {
        const { config, ...rds } = o;
        data.list.push({ ...config, ...rds });
      });
      data.total = result.total;
    },

    async avaliables(codes?: string[]) {
      const { list } = await getCouponAvailables(codes);
      return list;
    },

    async getCouponCenterList() {
      const result: ICouponsCenterList = await getCouponsCenter();
      this.couponCenterList = result.list || null;
      return result;
    },
  },
});
