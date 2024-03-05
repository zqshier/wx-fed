<template>
  <view :class="$style.orderbox_layout" class="border-05px-box-16" v-if="infoData" @tap="gotoOrderDetailsPage">
    <view :class="$style.item_top" class="nut-flex nut-row-between nut-col-center f_s-12">
      <view :class="$style['item_top-l']" class="nut-flex nut-col-center nut-row-left">
        <text>订单号：{{ infoData.orderNo }}</text>
        <image :class="$style.copy_image" src="@/static/icon/copy.png" @tap.stop="handleOrderNoCopy"></image>
      </view>
      <view
        :class="[$style.status, activeStatus ? $style.status_active : '']"
        class="nut-flex nut-col-baseline nut-row-center"
      >
        {{ ORDER_STATUS_TEXT[infoData.status] }}
        <nut-countdown
          v-if="activeStatus"
          :class="$style.countdown"
          :endTime="new Date(infoData.expirationTime)"
          format="HH:mm:ss"
          @on-end="changeOrderStatus"
        />
      </view>
    </view>
    <view :class="$style.item_center">
      <view :class="$style.order_item">
        <OrderItem :data="infoData.orderItems" />
      </view>

      <view :class="$style.item_bottom" class="nut-flex nut-col-center nut-row-right" v-if="paidStatus">
        <nut-button
          shape="round"
          size="small"
          plain
          type="primary"
          :class="[$style.btn, $style.btn2]"
          @click.stop="openOCancelPop"
          >取消订单</nut-button
        >
        <nut-button shape="round" size="small" type="primary" :class="$style.btn">去支付</nut-button>
      </view>

      <view :class="$style.order_info" class="nut-flex nut-col-baseline nut-row-right f_w-400">
        <view :class="$style['amount-title']" class="nut-flex nut-col-baseline">
          <text class="f_s-10">商品总额：</text>
          <text :class="$style['order_info_num']" class="f_s-12 f_w-500 numfnt-medium"
            >¥{{ infoData.goodsAmount }}</text
          >
        </view>
        <view :class="$style['payment-title']" class="nut-flex nut-col-baseline">
          <text class="f_s-12">实付款：</text>
          <text :class="[$style['order_info_num']]" class="f_s-14 f_w-500 numfnt-medium"
            >¥{{ infoData.payableAmount }}</text
          >
        </view>
      </view>

      <view :class="$style.comment" class="nut-flex nut-col-center nut-row-right" v-if="commentStatus">
        <nut-button
          shape="round"
          size="small"
          type="primary"
          :plain="infoData.commentStatus === OrderCommentStatus.comment"
          :class="$style.btn"
          @click.stop="goComment"
          >{{ infoData.commentStatus === OrderCommentStatus.comment ? '查看评价' : '评价' }}
        </nut-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, PropType } from 'vue';
import { Toast } from '@/utils';
import { IOrderInfo, OrderCommentStatus } from '@/dto/order';
import { useOrderStore } from '@/stores';
import { ORDER_STATUS, ORDER_STATUS_TEXT, TARGET_ORDER_CANCEL_POP } from '@/constants';

import OrderItem from '@/components/OrderItem/OrderItem.vue';

// const useReversible = useReversibleStore();

const props = defineProps({
  data: {
    type: Object as PropType<IOrderInfo>,
    defalut: {},
  },
  tabsId: {
    type: String,
    default: '',
  },
});

const infoData = computed((): IOrderInfo | null => {
  return props.data || null;
});

const activeStatus = computed((): boolean => {
  return (
    infoData.value?.status === ORDER_STATUS.PENDING_PAID
    // infoData.value?.status === ORDER_STATUS.PENDING_SHIPMENT ||
    // infoData.value?.status === ORDER_STATUS.PENDING_RECEIPT
  );
});

const paidStatus = computed((): boolean => {
  return infoData.value?.status === ORDER_STATUS.PENDING_PAID || false;
});

const commentStatus = computed(
  (): boolean =>
    infoData.value?.status === ORDER_STATUS.COMPLETED && infoData.value?.commentStatus !== OrderCommentStatus.close,
);

// const shipmentStatus = computed((): boolean => {
//   return infoData.value?.status === ORDER_STATUS.PENDING_SHIPMENT || false;
// });

// const receiptStatus = computed((): boolean => {
//   return infoData.value?.status === ORDER_STATUS.PENDING_RECEIPT || false;
// });

const openOCancelPop = () => {
  Taro.eventCenter.trigger(TARGET_ORDER_CANCEL_POP, { orderNo: infoData.value?.orderNo, tabsId: props.tabsId });
};

const changeOrderStatus = () => {
  if (!infoData.value?.status) return;
  infoData.value.status = ORDER_STATUS.CANCELED;
};

const handleOrderNoCopy = () => {
  if (!infoData.value) return;
  Taro.setClipboardData({
    data: infoData.value?.orderNo,
    success() {
      Toast('订单号已复制');
    },
  });
};

function goComment() {
  Taro.preload({ goodsData: infoData.value?.orderItems });
  Taro.navigateTo({
    url: `/packageA/pages/order/orderReview/orderReview?orderNo=${infoData.value?.orderNo}&type=${infoData.value?.commentStatus}`,
  });
}

const gotoOrderDetailsPage = () => {
  const orderNo = infoData.value?.orderNo || '';
  if (!orderNo) return;
  useOrderStore().setOrderItemInfo(infoData.value);
  Taro.navigateTo({
    url: `/packageA/pages/order/orderDetails/orderDetails?orderNo=${orderNo}`,
  });
};
</script>

<style lang="scss" module>
@import './ProductItem.scss';
</style>
