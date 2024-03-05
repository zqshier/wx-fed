import type { PropType } from 'vue';
import { IDeliverAddr } from '@/dto/settle';
export const dProps = {
  showRight: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object as PropType<IDeliverAddr>,
    default: null,
  },
  aId: {
    type: Number || String,
    default: '',
  },
};
