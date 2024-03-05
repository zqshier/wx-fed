<template>
  <view :class="$style['goods_info']" class="f_s-12 f_w-400">
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-8" v-if="isAmount">
      <text :class="$style.left">商品总额</text>
      <text :class="$style.right">￥{{ infoData?.goodsAmount }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-8" v-if="!isPointsOrder">
      <text :class="$style.left">运费</text>
      <text :class="$style.right">￥{{ costFreight }}</text>
    </view>

    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12" v-if="isPointsOrder">
      <text :class="$style.left">所需积分数</text>
      <text :class="[$style.right, $style.rightMaxW]">{{ infoData?.payablePoint }} 小火苗</text>
    </view>
    <view
      v-if="Number(infoData?.promotionDiscountAmount)"
      :class="$style['info_item']"
      class="nut-flex nut-row-between mg-bottom-8"
    >
      <text :class="$style.left">活动立减</text>
      <text :class="[$style.right, $style.item_colors]">-￥{{ infoData?.promotionDiscountAmount }}</text>
    </view>
    <view
      v-if="Number(infoData?.couponDiscountAmount)"
      :class="$style['info_item']"
      class="nut-flex nut-row-between mg-bottom-8"
    >
      <text :class="$style.left">优惠券</text>
      <text :class="[$style.right, $style.item_colors]">-￥{{ infoData?.couponDiscountAmount }}</text>
    </view>
    <view v-if="changeAmount" :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-8">
      <text :class="$style.left">订单改价</text>
      <text :class="$style.right">{{ changeAmount }}</text>
    </view>
    <view :class="[$style['info_item'], $style['info_item-payment']]" class="nut-flex nut-row-right mg-bottom-8 f_s-16">
      <text :class="[$style.left, $style['payment-title']]" class="f_s-12">{{
        !isPointsOrder ? '实付款' : '实付'
      }}</text>
      <CustomPrice
        v-if="isAmount"
        :price="infoData?.payableAmount"
        :priceColor="variables.primaryColor"
        :priceFont="16"
        :unitFont="16"
        :priceWeight="600"
      />
      <view :class="$style.point_box" v-if="isPointsOrder">
        <text :class="$style.symbol" v-if="infoData && infoData.payableAmount > '0'">+</text>
        <text class="numfnt f_w-600 f_s-16">{{ infoData?.payablePoint }} </text>
        <text> 小火苗</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { computed, PropType } from 'vue';
import { IOrderInfo } from '@/dto/order';
import variables from '@/scss/variables';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';

const props = defineProps({
  data: {
    type: Object as PropType<IOrderInfo | null>,
    defalut: null,
  },
  isPointsOrder: {
    type: Boolean,
    default: false,
  },
});

const infoData = computed((): IOrderInfo | null => {
  return props.data || null;
});

const changeAmount = computed((): string => {
  if (!infoData.value) return '';
  let text = '';
  const changeAmount: number = Number(infoData.value.changeAmount) || 0;
  if (changeAmount > 0) {
    text = `+￥${infoData.value.changeAmount}`;
  }
  if (changeAmount < 0) {
    text = `-￥${Math.abs(changeAmount)}`;
  }
  return text;
});

const costFreight = computed(() => {
  if (!infoData.value) return '';
  return infoData.value?.costFreight;
});

const isAmount = computed(() => {
  return !props.isPointsOrder || (props.isPointsOrder && infoData.value && infoData.value.payableAmount > '0');
});
</script>

<style lang="scss" module>
.goods_info {
  color: $Primary;
  .info_item {
    width: 100%;
    color: $Tertiary;
    font-family: 'FZLanTingHei-R-GBK';
    .item_colors {
      color: #fe6318;
    }
    .right {
      font-family: 'CentraleSans-medium';
      font-weight: 500;
      color: $Primary;
    }
    &:last-child {
      margin-bottom: 0;
    }
    &-payment {
      padding-top: 11px;
      border-top: 0.5px solid #d9d9d9;
      align-items: baseline;
      .payment-title {
        margin-right: 8px;
      }
    }
  }
  .left {
    color: $Tertiary;
  }
  .point_box {
    color: $Primary;
    margin-left: 2px;
    .symbol {
      margin: 0 2px;
    }
  }
}
</style>
