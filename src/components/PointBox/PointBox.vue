<template>
  <view :class="$style.layout" class="nut-flex nut-col-center">
    <image :class="$style.layout_bg" mode="aspectFit" :src="cdnurl('static/point_bg2.png')"></image>

    <view class="f_w-600" :class="$style['layout_left']">
      <view class="f_s-21">{{ props.value }} <text :class="$style.flame" class="f_s-8">小火苗</text> </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { cdnurl } from '@/utils';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  isGet: {
    type: Boolean,
    default: false,
  },
});
</script>
<style lang="scss" module>
.layout {
  width: 237px;
  height: 92px;
  border-radius: 2px;
  overflow: hidden;
  .layout_bg {
    position: absolute;
    width: 237px;
    height: 92px;
  }
  .layout_left {
    z-index: 2;
    margin-left: 18px;
    color: #333;
    font-family: 'FZLanTingHei-B-GBK';
    .flame {
      line-height: 18px;
      display: inline-block;
    }
  }
}
</style>
