<template>
  <view :class="$style.box" class="nut-flex nut-row-between">
    <image
      :class="$style.img"
      class="border-05px-box-0"
      :src="imageProcess(infoData.goodsInfo.image, 'S')"
      :lazy-load="true"
      mode="aspectFill"
    ></image>
    <view :class="$style.info" class="f_w-400">
      <view class="nut-flex nut-row-between nut-col-top mg-bottom-4">
        <!-- 商品名称 -->
        <view
          :class="[$style.title, { [$style['title_width']]: showPrice && !showPriceEnd }]"
          class="f_s-14 nut-line-2 nut-flex-col"
        >
          {{ infoData.goodsInfo.name }}
        </view>
        <!-- 价格 -->
        <CustomPrice
          :class="$style.price"
          v-if="showPrice && !showPriceEnd"
          :price="infoData.mktPrice"
          :unitFont="12"
          :priceFont="16"
          :priceColor="variables.secendary"
        />
      </view>

      <view class="nut-flex nut-col-bottom nut-row-between">
        <!-- 规格 -->
        <view :class="$style.info_center" class="f_s-12 nut-flex nut-col-center nut-row-left">
          <view :class="$style.info_size" class="nut-flex-1">
            <text :class="$style['info_size-mg']" v-for="comb in infoData.goodsInfo.comb" :key="comb.kId">
              {{ comb.v }}
            </text>
          </view>

          <!-- 退款按钮 -->
          <view v-if="isShowBtn" :class="$style.btn_refund" @tap.stop="handleRefund">退款</view>
        </view>

        <!-- 购买件数 -->
        <view :class="$style.info_price" class="nut-flex numfnt f_s-12 f_w-400">
          <!-- 售后状态 -->
          <view
            v-if="serveStatus(infoData).status && !showPriceEnd"
            :class="$style.status"
            :style="{ color: serveStatus(infoData).color }"
            >{{ serveStatus(infoData).status }}
          </view>
          <text :class="$style.quantity"> x {{ infoData.count || infoData.buyCount }}</text>
        </view>
      </view>

      <!-- 价格在低部 -->
      <view class="nut-flex f_s-12 nut-row-between" v-if="showPrice && showPriceEnd">
        <!-- 价格 -->
        <CustomPrice :class="$style.price" v-if="showPrice" :price="infoData.mktPrice" :unitFont="12" />
        <!-- 订单状态 -->
        <view v-if="serveStatus(infoData).status" :class="$style.status" :style="{ color: serveStatus(infoData).color }"
          >{{ serveStatus(infoData).status }}
        </view>
        <view v-if="showStatus && !serveStatus(infoData).status" :class="[$style.status, $style.info_status]"
          >{{ ORDER_STATUS_TEXT[ORDER_STATUS.PENDING_SHIPMENT] }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { IOrderInfoItems } from '@/dto/order';
import { SERVE_STATUS, SERVE_STATUS_TEXT, ORDER_STATUS, ORDER_STATUS_TEXT } from '@/constants';
import { isEmpty } from 'lodash';
import { imageProcess } from '@/utils';
import variables from '@/scss/variables';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';
import Taro from '@tarojs/taro';

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
  /** 显示订单状态 */
  showStatus: {
    type: Boolean,
    default: false,
  },
  /** 显示价格 */
  showPrice: {
    type: Boolean,
    default: true,
  },
  /** 显示价格在底部 */
  showPriceEnd: {
    type: Boolean,
    default: false,
  },
});

const infoData = computed((): IOrderInfoItems => {
  return props.data!;
});

const handleRefund = async () => {
  const data = [{ ...infoData.value }];
  Taro.navigateTo({
    url: `/packageA/pages/order/refund/refund?data=${JSON.stringify(data)}`,
  });
};

const serveStatus: any = computed(() => (item: IOrderInfoItems) => {
  const { serveStatus } = item;
  if (isEmpty(serveStatus)) return '';

  let result = {
    color: '',
    status: '',
  };

  if (Number(serveStatus.goodsRefundableAmount) === 0) {
    result.status = SERVE_STATUS_TEXT[serveStatus.serveStatus];
  }

  if (serveStatus.serveStatus === SERVE_STATUS.SERVING) {
    result.color = '#F00';
  }

  // if (serveStatus.serveStatus === SERVE_STATUS.CLOSE) {
  //   result.color = '#0B4730';
  // }

  return result;
});
</script>

<style lang="scss" module>
.box {
  width: 100%;
  .img {
    margin-right: 16px;
    width: 72px;
    height: 80px;
    background: #fff;
  }
  .info {
    height: 80px;
    // width: 223px;
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: center;
    .title {
      color: $Secendary;
      font-family: 'FZLanTingHei-R-GBK';
      &_width {
        width: 164px;
      }
    }
    // .price {
    //   // margin-top: 2px;
    // }
    .info_center {
      .info_size {
        font-family: 'FZLanTingHei-R-GBK';
        color: $Tertiary;
        line-height: 18px;
        &-mg {
          position: relative;
          padding-right: 4px;
          margin-right: 4px;
          &::after {
            content: ',';
            position: absolute;
            top: 38%;
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
      .status {
        color: $Primary;
        font-family: 'CentraleSans';
        font-size: 12px;
        // line-height: 18px;
      }
      .info_status {
        color: #bb8c3e;
      }

      .btn_refund {
        width: 44px;
        height: 18px;
        border-radius: 50px;
        border: 1px solid #989898;
        text-align: center;
        color: $font-color;
      }
      // .btn_status {
      //   color: #bb8c3e;
      // }
    }
    .info_price {
      margin-left: 8px;
      color: $Tertiary;
      align-items: baseline;
    }
    .quantity {
      margin-left: 8px;
    }
  }
}
</style>
