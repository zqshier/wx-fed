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
        <!-- <view :class="$style['line-on']"></view> -->
        <view :class="$style['dot']"></view>
      </view>
      <view :class="$style['time']" class="numfnt">{{ item.time }}</view>
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
  padding: 16px 0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  color: $Primary;
  line-height: 20px;
  .step-item {
    flex: 1;
    text-align: center;
    .title {
      // font-size: 14px;
      // font-weight: 400;
      // color: $Primary;
      // text-align: center;
      // line-height: 20px;
      font-family: 'FZLanTingHei-R-GBK';
      color: $Secendary;
    }
    .time {
      // font-size: 14px;
      // font-weight: 400;
      // color: $Primary;
      // line-height: 20px;
      // font-family: 'Centrale Sans Regular';
      // text-align: center;
    }
    .line-wrap {
      position: relative;
      height: 10px;
      margin: 10px 0;
      .line {
        height: 1px;
        background: rgba($color: $Tertiary, $alpha: 0.6);
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
        width: 12px;
        height: 12px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 12px;
        background: white;
        border: 1px solid $Primary;
        z-index: 2;
      }
    }
    &.current {
      .line-on {
        width: 50%;
      }
      .dot {
        border: none;
        background: $Brand;
      }
    }

    &.pass {
      .line-on {
        width: 100%;
      }
      .dot {
        // background: #000;
        border: none;
        background: $Brand;
      }
    }
  }
}
</style>
