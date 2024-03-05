<template>
  <view class="tab-bar" v-if="showTabbar">
    <view
      v-for="(item, index) in list"
      :key="item.pagePath"
      class="tab-bar-item"
      @tap="switchTab(index, item.pagePath)"
    >
      <image class="icon" :src="selected === index ? item.selectedIconPath : item.iconPath" />
      <view
        class="text"
        :style="{ color: selected === index ? selectedColor : color, fontWeight: selected === index ? 600 : 400 }"
        >{{ item.text }}</view
      >
      <view class="tab-bar-circle" :style="{ background: selected === index ? '#fff' : 'transparent' }"></view>
    </view>
    <!-- <view class="tab-bar-circle" :style="{ transform: `translate(${8 + 70 * selected}px, 9px)` }"></view> -->
  </view>
</template>

<script setup lang="ts">
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import { useAppStore, useUserStore } from '@/stores';
import Taro, { getApp } from '@tarojs/taro';
import { computed } from 'vue';

const store = useAppStore();
const selected = computed(() => store.getSelected);
const showTabbar = computed(() => store.showTabbar);

const color = '#A5A5A5';
const selectedColor = '#333333';
const list = [
  {
    pagePath: '/pages/index/index',
    selectedIconPath: require('@/static/tabbar/home-c.png'),
    iconPath: require('@/static/tabbar/home.png'),
    text: '首页',
  },
  {
    pagePath: '/pages/shop/shop',
    selectedIconPath: require('@/static/tabbar/shop-c.png'),
    iconPath: require('@/static/tabbar/shop.png'),
    text: '产品商城',
  },
  {
    pagePath: '/pages/verify/verify',
    selectedIconPath: require('@/static/tabbar/verify-c.png'),
    iconPath: require('@/static/tabbar/verify.png'),
    text: '扫码验真',
  },
  {
    pagePath: '/pages/pointmall/pointmall',
    selectedIconPath: require('@/static/tabbar/point-c.png'),
    iconPath: require('@/static/tabbar/point.png'),
    text: '积分有礼',
  },
  {
    pagePath: '/pages/mine/mine',
    selectedIconPath: require('@/static/tabbar/mine-c.png'),
    iconPath: require('@/static/tabbar/mine.png'),
    text: '会员中心',
  },
];

const linkflow = getApp()[`${process.env.APP_ID}`];

function switchTab(index, url) {
  console.debug('linkflow', linkflow);
  // 埋点 底部菜单点击
  linkflow.track({
    event: ELinkflowEventsName.BottomMenu_Click,
    props: {
      loginStatus: useUserStore().isMemberLevel,
      menuId: index,
      menuName: list[index].text,
    } as ILinkflowEventsProps,
  });

  const currentPage = Taro.getCurrentInstance().page?.route;
  if (url === '/pages/verify/verify') {
    console.debug('verify code: 点击tarbar');
    Taro.preload({ prePage: currentPage, refererName: 'tabbar栏' });
    Taro.switchTab({ url: `/pages/verify/verify` });
    return;
  }
  setSelected(index);
  Taro.switchTab({ url });
}

function setSelected(index) {
  store.setSelected(index);
}
</script>

<style lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 112px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 9px 16px 0;
  pointer-events: auto;
  background: rgba(165, 165, 165, 0.08);
  box-shadow: inset 16.1667px -16.1667px 16.1667px rgba(165, 165, 165, 0.077),
    inset -16.1667px 16.1667px 16.1667px rgba(255, 255, 255, 0.077);
  border-radius: 50px 50px 0px 0px;
  backdrop-filter: blur(7.76px);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(10px);
    z-index: -1;
  }

  .tab-bar-item {
    position: relative;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 64px;
    height: 84px;

    .icon {
      width: 20px;
      height: 20px;
      margin-bottom: 7px;
    }

    .text {
      font-size: 10px;
    }
  }

  .tab-bar-circle {
    position: absolute;
    top: 0;
    width: 84px;
    height: 84px;
    border-radius: 84px;
    background: transparent;
    z-index: -1;
  }
}
</style>
