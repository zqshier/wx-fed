<template>
  <view v-if="infoData" :class="$style['order-info-layout']" class="f_s-14 f_w-400">
    <view class="box mg-bottom-14">
      <view :class="$style['info-item']" class="mg-bottom-16 nut-flex nut-row-between">
        <text :class="$style.left">商品总额</text>
        <text :class="$style.right">￥{{ infoData.goodsAmount }}</text>
      </view>
      <view :class="$style['info-item']" class="mg-bottom-16 nut-flex nut-row-between">
        <text :class="$style.left">运费</text>
        <text :class="$style.right">￥{{ infoData.costFreight }}</text>
      </view>
      <!-- <view
        :class="$style['info-item']"
        class="mg-bottom-16 nut-flex nut-row-between"
        v-if="infoData.promotionDiscountAmount > '0'"
      >
        <text :class="$style.left">活动立减</text>
        <text :class="[$style.num_color]">￥{{ infoData.promotionDiscountAmount }}</text>
      </view> -->
      <!-- <view :class="$style['info-item']" class="mg-bottom-16 nut-flex nut-row-between" @tap="onShowCoinPop">
        <text :class="$style.left">谷子值抵扣</text>
        <view :class="$style['color-none']" class="nut-flex nut-row-left nut-col-center">
          <text :class="{ [$style.num_color]: pointType === SETTLE_POINT_TYPE_USE && pointBalance > 0 }">{{
            pointText
          }}</text>
          <image :class="$style['icon-right']" src="../../../../../static/icon/arrowLeft.png" />
        </view>
      </view> -->
      <view :class="$style['info-item']" class="mg-bottom-16 nut-flex nut-row-between" @tap="onShowCouponPop">
        <text :class="$style.left">优惠券</text>
        <view :class="[$style.right, $style.right_cou]" class="nut-flex nut-row-left">
          <view :class="$style.num_color" v-if="infoData.couponCodes && infoData.couponCodes.length > 0">
            <text :class="$style.ismemo" class="f_w-500">-￥{{ infoData.couponDiscountAmount }}</text>
            <text v-if="isOptimalCoupon" class="f_w-400"> 已为您选择最优优惠</text>
          </view>

          <text v-else-if="canClaimCouponList" :class="$style.ismemo" class="f_w-500"
            >可领取 {{ canClaimCouponList }} 张优惠券</text
          >

          <text :class="$style['color-none']" v-else>无可用优惠券</text>
          <image :class="$style['icon-right']" src="../../../../../static/icon/arrowLeft.png" />
        </view>
      </view>
      <view :class="[$style['info-item'], $style['info-item-price']]" class="nut-flex f_w-400 nut-row-right">
        <text :class="$style.left">实付款</text>
        <view :class="$style.right">
          <CustomPrice :price="infoData.payableAmount" :price-color="variables.primaryColor" :price-font="18" />
        </view>
      </view>
    </view>
    <view :class="$style.remark" class="box">
      <view :class="$style['info-item']" class="nut-flex nut-col-top nut-row-left f_s-14 f_w-400">
        <text :class="[$style.left, $style['left-note_mg']]">订单备注</text>
        <view :class="$style.note">
          <textarea
            :class="$style.note_text"
            placeholder="订单备注（50字内）"
            placeholderClass=" placeholderStyle"
            :auto-height="true"
            value=""
            :maxlength="50"
            :disableDefaultPadding="true"
            :cursorSpacing="70"
            :adjustPosition="true"
            style="width: 100%; max-height: 40px; font-size: 28rpx"
            @input="orderRemark"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { ISettleInfo } from '@/dto/settle';
// import { SETTLE_POINT_TYPE_NO_USE, SETTLE_POINT_TYPE_USE } from '@/constants';
import variables from '@/scss/variables';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';

const emits = defineEmits(['update:memo', 'update:showCouponPop', 'update:showCoinPop']);

const props = defineProps({
  data: {
    type: Object as PropType<ISettleInfo | null>,
    default: null,
  },
  memo: {
    type: String,
    default: '',
  },
  pointBalance: {
    type: Number,
    default: 0,
  },
  pointType: {
    type: Number,
    default: 0,
  },
  // 最优优惠券文案展示
  isOptimalCoupon: {
    type: Boolean,
    default: false,
  },
  canClaimCouponList: {
    type: Number,
    default: 0,
  },
});

const infoData = computed((): ISettleInfo | null => {
  return props.data || null;
});

// const pointText = computed((): string => {
//   console.log('props.pointType: ', props.pointType);

//   let text = `可用${props.pointBalance}谷子值`;

//   if (props.pointBalance === 0) {
//     return (text = '无可用谷子值');
//   }

//   switch (props.pointType) {
//     case SETTLE_POINT_TYPE_USE:
//       if (infoData.value && infoData.value?.point > 0) {
//         text = `-￥${infoData.value?.pointExchangeMoney}`;
//       }
//       break;
//     case SETTLE_POINT_TYPE_NO_USE:
//       text = '不使用谷子值';
//       break;
//   }
//   return text;
// });

const orderRemark = e => {
  const val = e.detail.value || '';
  emits('update:memo', val);
};

// const onShowCoinPop = () => {
//   emits('update:showCoinPop', true);
// };

const onShowCouponPop = () => {
  emits('update:showCouponPop', true);
};

// const onShowRemarkPop = () => {
//   emits('update:showRemarkPop', true);
// };
</script>
<style lang="scss">
.placeholderStyle {
  color: $Tertiary;
  font-family: 'FZLanTingHei-R-GBK';
}
</style>
<style lang="scss" module>
.order-info-layout {
  color: $font-color;
  .remark {
    border-radius: 8px;
  }
  .info-item {
    width: 100%;
    line-height: 20px;

    .left {
      margin-right: 9px;
      color: $Primary;
      font-family: 'FZLanTingHei-R-GBK';
    }
    .right {
      font-family: CentraleSans;
      font-weight: 500;
    }
    .right_cou {
      align-items: flex-start;
    }
    .icon-right {
      width: 16px;
      height: 16px;
      margin-left: 2px;
    }

    .left-note_mg {
      margin-right: 0;
      margin-top: -2px;
    }
  }
  .info-item-price {
    padding-top: 16px;
    border-top: 0.5px solid var(--divide, #d9d9d9);
  }
  // .right_width {
  //   max-width: 210px;
  // }
  .color-none {
    color: $Tertiary;
    font-size: 12px;
    font-family: 'FZLanTingHei-R-GBK';
    font-weight: 400;
    line-height: 18px;
  }
  .num_color {
    color: $Tertiary;
  }
  .ismemo {
    color: #f00;
  }

  .note {
    width: 239px;
    height: 69px;
    margin-left: 16px;
    &_text {
      min-height: 69px;
    }
  }
}
</style>
