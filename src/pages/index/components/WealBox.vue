<template>
  <view :class="$style.layout" class="nut-flex nut-row-between nut-col-top">
    <view
      :class="$style.layout_item"
      class="nut-flex-1 nut-flex-col nut-row-center nut-col-center"
      v-for="item in list"
      :key="item.id"
      @tap="goToPage(item)"
    >
      <image :class="$style.image" :src="item.src"></image>
      <text class="f_s-14">{{ item.title }}</text>
    </view>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { computed } from 'vue';
import { useBannerStore } from '@/stores';
import { handleLink } from '@/utils';
import { IBanner } from '@/dto/banner';
import { tarckEvents, IEventsName } from '@/utils/track';

const bannerStore = useBannerStore();
const list = computed((): IBanner[] => bannerStore.getBanners('jingangqu'));

function goToPage(item: IBanner) {
  tarckEvents([
    {
      path: 'pages/index/index',
      event: IEventsName.BANNER_CL,
      properties: { name: item.title, id: item.id, group: item.group },
    },
  ]);

  // 首页扫码带来源参数
  if (item.link === '/pages/verify/verify') {
    console.debug('verify code: 点击金刚区');
    // Taro.preload({ scene: '首页' });
    Taro.scanCode({
      success: res => {
        console.debug('index page verify pages res=', JSON.stringify(res));
        let scene = '';
        if (res.path) {
          try {
            scene = ((res.path.split('?') || [])[1] || '').split('=')[1];
          } catch (e) {
            scene = '';
          }
        }

        console.debug('verify pages res scene=', scene);
        // 金刚区点击进入验真页
        Taro.preload({ code: scene, refererName: '金刚区' });
        Taro.navigateTo({ url: `/pages/verification/verification?scene=${scene}&refererName=金刚区` });
      },
    });
    return;
  }

  handleLink(item.linkType, item.link, item.mpAppId);
}
// console.debug('.....list', list);
</script>
<style lang="scss" module>
.layout {
  width: 375px;
  padding: 40px 16px;
  &_item {
    color: $primary-color;
    .image {
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
    }
  }
}
</style>
