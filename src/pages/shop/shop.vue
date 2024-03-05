<template>
  <view class="container">
    <CustomBar :backIconSlot="true" :fixed="true" :logo-color="LogoColorType.BLACK">
      <template v-slot:barLeft>
        <CustomNavBack
          :modes="[TYPE_PAGE.SEARCH, TYPE_PAGE.CART]"
          :line-color="LogoColorType.BLACK"
          :icon-color="LogoColorType.BLACK"
        />
      </template>
    </CustomBar>
    <view :class="$style.main">
      <CategoryNav
        v-for="(item, index) in catalogsStore.catalogs"
        :catalogSkip="catalogSkip(item, index)"
        :catalogBanners="catalogBanners(item.id)"
        :catalogInfo="item"
        :idx="index"
        :key="item.id"
      />
    </view>

    <Loading :show="showLoading" />
    <view class="tabbar-placeholder"></view>
  </view>
</template>

<script setup lang="ts">
import { LogoColorType } from '@/components/CustomBar/props';
import CustomNavBack, { TYPE_PAGE } from '@/components/CustomNavBack/CustomNavBack.vue';
// import { MISSIONS_CODE } from '@/constants/missions';
import { useAppStore, useBannerStore, useCartStore, useCatalogStore } from '@/stores';
import { shareOptions } from '@/utils';
import { useDidHide, useDidShow, useShareAppMessage } from '@tarojs/taro';
import { computed, onMounted } from 'vue';
import CategoryNav from './components/CategoryNav/CategoryNav.vue';

const catalogsStore = useCatalogStore();
// const missionsStore = useMissionsStore();
const bannerStore = useBannerStore();
const showLoading = computed(() => !catalogsStore.loaded);

/**
 * 获取分类主图
 * @param catalogId 分类id
 */
const catalogBanners = (catalogId: number) => {
  return bannerStore.getBanners(`cat-banner-${catalogId}`) || [];
};

// 跳转按钮
function catalogSkip(item, index) {
  const obj = {
    skipText: '',
    isShop: false, // 展示商品
  };

  if (index === 0) {
    obj.skipText = '';
    obj.isShop = true;
    return obj;
  }

  item.children.length > 0 ? (obj.skipText = '全部') : (obj.isShop = true);
  return obj;
}

onMounted(async () => {
  catalogsStore.load();
  useCartStore().getCartInfo();
  // getDotaskApi();
});

useDidShow(() => {
  useAppStore().setShowTabbar(true);
  useAppStore().setSelected(1);
});

useDidHide(() => {
  useAppStore().sysInfo.platform === 'android' ? useAppStore().setSelected(-1) : '';
});

useShareAppMessage(() => {
  const shareReturn = shareOptions({ page: '/pages/shop/shop' });
  console.debug('shop page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});

// async function getDotaskApi() {
//   const preload = Taro.getCurrentInstance().preloadData;
//   const hasPageview = missionsStore.list.find(item => item.code === MISSIONS_CODE.pageview);

//   if (!hasPageview && !preload) return;
//   const taskcode = (preload && preload.taskcode) || MISSIONS_CODE.pageview;
//   const params = {
//     code: taskcode,
//     missionId: (preload && preload.taskid) || hasPageview?.id,
//   };
//   try {
//     console.log('params: ', params);
//     const res: any = await getMissionsRecords(params);
//     console.debug('shop page getDotaskApi res=', res);
//     missionsStore.load(); // 任务列表
//   } finally {
//     preload && Taro.preload({});
//   }
// }
</script>
<style lang="scss" module>
.main {
  padding-bottom: 8px;
}
</style>
