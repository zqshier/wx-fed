<template>
  <view
    :class="[$style['btn-check'], props.check ? [$style['btn-checked'], $style[`checkIcon_${props.modesIcon}`]] : '']"
  ></view>
</template>

<script setup lang="ts">
import { TYPE_ICON } from '@/dto/order';
import variables from '@/scss/variables';

const props = defineProps({
  check: {
    type: Boolean,
    default: false,
  },
  width: {
    type: Number,
    default: 16,
  },
  mRight: {
    type: Number,
    default: 8,
  },
  borderColor: {
    type: String,
    default: variables.tertiary,
  },
  modesIcon: {
    type: String,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: TYPE_ICON.TICK,
  },
});
const bWidth = `${props.width}px`;
const mRight = `${props.mRight}px`;
const borderColor = `${props.borderColor}`;
// const checkIcon = `${props.checkIcon}`;
</script>

<style lang="scss" module>
.btn-check {
  width: v-bind(bWidth);
  height: v-bind(bWidth);
  border: 1px solid v-bind(borderColor);
  margin-right: v-bind(mRight);
  border-radius: v-bind(bWidth);
  box-sizing: border-box;
  &.btn-checked {
    border: none;
    background-repeat: no-repeat;
    background-size: cover;
  }
  &.checkIcon_tick {
    background-image: url('../../static/icon/checkbox_on.png');
  }
  &.checkIcon_round {
    background-image: url('../../static/icon/radio.png');
  }
}
</style>
