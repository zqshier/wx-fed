<template>
  <view :class="$style.item" @tap="goOrderDetails(item)" :style="wrapStyle">
    <view
      :class="$style.item_img"
      class="border-05px-box-0"
      :style="{ width: addUnit(width), height: addUnit(imgHeight) }"
    >
      <image
        mode="aspectFill"
        :src="imageProcess(item.image, 'M')"
        :lazy-load="lazyLoad"
        :class="$style.img_image"
      ></image>
    </view>
    <view :class="$style.item_bottom">
      <view :class="$style.item_title" class="nut-line-1 nut-flex nut-col-top nut-flex-wrap f_s-14">{{
        item.name
      }}</view>
      <view v-show="!isLinkType" :class="$style.item_price" class="nut-flex nut-row-left">
        <view :class="$style['item_price-sales']" class="nut-flex nut-col-bottom f_s-12 f_w-500 numfnt-medium">
          <text>¥{{ item.price }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, CSSProperties } from 'vue';
import { dProps } from './props';
import Taro from '@tarojs/taro';
import { imageProcess } from '@/utils';
import { ITopicTagItem } from '@/dto/topic';
import { toPx } from '../PosterBuilder/utils/tools';

const props = defineProps(dProps);

const wrapStyle = computed((): CSSProperties => {
  let style = {
    width: addUnit(props.width),
    // borderRadius: addUnit(props.borderRadius),
    // backgroundColor: props.bgColor,
    // itMg: addUnit(props.itemMg),
  };
  return style;
});

const isLinkType = computed((): boolean => props.item.itemType === 'link');

const addUnit = unit => {
  // return `${unit}rpx`;
  return `${toPx(unit * 2)}px`;
};
const goOrderDetails = (item: ITopicTagItem) => {
  if (isLinkType.value) {
    Taro.navigateTo({ url: `/pages/webview/webview?src=${encodeURIComponent(item.link)}` });
  } else {
    Taro.navigateTo({
      url: `/packageA/pages/goodsDetail/goodsDetail?id=${item.id}`,
    });
  }
};
// const itMg = addUnit(props.itemMg);

// const checkPoint = (price: string | number) => {
//   const num = parseFloat(String(price));
//   return String(num).indexOf('.') > 0;
// };

// // 获取整数
// const formatThousands = (num: any) => {
//   if (Number(num) == 0) {
//     num = 0;
//   }
//   return Math.trunc(Number(num));
// };
// // 获取小数
// const formatDecimal = (decimalNum: any) => {
//   if (!checkPoint(decimalNum)) return;
//   decimalNum = String(decimalNum).split('.')[1];
//   const result = '0.' + decimalNum;

//   return String(result).substring(1);
// };
</script>
<style lang="scss" module>
.item {
  width: 166px;
  margin-bottom: 16px;
  max-height: 238px;
  box-sizing: border-box;
  .item_img {
    width: 166px;
    height: 184px;
    background: #fff;
    .img_image {
      width: 100%;
      height: 100%;
      // background: $Divide;
    }
  }

  .item_bottom {
    width: 100%;
    margin-top: 12px;
    color: $Secendary;
    .item_title {
      width: 100%;
      margin-bottom: 4px;
    }
  }
}
</style>
