import { COMPONENTS_COUPON_TYPE } from '@/constants';
import { ICouponsItem } from '@/dto/coupons';
import { PropType } from 'vue';
export const dProps = {
  itemData: {
    type: Object as PropType<ICouponsItem>,
    default: {},
  },

  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  showRule: {
    type: Boolean,
    default: true,
  },
  // 显示边框
  isBorder: {
    type: Boolean,
    default: true,
  },
  // 所属页面
  page: {
    type: String,
    default: COMPONENTS_COUPON_TYPE.COUPON,
  },
  // 筛选票券状态
  status: {
    type: [String, Number],
    default: '',
  },
  index: {
    type: [String, Number],
    default: 0,
  },
  // couponWarpStyle: {
  //   type: Object as PropType<CSSProperties>,
  //   default: () => ({}),
  // },
  // nameFontSize: {
  //   type: Object as PropType<CSSProperties>,
  //   default: () => ({}),
  // },
  // timeFontSize: {
  //   type: Object as PropType<CSSProperties>,
  //   default: () => ({}),
  // },
  // expFontSize: {
  //   type: Object as PropType<CSSProperties>,
  //   default: () => ({}),
  // },
  // priceFontSize: {
  //   type: Object as PropType<CSSProperties>,
  //   default: () => ({}),
  // },
};
