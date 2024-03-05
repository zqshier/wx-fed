<template>
  <view class="price-layout numfnt nut-flex nut-row-center nut-col-center">
    <text class="unit">¥</text>
    <text class="num numfnt-medium">{{ price }}</text>
  </view>
</template>

<script lang="ts" setup>
import variables from '@/scss/variables';

const props = defineProps({
  price: {
    type: String,
    default: '0.00',
  },
  priceFont: {
    type: Number,
    default: 18,
  },
  priceWeight: {
    type: Number,
    default: 500,
  },
  priceColor: {
    type: String,
    default: variables.secendary,
  },
  unitRight: {
    type: Number,
    default: 0,
  },
  unitFont: {
    type: Number,
    default: 12,
  },
});
// eslint-disable-next-line no-unused-vars
const uRight = `${props.unitRight}px`;
const uWeight = `${props.unitFont}px`;
const pFont = `${props.priceFont}px`;
const pWeight = `${props.priceWeight}`;
const pColor = `${props.priceColor}`;
</script>

<style lang="scss">
.price-layout {
  font-family: 'CentraleSans';
  font-size: v-bind(pFont);
  font-weight: v-bind(pWeight);
  color: v-bind(pColor);
  // line-height: 24px;
  .unit {
    padding-right: v-bind(uRight);
    font-size: v-bind(uWeight);
  }
}
</style>
