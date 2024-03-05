<template>
  <view :class="[fixed ? $style['navbar-fixed'] : '', $style.navbar]" class="navbar">
    <!-- <view> -->
    <view :class="$style['status-bar']" :style="{ height: `${statusBarHeight}px`, background: bgColor }"></view>
    <nut-navbar :class="$style['nut-navbar']" :style="{ background: bgColor }" :left-show="false" :border="border">
      <template #left v-if="showLeft">
        <block v-if="showBack">
          <block v-if="backIconSlot">
            <slot name="barLeft"></slot>
          </block>
          <image v-else-if="backIcon" :class="$style['icon-back']" :src="backIcon" @tap.stop="goBack" />
          <block v-else>
            <CustomNavBack :line-color="LogoColorType.BLACK" :icon-color="LogoColorType.BLACK" />
          </block>
        </block>
        <!-- <block v-if="showLogo">
          <image v-if="logoIcon" :class="$style['icon-logo']" :src="logoIcon" />
          <image v-else :class="$style['icon-logo']" src="" />
        </block> -->
      </template>
      <template #content>
        <block v-if="isNtitleSlot">
          <slot name="Ntitle"></slot>
        </block>
        <text :class="$style.title_text" v-else-if="title" :style="{ color: fontColor }">{{ title }}</text>
        <image :class="$style.title" :src="iconLogo" v-else></image>
      </template>
    </nut-navbar>
  </view>
  <!-- </view> -->
  <view v-if="isPlaceholder" :style="{ width: '100%', height: fixedHeight + 'px' }"></view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { computed } from 'vue';
import { useAppStore } from '@/stores';
import { dProps, LogoColorType } from './props';
import CustomNavBack from '@/components/CustomNavBack/CustomNavBack.vue';

const emits = defineEmits(['back']);
const props = defineProps(dProps);
const iconLogoLeft = props.showBack ? '70px' : '16px';
const statusBarHeight = computed((): number => {
  return useAppStore().sysInfo.statusBarHeight || 0;
});

const iconLogo = computed(() => {
  return require(`@/static/icon/icon_logo_${props.logoColor}.png`);
});

const fixedHeight = computed(() => {
  return statusBarHeight.value + 44;
});

const goBack = () => {
  // 如果自定义了点击返回按钮的函数，则执行，否则执行返回逻辑
  if (props.customBack) {
    emits('back');
  } else {
    const pages = Taro.getCurrentPages(); // 当前页
    const beforePage = pages[pages.length - 2];
    if (!beforePage) {
      // 从外部链接进来统一返回首页
      goHome();
    } else {
      Taro.navigateBack({ delta: 1 });
    }
  }
};

const goHome = () => {
  Taro.reLaunch({
    url: '/pages/index/index',
  });
};
</script>
<style lang="scss" module>
@import './CustomBar.scss';
.icon-logo {
  position: absolute;
  left: v-bind(iconLogoLeft);
  width: 64px;
  height: 32px;
}
.navbar-fixed {
  position: v-bind(fixedType);
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000;
}
</style>
<style lang="scss">
.navbar {
  .nut-navbar {
    box-shadow: none;
    background: v-bind(bgColor);
    margin-bottom: 0;
  }
  .nut-navbar__left {
    padding: 0;
  }
  .nut-navbar__title {
    min-width: 100%;

    .title {
      font-weight: 600;
      color: v-bind(fontColor);
      font-size: 36rpx;
    }
  }
}
</style>
