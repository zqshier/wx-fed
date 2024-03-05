<template>
  <view class="container nut-flex nut-row-center nut-col-center" :class="$style.layout">
    <image :class="$style.icon_scan" :src="cdnurl('static/scan.png')"></image>
  </view>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores';
import { cdnurl } from '@/utils';
import Taro, { useRouter } from '@tarojs/taro';
import { onMounted, onUnmounted } from 'vue';

const preloadData = Taro.getCurrentInstance().preloadData || {};
const router = useRouter();
const refererName = router.params.refererName || preloadData.refererName || '微信扫码';
const prePage = router.params.prePage || preloadData.prePage || 'pages/index/index';

onMounted(() => {
  useAppStore().setShowTabbar(false);
  Taro.scanCode({
    success: res => {
      console.debug('verify pages res=', JSON.stringify(res));
      // 判断是否是油品url https://qr.zippo.com/cw-4JpaBVRHj
      const oilLink = 'https://qr.zippo.com/cw-4JpaBVRHj';
      if (res?.result && oilLink.includes(res.result))
        return Taro.redirectTo({ url: `/pages/webview/webview?src=${encodeURIComponent(res.result)}` });

      // 扫码验真
      let scene = '';
      if (res.path) {
        try {
          scene = ((res.path.split('?') || [])[1] || '').split('=')[1] || '';
        } catch (e) {
          scene = '';
        }
      }

      console.debug('verify pages res scene=', scene);
      // TabBar点击进入验真页
      Taro.preload({ code: scene, refererName });
      Taro.redirectTo({ url: `/pages/verification/verification?scene=${scene}&refererName=${refererName}` });
    },
    fail: err => {
      console.debug('verify pages err=', JSON.stringify(err));
      gotoPrePage();
    },
    complete: () => {
      // console.debug('routerInfo', routerInfo.value.prePage);
      useAppStore().setShowTabbar(true);
    },
  });
});

onUnmounted(() => {
  useAppStore().setShowTabbar(true);
});

function gotoPrePage() {
  const url = `/${prePage}`;
  Taro.reLaunch({ url });
}
</script>
<style lang="scss" module>
.layout {
  background-color: $black;
  .icon_scan {
    width: 200px;
    height: 200px;
  }
}
</style>
