<template>
  <BackgroundImage>
    <CustomBar title="" bg-color="transparent" :logo-color="LogoColorType.BLACK" />

    <view :class="$style.main" class="nut-flex nut-flex-col nut-row-center nut-col-center">
      <!-- <image :class="$style.bgImg" :src="cdnurl('static/bg_img.png')" mode="widthFix"></image> -->

      <view :class="$style['main-content']" class="nut-flex-col nut-row-center nut-col-center">
        <LottieView class="lottie" :autoplay="true" :loop="false" assets-path="static/success3.json" />

        <view :class="$style['main-content_title']" class="f_s-20 f_w-400">{{ pageStatusTitle }}</view>
        <view class="f_s-14 f_w-400" v-if="pageStatusTips">{{ pageStatusTips }}</view>
        <view v-if="point > 0" :class="$style['main-content_point']" class="f_s-14 f_w-400"
          >订单完成7天后可获得 {{ point }} 小火苗</view
        >

        <view class="nut-flex nut-row-between">
          <view :class="$style.btn" hover-class="btn-hover" @tap="gotoHomePage">返回首页</view>
          <view :class="$style.btn" hover-class="btn-hover" @tap="handleOrderNo">查看订单</view>
        </view>
      </view>
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { useRouter } from '@tarojs/taro';
import { ref, computed } from 'vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import LottieView from '@/components/LottieView/LottieView.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';

import Taro from '@tarojs/taro';
import { FINISH_TYPE, FINISH_TYPE_URL } from '@/dto/settle';
import { useAppStore } from '@/stores';

const router = useRouter();
const point = ref<number>(Number(router.params.point || 0));
const store = useAppStore();

const routerInfo = ref(Taro.getCurrentInstance().preloadData || {});
const orderNo = ref<string>(routerInfo.value.orderNo || '');
const orderUrlType = ref<string>(routerInfo.value.type || FINISH_TYPE.orderDetails);
const pageStatusTitle = ref<string>(routerInfo.value.title || '下单成功');
const pageStatusTips = ref<string>(routerInfo.value.tips || '');

const type = computed(() => FINISH_TYPE_URL[orderUrlType.value]);

const gotoHomePage = () => {
  store.setSelected(0);
  Taro.switchTab({
    url: '/pages/index/index',
  });
};

const handleOrderNo = () => {
  if (!orderNo.value && orderUrlType.value === FINISH_TYPE.orderDetails) return gotoHomePage();

  const pages = Taro.getCurrentPages(); // 当前页
  const beforePage = pages[pages.length - 2];
  const router_order_details = type.value.substring(1);
  // console.log('router_order_details: ', router_order_details);

  if (!beforePage) {
    gotoOrderDetailsPage();
  } else {
    const current_route = beforePage.route;
    if (current_route === router_order_details) {
      Taro.navigateBack({ delta: 1 });
    } else {
      gotoOrderDetailsPage();
    }
  }
};

const gotoOrderDetailsPage = () => {
  Taro.redirectTo({
    url: `${type.value}?orderNo=${orderNo.value}`,
  });
};
</script>

<style lang="scss" module>
.main {
  width: 100%;
  height: 100%;
  width: 375px;
  .bgImg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  &-content {
    z-index: 2;
    margin-top: 176px;
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    .main-content_title {
      // margin: 16px 0 76px 0;
      margin-top: 16px;
      line-height: 28px;
    }
    .main-content_point {
      color: #f00;
      font-family: 'FZLanTingHei-R-GBK';
    }
  }

  .btn {
    margin-top: 52px;
    margin-right: 16px;
    color: $primary-color;
    display: flex;
    height: 40px;
    padding: 0px 24px;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border: 1px solid var(--Tertiary, #a5a5a5);
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
