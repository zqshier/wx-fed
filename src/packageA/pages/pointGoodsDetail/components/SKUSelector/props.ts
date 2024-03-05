import type { PropType } from 'vue';
export const dProps = {
  type: {
    type: Number,
    default: 0,
  },
  combData: {
    type: Object as PropType<{ id: number; comb: string[]; count: number }>,
    default: null,
  },
};
