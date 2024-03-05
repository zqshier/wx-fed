<template>
  <view class="nut-flex nut-row-between" :class="$style.itemBox">
    <image :class="$style.image" :src="imageProcess(listData.image, 'S')" mode="aspectFill"></image>
    <view class="nut-flex-col" :class="$style.itemBox_content">
      <view class="f_w-600" :class="$style['content-type']">{{ listData.name }}</view>
      <view class="f_s-12 f_w-400" :class="$style['content-time']"
        >中奖日期: {{ format(new Date(listData.createdAt), 'yyyy.MM.dd HH:mm') }}</view
      >
    </view>
    <block v-if="isGoods">
      <view
        v-if="haveAddr || isExpired"
        class="nut-flex nut-row-center f_s-12 f_w-400"
        :class="[$style.itemBox_btn, $style['itemBox_btn-unfilled'], { [$style['itemBox_btn-expire']]: isExpired }]"
        @tap="clickAddress"
        >未填信息</view
      >
      <view v-else class="nut-flex nut-row-center f_s-12 f_w-400" :class="$style.itemBox_btn">已填信息</view>
    </block>
    <view v-else class="nut-flex nut-row-center f_s-12 f_w-400" :class="$style.itemBox_btn">已中奖</view>
  </view>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { imageProcess } from '@/utils';
import { prizeType } from '@/dto/prizes';

const emits = defineEmits(['clickAddr']);
const props = defineProps(['listItem']);

const listData = computed(() => {
  return props.listItem;
});

const isGoods = computed((): boolean => {
  return listData.value.type === prizeType.goods;
});

const isExpired = computed((): boolean => {
  return listData.value.state === 'expired';
});

const haveAddr = computed((): boolean => {
  return isEmpty(listData.value.addr);
});

const clickAddress = () => {
  if (isExpired.value) return;
  emits('clickAddr', listData.value.id);
};
</script>
<style lang="scss" module>
@import './listItem.scss';
</style>
