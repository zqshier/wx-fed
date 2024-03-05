<template>
  <block v-if="infoData && infoData.length > 0">
    <block v-for="item in infoData" :key="item.id">
      <view :class="$style.list">
        <OrderBox :data="item" :showPrice="showPrice" :isShowBtn="Boolean(item.isReversible && isShowBtn)" />
      </view>
    </block>
  </block>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { IOrderInfoItems } from '@/dto/order';

import OrderBox from './OrderBox.vue';

const props = defineProps({
  data: {
    type: Array as PropType<IOrderInfoItems[]>,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [],
  },
  isShowBtn: {
    type: Boolean,
    default: false,
  },
  /** 显示价格 */
  showPrice: {
    type: Boolean,
    default: true,
  },
});

const infoData = computed((): IOrderInfoItems[] => {
  return props.data || [];
});
</script>

<style lang="scss" module>
.list {
  width: 100%;
  margin-bottom: 12px;
}
</style>
