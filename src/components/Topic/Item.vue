<template>
  <view :class="$style.goods_list">
    <scroll-view
      :class="$style.scroll_view"
      class="nut-flex nut-col-top nut-row-left"
      :scroll-x="true"
      :enhanced="true"
      :show-scrollbar="false"
      :enable-flex="true"
      @scrolltolower="getGoodsList"
    >
      <view :class="$style.scroll_view_box" class="nut-flex nut-col-top nut-row-left">
        <!-- 商品列表 -->
        <block v-for="(item, index) in goods" :key="index">
          <Product :item="item" />
        </block>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';

import Product from './Product.vue';

const props = defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
  paddingLeft: {
    type: Number,
    default: 12,
  },
  // itemPageUrl: { type: String, default: '' },
});

const boxPaddingLeft = `${props.paddingLeft}px`;
const goods = computed(() => props.info);

const getNextPage = inject('getNextPage') as any;

const getGoodsList = () => {
  if (!getNextPage) return;
  getNextPage();
};
</script>
<style lang="scss" module>
.goods_list {
  width: 375px;
  min-height: 232px;
  padding: 24px 0;
  .scroll_view {
    width: 100%;
    height: 100%;
    &_box {
      // padding: 0 12px;
      padding-left: v-bind(boxPaddingLeft);
    }
  }
}
</style>
