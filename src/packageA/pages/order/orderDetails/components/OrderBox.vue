<template>
  <view :class="$style.box" class="nut-flex nut-row-between" @tap="gotoGoodsDetailsPage">
    <image
      :class="$style.img"
      :src="imageProcess(infoData.goodsInfo.image, 'S')"
      :lazy-load="true"
      mode="aspectFill"
    ></image>
    <view :class="$style.info" class="f_w-400 nut-flex-1 nut-flex-col nut-row-left">
      <view class="nut-flex nut-row-between">
        <view :class="$style.title" class="f_s-14 nut-line-2 nut-flex-col nut-row-between">
          {{ infoData.goodsInfo.name }}
        </view>
        <view class="f_w-400 nut-flex-col nut-col-bottom">
          <view :class="$style.price_bid">
            <CustomPrice :price="infoData.payableAmount" :priceColor="variables.black" />
          </view>
          <view :class="$style.price_pay">
            <CustomPrice :price="infoData.mktPrice" />
          </view>
        </view>
      </view>

      <view :class="$style.info_center" class="f_s-12 nut-flex nut-row-between">
        <view :class="$style.info_size" class="nut-flex-1">
          <text :class="$style['info_size-mg']" v-for="comb in infoData.goodsInfo.comb" :key="comb.kId">
            {{ comb.v }}
          </text>
        </view>

        <view :class="$style.info_num">
          <text class="f_s-14">x</text> <text>{{ infoData.count || infoData.buyCount }}</text>
        </view>
      </view>
      <view :class="$style.info_price" class="f_s-12 nut-flex nut-row-right" v-if="isShowBtn">
        <view :class="$style.btn_refund" @tap.stop="handleRefund">退款</view>
      </view>
      <!-- <view v-if="isShowBtn" class="f_s-12" :class="$style.btn_refund" @tap="handleRefund">退款</view> -->
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, PropType } from 'vue';
import { IOrderInfoItems } from '@/dto/order';
import { imageProcess } from '@/utils';
import variables from '@/scss/variables';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';

const emits = defineEmits(['refundFn']);
const props = defineProps({
  data: {
    type: Object as PropType<IOrderInfoItems>,
    default: [] as any,
  },
  /** 显示退款按钮 */
  isShowBtn: {
    type: Boolean,
    default: false,
  },
});

const infoData = computed((): IOrderInfoItems => {
  return props.data!;
});

const handleRefund = async () => {
  const data = [{ ...infoData.value }];

  emits('refundFn', data);
};

const gotoGoodsDetailsPage = () => {
  Taro.navigateTo({
    url: `/packageA/pages/goodsDetail/goodsDetail?id=${infoData.value.goodsId}`,
  });
};
</script>

<style lang="scss" module>
.box {
  width: 100%;
  .img {
    margin-right: 16px;
    width: 96px;
    height: 96px;
    background: #f7f7f7;
    border-radius: 8px;
  }
  .info {
    box-sizing: border-box;
    height: 96px;
    .title {
      width: 145px;
      color: $font-color;
    }
    .price_bid {
      color: $font-color;
    }
    .price_pay {
      color: $Tertiary;
    }
    .info_center {
      width: 100%;
      margin: 10px 0;
      .info_size {
        color: $Tertiary;
        &-mg {
          position: relative;
          padding-right: 4px;
          margin-right: 4px;
          &::after {
            content: ',';
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            height: 100%;
            transform: translateY(-50%);
          }
        }
        &-mg:last-child {
          padding-right: 0;
          margin-right: 0;
          &::after {
            font-size: 0;
          }
        }
      }

      .info_status {
        color: #bb8c3e;
      }

      .btn_status {
        color: #bb8c3e;
      }
    }
    .info_price {
      width: 100%;
      .info_num {
        color: $font-color;
      }
    }
    .btn_refund {
      margin-left: 155px;
      width: 44px;
      height: 18px;
      border-radius: 50px;
      border: 1px solid #989898;
      text-align: center;
      color: $font-color;
    }
  }
}
</style>
