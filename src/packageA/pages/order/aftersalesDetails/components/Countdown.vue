<template>
  <view class="nut-flex-col nut-col-top mg-bottom-16">
    <nut-countdown v-model="state.resetTime" :endTime="state.timeData" @on-end="changState">
      <view :class="$style.countdown" class="f_s-20 f_w-500 nut-flex nut-row-center">
        <text>{{ state.resetTime.d < '10' ? `0${state.resetTime.d}` : state.resetTime.d }}</text>
        <text :class="$style.countdown_day" class="f_s-12">天</text>
        <text>{{ state.resetTime.h < '10' ? `0${state.resetTime.h}` : state.resetTime.h }}</text>
        <text :class="$style.countdown_colon">:</text>
        <text>{{ state.resetTime.m < '10' ? `0${state.resetTime.m}` : state.resetTime.m }}</text>
        <text :class="$style.countdown_colon">:</text>
        <text>{{ state.resetTime.s < '10' ? `0${state.resetTime.s}` : state.resetTime.s }}</text>
      </view>
    </nut-countdown>
    <view :class="$style.countdown_hint" class="f_s-12">规定时间内未提交物流单号将自动拒绝退款申请</view>
  </view>
</template>
<script setup lang="ts">
import { reactive } from 'vue';

const emits = defineEmits(['refresh']);
const props = defineProps({
  endTime: {
    type: Date,
    default: '',
  },
});

const state = reactive({
  timeData: new Date(props.endTime).getTime() + 7 * 24 * 60 * 60 * 1000,
  // timeData: new Date('2023-07-6').getTime() + 7 * 24 * 60 * 60 * 1000,
  // timeData: new Date(props.endTime).getTime() + 50 * 60 * 1000,
  resetTime: {
    d: '0',
    h: '0',
    m: '0',
    s: '0',
  },
});

const changState = () => {
  emits('refresh');
};
</script>

<style lang="scss" module>
.countdown {
  color: var(--brand, #f00);
  font-family: CentraleSans;
  &_day {
    margin-right: 8px;
    font-family: FZLanTingHeiS-B-GB;
  }
  // &_colon {
  //   margin: 0 8px;
  // }
  // &_state {
  //   margin: 10px 0 4px;
  //   color: #bb8c3e;
  // }
  &_hint {
    color: $Tertiary;
    font-family: 'FZLanTingHei-R-GBK';
  }
}
</style>
