<template>
  <view :class="$style.main" class="nut-flex nut-flex-col nut-row-center nut-col-center">
    <image :class="$style.bgImg" :src="cdnurl('static/bg_img.png')" mode="scaleToFill"></image>

    <view :class="$style['main-content']" class="nut-flex-col nut-row-center nut-col-center" v-if="!$slots.content">
      <image
        :class="$style.icon_success"
        src="../../../static/icon/icon_pay_success.png"
        mode="scaleToFill"
        v-if="showIcon"
      />
      <view :class="$style['main-content_title']" class="f_s-20 f_w-400">{{ title }}</view>

      <view class="nut-flex nut-row-between">
        <view :class="$style.btn" hover-class="btn-hover" @tap="gotoHomePage">返回首页</view>
        <view :class="$style.btn" hover-class="btn-hover" @tap="handleOrderNo">查看订单</view>
      </view>
    </view>

    <slot name="content" v-if="$slots.content"></slot>
  </view>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { cdnurl } from '@/utils';
import { computed } from 'vue';

const props = defineProps({
  orderNo: {
    type: String,
    default: '',
  },
  orderUrlType: {
    type: String,
    default: 'orderDetails',
  },
  paddingTop: {
    type: String,
    default: '176',
  },
  title: {
    type: String,
    default: '下单成功',
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
});

const isGoOrderDetails = computed(() => {
  return props.orderUrlType === 'orderDetails';
});

const gotoHomePage = () => {
  Taro.reLaunch({
    url: '/pages/index/index',
  });
};

const handleOrderNo = () => {
  if (!props.orderNo && isGoOrderDetails.value) return gotoHomePage();

  const pages = Taro.getCurrentPages(); // 当前页
  const beforePage = pages[pages.length - 2];
  const router_order_details = isGoOrderDetails.value
    ? 'packageA/pages/order/orderDetails/orderDetails'
    : '/packageA/pages/aftersales/aftersales';
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
  const url = isGoOrderDetails.value
    ? `/packageA/pages/order/orderDetails/orderDetails?orderNo=${props.orderNo}`
    : '/packageA/pages/order/aftersales/aftersales';

  Taro.redirectTo({
    url,
  });
};

const paddingTop = `${props.paddingTop}px`;
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
  .icon_success {
    width: 48px;
    height: 48px;
  }
  &-content {
    z-index: 2;
    margin-top: v-bind(paddingTop);

    .main-content_title {
      margin: 16px 0 76px 0;
      color: $Primary;
      font-family: 'FZLanTingHei-R-GBK';
      line-height: 28px;
    }
  }

  .btn {
    width: 104px;
    height: 40px;
    line-height: 40px;
    border: 1px solid $primary-color;
    color: $primary-color;
    box-sizing: content-box;
    margin-right: 16px;
    text-align: center;
    border-radius: 20px;
    border: 1px solid $Tertiary;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
