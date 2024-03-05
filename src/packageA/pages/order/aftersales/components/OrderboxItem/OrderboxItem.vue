<template>
  <view :class="$style['order-box-layout']" v-if="infoData" @tap="gotoServeDetails">
    <view :class="$style['item-top']" class="f_s-12 f_w-400 nut-flex nut-row-between nut-col-center">
      <view :class="$style['item-top-l']" class="nut-flex nut-col-center nut-row-left nut-flex-1">
        <text>订单号：{{ infoData.orderNo }}</text>
        <image :class="$style.copy_image" src="@/static/icon/copy.png" @tap.stop="handleOrderNoCopy"></image>
      </view>
      <view :class="$style.status">
        {{ AFTER_SALE_REFUND_TEXT[infoData.type] }}
      </view>
    </view>
    <view :class="$style['order-item']">
      <OrderItem :data="orderItems" :showPrice="true" />
    </view>

    <view :class="$style['item-bottom']" class="f_s-12 f_w-600 nut-flex nut-row-between">
      <text v-if="infoData.type === RefundType.MONEY_ONLY">
        {{ AFTER_SALE_STATUS_MONEY_ONLY_TEXT[infoData.status] }}</text
      >
      <text v-if="infoData.type === RefundType.MONEY_GOODS">
        {{ AFTER_SALE_STATUS_MONEY_GOODS_TEXT[infoData.status] }}</text
      >

      <view :class="$style['item-bottom-left']" class="f_w-400 nut-flex nut-row-left">
        <text :class="$style['left-title']">退款金额</text>
        <!-- <CustomPrice
          :price="infoData.totalRefundAmount"
          :price-font="12"
          :price-weight="400"
          :priceColor="variables.primaryColor"
        /> -->
        <text class="numfnt">¥{{ infoData.totalRefundAmount }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, PropType } from 'vue';
import { Toast } from '@/utils';
import { IAftersalesInfo, RefundType } from '@/dto/aftersales';
import {
  AFTER_SALE_REFUND_TEXT,
  AFTER_SALE_STATUS_MONEY_ONLY_TEXT,
  AFTER_SALE_STATUS_MONEY_GOODS_TEXT,
} from '@/constants';
import { IOrderInfoItems } from '@/dto/order';
import { useAfterSalesStore } from '@/stores';
// import variables from '@/scss/variables';
import OrderItem from '@/components/OrderItem/OrderItem.vue';
// import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';
const props = defineProps({
  data: {
    type: Object as PropType<IAftersalesInfo>,
    defalut: {},
  },
});

const infoData = computed((): IAftersalesInfo | null => {
  return props.data || null;
});

const orderItems = computed((): IOrderInfoItems[] => {
  const result: IOrderInfoItems[] = [];
  if (props.data?.orderItem) result.push(props.data?.orderItem);
  return result;
});

const handleOrderNoCopy = () => {
  if (!infoData.value) return;
  Taro.setClipboardData({
    data: infoData.value?.orderNo,
    success() {
      Toast('订单号已复制');
    },
  });
};

const gotoServeDetails = () => {
  const afterSaleNo = infoData.value?.afterSaleNo || '';
  if (!afterSaleNo) return;
  useAfterSalesStore().setOrderItemInfo(infoData.value);
  Taro.navigateTo({
    url: `/packageA/pages/order/aftersalesDetails/aftersalesDetails?afterSaleNo=${afterSaleNo}`,
  });
};
</script>

<style lang="scss" module>
.order-box-layout {
  .item-top {
    width: 311px;
    height: 26px;
    padding-bottom: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #e6e6e6;
    &-l {
      color: $Tertiary;
      font-family: 'FZLanTingHei-R-GBK';
      line-height: 18px;
      .copy_image {
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }
    .status {
      color: $Primary;
      font-family: 'FZLanTingHei-R-GBK';
    }
  }
  .order-item {
    margin: 16px 0;
  }
  .item-bottom {
    padding: 8px 16px;
    width: 311px;
    height: 34px;
    border-radius: 4px;
    background: var(--block, #eee);
    box-sizing: border-box;
    color: $Primary;
    font-family: 'FZLanTingHeiS-B-GB';
    .item-bottom-left {
      // line-height: 18px;
      font-family: 'FZLanTingHei-R-GBK';
      align-items: baseline;
      .left-title {
        margin-right: 4px;
      }
    }
  }
}
</style>
