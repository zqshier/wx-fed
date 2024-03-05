import { GoodsInfo, GoodsInfoSkusItem, IGoodsAct } from '@/dto/goods';
import type { PropType } from 'vue';
export const dProps = {
  data: { type: Object as PropType<GoodsInfo | null>, default: null },
  show: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Number,
    default: 0,
  },
  combData: {
    type: Object as PropType<{ id: number; comb: string[]; count: number }>,
    default: null,
  },
  activityInfos: { type: Array as PropType<IGoodsAct[]>, default: () => [] },
  skusData: { type: Object as PropType<GoodsInfoSkusItem>, default: () => {} },
};
