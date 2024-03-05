<template>
  <view
    :class="[$style.box, isUnavailable ? $style['box-none'] : '']"
    class="nut-flex nut-row-between"
    @tap="goGoodsDetail"
  >
    <view :class="$style.info_image">
      <image
        :class="$style.image"
        class="border-05px-box-0"
        :src="imageProcess(infoData.image, 'S')"
        :lazy-load="true"
        mode="aspectFill"
      ></image>
      <view
        v-if="isUnavailable"
        :class="$style['info_image-none']"
        class="nut-flex nut-col-center nut-row-center f_s-14"
      >
        <text>{{ infoData.disabled ? '已下架' : '无货' }}</text>
      </view>
    </view>
    <view :class="$style.info" class="f_w-400 nut-flex-1 nut-flex-col nut-row-between">
      <view>
        <!-- 商品名称 -->
        <view :class="$style.title" class="f_s-14 nut-line-1 nut-flex-col mg-bottom-4">
          {{ infoData.name }}
        </view>
        <!-- 规格 -->
        <view :class="$style.info_center" class="f_s-12 nut-flex nut-col-center nut-row-left mg-bottom-8">
          <view :class="$style.info_size" class="nut-flex-1">
            <text :class="$style['info_size-mg']" v-for="comb in infoData.comb" :key="comb.kId">
              {{ comb.v }}
            </text>
          </view>
        </view>
      </view>
      <!-- 价格,购买件数 -->
      <view :class="$style.info_price" class="f_s-12 nut-flex nut-row-between">
        <view class="f_w-400">
          <CustomPrice :price="infoData.price" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { IFavoritesInfo } from '@/dto/goods';
import { imageProcess } from '@/utils';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';
import Taro from '@tarojs/taro';

const props = defineProps({
  data: {
    type: Object as PropType<IFavoritesInfo>,
    default: [] as any,
  },
});

const infoData = computed(() => {
  // console.log('props.data: ', props.data);
  const obj = {
    barcode: '',
    guidePrice: null,
    id: null,
    image: '',
    name: '',
    price: '',
    sn: '',
    disabled: false,
    isSoldOut: false,
    goodsId: null,
    comb: [],
  };
  return props.data || obj;
});

const isUnavailable = computed(() => {
  return infoData.value.disabled || infoData.value.isSoldOut;
});

const goGoodsDetail = () => {
  const { id, goodsId } = infoData.value;

  Taro.navigateTo({
    url: `/packageA/pages/goodsDetail/goodsDetail?id=${goodsId}&skuId=${id}`,
  });
};
</script>

<style lang="scss" module>
.box {
  width: 100%;
  &-none {
    .title,
    .info_size,
    .info_price {
      opacity: 0.3;
    }
  }
  .info_image {
    position: relative;
    .image {
      margin-right: 16px;
      width: 72px;
      height: 80px;
      background: #fff;
    }
    &-none {
      position: absolute;
      top: 12px;
      left: 8px;
      width: 56px;
      height: 56px;
      color: $white;
      background-color: rgba($color: $Primary, $alpha: 0.7);
      border-radius: 32px;
      z-index: 1;
    }
  }

  .info {
    height: 80px;
    .title {
      margin: 4px 0 6px 0;
      color: $Secendary;
      font-family: 'FZLanTingHei-R-GBK';
      line-height: 20px;
    }
    .info_center {
      .info_size {
        font-family: 'FZLanTingHei-R-GBK';
        color: $Tertiary;
        line-height: 18px;
        &-mg {
          position: relative;
          padding-right: 3px;
          margin-right: 3px;
          &::after {
            content: ',';
            position: absolute;
            top: 40%;
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
      .info_price {
        line-height: 26px;
        color: $Primary;
        font-family: 'CentraleSans';
      }
    }
  }
}
</style>
