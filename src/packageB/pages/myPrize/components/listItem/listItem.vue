<template>
  <view class="nut-flex nut-row-between" :class="$style.itemBox">
    <view :class="$style.image_box" class="nut-flex nut-row-center">
      <image :class="$style.image" :src="imageProcess(listData.image, 'S', 'png')" mode="aspectFit"></image>
    </view>
    <view class="nut-flex-col nut-flex-1" :class="$style.itemBox_content">
      <view class="f_s-16 f_w-600" :class="$style['content-type']">{{ listData.name }}</view>
      <view class="f_s-12 f_w-400" :class="$style['content-time']"
        >中奖日期: {{ format(new Date(listData.createdAt), 'yyyy.MM.dd HH:mm') }}</view
      >
    </view>
    <block v-if="isGoods">
      <nut-button
        v-if="haveAddr || isExpired"
        shape="round"
        type="primary"
        size="mini"
        plain
        :class="$style.itemBox_btn"
        :disabled="isExpired"
        @click="clickAddress"
        >完善信息</nut-button
      >
      <nut-button v-else shape="round" type="primary" size="mini" plain :class="$style.itemBox_btn" @click="handleBtn"
        >已填信息</nut-button
      >
    </block>
    <nut-button
      v-else
      shape="round"
      type="primary"
      size="mini"
      plain
      :class="$style.itemBox_btn"
      :loading="btnLoading"
      @click="handleBtn"
      >{{ btnText }}</nut-button
    >
  </view>
</template>
<script setup lang="ts">
import { downImage } from '@/components/PosterBuilder/utils/tools';
import { IRecordsItemList, prizeType } from '@/dto/prizes';
import { Toast, imageProcess } from '@/utils';
import Taro from '@tarojs/taro';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { computed, ref } from 'vue';

const emits = defineEmits(['clickAddr', 'showAddrInfo']);
const props = defineProps(['listItem']);

const btnLoading = ref(false);

const listData = computed((): IRecordsItemList => props.listItem);

const isGoods = computed((): boolean => listData.value.type === prizeType.goods);

const isExpired = computed((): boolean => listData.value.state === 'expired');

const haveAddr = computed((): boolean => isEmpty(listData.value.addr));

const btnText = computed(() => {
  let text = '已发放';
  if (listData.value.type === prizeType.virtual) text = '下载图片';
  return text;
});

const clickAddress = () => {
  if (isExpired.value) return;
  emits('clickAddr', listData.value.id);
};

const handleBtn = () => {
  // 红包类型
  if (listData.value.type === prizeType.redpcove) {
    btnLoading.value = true;
    return Taro.showRedPackage({
      url: listData.value.result || '',
      fail: err => Toast(err.errMsg),
      complete: () => (btnLoading.value = false),
    });
  } else if (listData.value.type === prizeType.virtual) {
    btnLoading.value = true;
    return saveImage(listData.value.image);
  } else if (listData.value.type === prizeType.goods) {
    if (isExpired.value) return;
    emits('showAddrInfo', listData.value.addr);
  }
};

// 长按保存图片
const saveImage = (url = '') => {
  if (!url) return (btnLoading.value = false);
  downImage(url).then(filePath => {
    Taro.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        console.log('saveImg res=', res);
        Toast('保存奖品图片成功');
      },
      fail(err) {
        console.log('saveImg err=', err);
        Toast('保存奖品图片失败');
      },
      complete: () => (Taro.vibrateShort(), (btnLoading.value = false)),
    }).finally(() => (btnLoading.value = false));
  });
};
</script>
<style lang="scss" module>
@import './listItem.scss';
</style>
