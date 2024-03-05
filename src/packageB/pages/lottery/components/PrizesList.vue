<template>
  <view :class="$style.layout">
    <CustomTitle title="活动奖品" tips="完成任务参与抽奖即有机会获得" />

    <view :class="$style.list">
      <view class="nut-flex nut-flex-wrap nut-row-top">
        <block v-for="item in listData" :key="item.name">
          <view :class="$style.list_item">
            <image
              :class="$style.item_img"
              :src="imageProcess(item.image2 || item.image, 'S', 'png')"
              mode="aspectFill"
              :lazy-load="true"
            ></image>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { imageProcess } from '@/utils/index';
import { computed } from 'vue';
import CustomTitle from './CustomTitle.vue';

const props = defineProps(['list', 'isOut']);

const listData = computed(() => {
  return props.list;
});
</script>
<style lang="scss" module>
.layout {
  width: 375px;
  padding: 32px 0 50px;
  .list {
    width: 375px;
    padding: 26px 27px 18px;
    &_item {
      position: relative;
      .item_img {
        width: 95px;
        height: 78px !important;
        margin: 6px;
        border-radius: 10px;
        box-shadow: 0 4px 10px 0 rgba(165, 165, 165, 0.5);
        z-index: 1;
      }
    }
  }
}
</style>
