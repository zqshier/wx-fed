<template>
  <view :class="$style['step-con']">
    <view
      :class="{
        [$style['step-item']]: true,
        [$style['current']]: index === current,
        [$style['pass']]: index < current,
      }"
      v-for="(item, index) in steps"
      :key="index"
    >
      <view :class="$style['title']">{{ item.title }}</view>
      <view :class="$style['line-wrap']">
        <view :class="$style['line']"></view>
        <view :class="$style['line-on']"></view>
        <view :class="$style['dot']"></view>
      </view>
      <view :class="$style['time']">{{ item.time }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { IGoodsSteps } from '@/dto/goods';

defineProps<{
  steps?: IGoodsSteps[];
  current: number;
}>();
</script>

<style lang="scss" module>
.step-con {
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  .step-item {
    flex: 1;
    .title {
      font-size: 14px;
      font-weight: 400;
      color: $Primary;
      text-align: center;
      line-height: 16px;
    }
    .time {
      font-size: 12px;
      font-weight: 400;
      color: $Primary;
      line-height: 16px;
      font-family: 'Centrale Sans Regular';
      text-align: center;
    }
    .line-wrap {
      position: relative;
      height: 10px;
      margin: 10px 0;
      .line {
        height: 2px;
        background: rgba(0, 0, 0, 0.12);
        position: absolute;
        left: 0;
        top: 4px;
        z-index: 0;
        width: 100%;
      }
      .line-on {
        height: 2px;
        border-radius: 8px;
        background: var(--black-100, #000);
        position: absolute;
        left: 0;
        top: 4px;
        z-index: 1;
        width: 0;
      }
      .dot {
        width: 8px;
        height: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 8px;
        background: var(--divide, #d9d9d9);
        z-index: 2;
      }
    }
    &.current {
      .line-on {
        width: 50%;
      }
      .dot {
        background: #000;
      }
    }

    &.pass {
      .line-on {
        width: 100%;
      }
      .dot {
        background: #000;
      }
    }
  }
}
</style>
