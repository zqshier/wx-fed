<template>
  <view
    class="nut-flex nut-flex-col nut-row-center nut-col-center"
    :class="[$style['empty-box'], mode === 'page' ? $style['empty-page'] : '']"
  >
    <view :class="$style.none" class="nut-flex nut-col-center">
      <image :class="$style['empty-icon']" :src="icon" />
    </view>
    <text :class="$style.title" class="f_s-16">{{ tip }}</text>
    <nut-button
      v-if="showBtn"
      type="primary"
      plain
      :class="$style['empty-btn']"
      :style="btnStyle"
      @click="handleNavigate"
      >去逛逛</nut-button
    >
  </view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { dProps } from './props';
const props = defineProps(dProps);
const iWidth = `${props.imgWidth}px`;
const iHeight = `${props.imgHeight}px`;
const iMbottom = `${props.imgMbottom}px`;
const handleNavigate = () => {
  Taro.reLaunch({
    url: props.url,
  });
};
</script>

<style lang="scss" module>
.empty-box {
  width: 100%;
  height: 100%;
  font-size: 14px;
  z-index: 2;

  &.empty-page {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
  }
  .empty-icon {
    width: v-bind(iWidth);
    height: v-bind(iHeight);
    margin-bottom: v-bind(iMbottom);
  }

  .title {
    line-height: 28px;
    color: $Tertiary;
  }

  .empty-btn {
    margin-top: 24px;
    width: 90px;
    height: 40px;
    background: transparent;
    border: 1px solid $Tertiary;
    color: $Primary;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    padding: 0;
  }
}
</style>
