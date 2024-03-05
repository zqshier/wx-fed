<template>
  <view :class="$style['goods-details-layout']" class="nut-flex nut-flex-col nut-col-top nut-row-left">
    <view :class="$style['details-item']" v-for="(item, index) in contents" :key="index">
      <view
        v-if="item.type === 'image'"
        :class="$style['details-item-img']"
        @tap="handlePreviewImage(item.content)"
        :style="(imageSizes.get(imageProcess(item.content, 'L')) as any)"
      >
        <image
          :class="$style['image']"
          :data-id="imageProcess(item.content, 'L')"
          :src="imageProcess(item.content, 'L')"
          @load="onImageLoad"
          :lazy-load="true"
        />
      </view>
      <template v-if="item.type === 'text'">
        <view
          :class="[$style['details-item-text'], { [$style.marginTop_0]: index === 0 }]"
          v-for="text in item.content.split('\n')"
          :key="text"
        >
          <text :userSelect="true">{{ text }}</text>
        </view>
      </template>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Taro from '@tarojs/taro';
import { imageProcess } from '@/utils';
import { GoodsDetailInfo } from '@/dto/goods';

interface IImageSize {
  width: string;
  height: string;
}

const props = defineProps<{
  contents: GoodsDetailInfo[];
}>();

const imageSizes = ref<Map<string, IImageSize>>(new Map());

function onImageLoad(evt) {
  const { width, height } = evt.detail;
  const maxWidth = 339;
  const scale = maxWidth / width;
  imageSizes.value.set(evt.currentTarget.dataset.id, {
    width: Taro.pxTransform(maxWidth),
    height: Taro.pxTransform(height * scale),
  });
}

const handlePreviewImage = (url: string) => {
  const urls = props.contents?.filter(o => o.type === 'image').map(o => o.content);
  if (!urls || !urls.length) return;
  Taro.previewImage({
    current: url,
    urls,
  });
};
</script>

<style lang="scss" module>
.goods-details-layout {
  width: 375px;
  height: auto;
  padding: 0 18px;
  .details-item {
    .details-item-img {
      max-width: 339px;
      min-height: 10px;
      .image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .details-item-text {
    width: 339px;
    font-size: 14px;
    font-weight: 400;
    color: $font-color;
    line-height: 22px;
    margin: 20px 0;
    white-space: pre-wrap;
  }
  .marginTop_0 {
    margin-top: 0;
  }
}
</style>
