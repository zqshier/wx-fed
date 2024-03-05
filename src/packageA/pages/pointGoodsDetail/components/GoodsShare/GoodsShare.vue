<template>
  <CustomPopup v-model:show="isShow">
    <view :class="$style['share-layout']" class="f_s-12 nut-flex nut-flex-col nut-row-left nut-col-center">
      <view :class="$style.title" class="f_s-16 f_w-400">分享至</view>
      <view :class="$style.main" class="nut-flex nut-col-center nut-row-center">
        <button
          open-type="share"
          plain
          :class="$style['main-item']"
          hover-class="btn-hover"
          class="nut-flex nut-flex-col nut-row-center nut-col-center"
        >
          <image :class="$style.image" src="../../../../../static/icon/wechat-l.png" mode="scaleToFill" />
          <text>微信好友</text>
        </button>
        <view
          :class="$style['main-item']"
          class="nut-flex nut-flex-col nut-row-center nut-col-center"
          hover-class="btn-hover"
          @tap="handleOpenPoster"
        >
          <image :class="$style.image" src="../../../../../static/icon/moment-l.png" mode="scaleToFill" />
          <text>朋友圈</text>
        </view>
      </view>
    </view>
  </CustomPopup>
</template>

<script setup lang="ts">
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { posterSource } from '@/dto/point';
import { usePointsGoodStore } from '@/stores';
import Taro from '@tarojs/taro';
import { computed } from 'vue';

const goodsStore = usePointsGoodStore();

const emits = defineEmits(['update:show', 'update:showPoster', 'track']);
const props = defineProps({ show: { type: Boolean, default: true } });

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const handleOpenPoster = () => {
  emits('track', '微信朋友圈');

  Taro.preload({
    type: `${posterSource.pointGoods}`,
    pointsGoodsInfo: goodsStore.goodsInfo,
    cSkusData: goodsStore.skusData,
  });

  Taro.navigateTo({
    url: `/packageA/pages/posterImage/posterImage`,
  });
};
</script>

<style lang="scss" module>
.share-layout {
  width: 375px;
  height: 209px;
  // background: #fff;
  .title {
    width: 339px;
    height: 60px;
    padding-top: 20px;
    color: $Primary;
    text-align: center;
    line-height: 24px;
    font-family: 'FZLanTingHei-R-GBK';
    // border-bottom: 1px solid #e6e6e6;
    margin: 0 auto;
  }
  .main {
    width: 375px;
    .main-item {
      padding: 30px;
      margin: 0;
      background-color: transparent;
      box-shadow: none;
      color: $Primary;
      font-size: 16px;
      font-family: 'FZLanTingHei-R-GBK';
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      .image {
        width: 48px;
        height: 48px;
        margin-bottom: 4px;
      }
      &.main-item:first-child {
        margin-right: 34px;
      }
      &.main-item:last-child {
        margin-left: 34px;
      }
    }
    .main-item::after {
      border: none;
    }
  }
}
</style>
