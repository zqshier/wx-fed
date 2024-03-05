<template>
  <view :class="$style['shop-wrap']" @tap="goOrderDetails(dataInfo.id)" v-if="dataInfo.image">
    <image
      :class="$style['shop-wrap_img']"
      class="border-05px-box-0"
      mode="aspectFill"
      :src="imageProcess(dataInfo.image, 'S')"
    ></image>
    <view :class="$style['shop-wrap_info']" class="f_s-14">
      <view :class="$style['info-name']" class="nut-line-1">{{ dataInfo.name }}</view>
      <view :class="$style['info-price']" class="f_s-10 f_w-500 numfnt-medium" v-if="showPrice"
        >¥{{ dataInfo.price }}</view
      >
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ICatalog } from '@/dto/goods';
import { imageProcess } from '@/utils';
import Taro from '@tarojs/taro';
import { PropType, computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  showPrice: {
    type: Boolean,
    default: true,
  },
  catalogInfo: {
    type: Object as PropType<ICatalog>,
    default: () => {},
  },
});

const emits = defineEmits(['track']);

const dataInfo = computed(() => {
  return props.data;
});

const goOrderDetails = (id: number = 0) => {
  if (!props.showPrice) {
    goSecondClassify(id);
    return;
  }

  const skus = (dataInfo.value?.skus && dataInfo.value?.skus[0]) || {};
  emits('track', {
    productSort: props.catalogInfo.name,
    skuId: skus?.barcode || '',
    outerSkuId: skus.sn || '',
    miniSkuId: `${skus?.id || ''}`,
  });

  Taro.navigateTo({
    url: `/packageA/pages/goodsDetail/goodsDetail?id=${id}`,
  });
};

const goSecondClassify = (id: number) => {
  emits('track', {
    productSort: props.catalogInfo.name,
    productSubdivide: dataInfo.value.name,
    productSubdivideId: `${id}`,
  });

  Taro.navigateTo({
    url: `/packageA/pages/secondClassify/secondClassify?sonId=${id}&parId=${props.catalogInfo.id}&title=${props.catalogInfo.name}&sonTitle=${dataInfo.value.name}`,
  });
};
</script>

<style lang="scss" module>
.shop-wrap {
  margin-left: 10px;
  .shop-wrap_img {
    width: 90px;
    height: 100px;
    background: #fff;
  }
  &_info {
    .info-name {
      font-family: 'FZLanTingHei-R-GBK';
      margin-top: 8px;
      width: 90px;
      display: block;
    }
    .info-price {
      margin-top: 4px;
    }
  }
}
</style>
