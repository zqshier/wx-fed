<template>
  <view :class="$style.box" class="nut-flex nut-row-between">
    <image
      :class="$style.img"
      class="border-05px-box-0"
      :src="imageProcess(infoData.goodsInfo.image, 'S')"
      :lazy-load="true"
      mode="aspectFill"
    ></image>
    <view :class="$style.info" class="f_w-400 nut-flex-1 nut-flex-col nut-row-between">
      <view>
        <!-- 商品名称 -->
        <view :class="$style.title" class="f_s-14 nut-line-2 nut-flex-col">
          {{ infoData.goodsInfo.name }}
        </view>
        <!-- 规格 -->
        <view :class="$style.info_center" class="f_s-12 nut-flex nut-col-center nut-row-left">
          <view :class="$style.info_size" class="nut-flex-1">
            <text :class="$style['info_size-mg']" v-for="comb in infoData.goodsInfo.comb" :key="comb.kId">
              {{ comb.v }}
            </text>
          </view>
        </view>
      </view>

      <!-- 价格,购买件数 -->
      <view :class="$style.info_price" class="f_s-12 nut-flex nut-row-between">
        <view class="f_w-400">
          <CustomPrice :price="infoData.mktPrice" />
        </view>
        <view :class="$style.info_num" v-if="showProductQuantity">
          <text class="f_s-14 f_w-400">x</text> <text>{{ infoData.count || infoData.buyCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { IOrderInfoItems } from '@/dto/order';
import { imageProcess } from '@/utils';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';

const props = defineProps({
  data: {
    type: Object as PropType<IOrderInfoItems>,
    default: [] as any,
  },
  /** 显示购买件数 */
  showProductQuantity: {
    type: Boolean,
    default: true,
  },
});

const infoData = computed((): IOrderInfoItems => {
  // console.log('props.data: ', props.data);
  return props.data!;
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
    .title {
      color: $Secendary;
      font-family: 'FZLanTingHei-R-GBK';
    }
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
            top: 35%;
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

      // .info_status {
      //   color: #bb8c3e;
      // }

      // .btn_refund {
      //   width: 44px;
      //   height: 18px;
      //   border-radius: 50px;
      //   border: 1px solid #989898;
      //   text-align: center;
      //   color: $font-color;
      // }
      // .btn_status {
      //   color: #bb8c3e;
      // }
    }
    .info_price {
      line-height: 26px;
      .info_num {
        color: $Primary;
        font-family: CentraleSans;
      }
    }
  }
}
</style>
