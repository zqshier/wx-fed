<template>
  <view :class="$style.content" class="nut-flex-col nut-col-center nut-row-center f_w-400">
    <image :class="$style.icon" src="../../../image/warning.png" class="mg-bottom-16" v-if="!isAnimated"></image>

    <LottieView
      class="mg-bottom-16"
      :autoplay="true"
      :loop="false"
      assets-path="static/success3.json"
      v-if="isAnimated"
    />

    <view :class="$style.title" class="f_s-20">{{ title }}</view>
    <view :class="$style.tips" class="f_s-14">{{ tips }}</view>

    <nut-button :class="$style.btn" type="default" plain @tap="goHome">返回首页</nut-button>
  </view>
</template>

<script setup lang="ts">
import LottieView from '@/components/LottieView/LottieView.vue';
import Taro from '@tarojs/taro';

defineProps({
  title: {
    type: String,
    default: '',
  },
  tips: {
    type: String,
    default: '',
  },
  isAnimated: {
    type: Boolean,
    default: false,
  },
});

function goHome() {
  Taro.switchTab({ url: '/pages/index/index' });
}
</script>

<style lang="scss" module>
.content {
  margin-top: 176px;
  width: 100%;
  color: $Primary;
  text-align: center;
  font-family: 'FZLanTingHeiS-R-GB';
  .title,
  .tips {
    z-index: 2;
  }
  .icon {
    width: 48px;
    height: 48px;
  }
  .btn {
    color: $Primary;
    background: transparent;
    margin-top: 52px;
    border-radius: 20px;
    border: 1px solid $Tertiary;
  }
}
</style>
