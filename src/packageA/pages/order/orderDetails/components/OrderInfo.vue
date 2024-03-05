<template>
  <view :class="$style['order_info']" class="f_s-12 f_w-400">
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">订单编号</text>
      <view class="nut-flex nut-col-baseline nut-row-center">
        <text :class="$style.right">{{ infoData?.orderNo }}</text>
        <view :class="$style.copy" @tap="handleOrderNoCopy">复制</view>
      </view>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">创建时间</text>
      <text :class="$style.right">{{ createTime }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12" v-if="completeTime">
      <text :class="$style.left">完成时间</text>
      <text :class="$style.right">{{ completeTime }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12" v-if="completedStatus">
      <text :class="$style.left">获得小火苗</text>
      <text :class="$style.right">{{ pointText }}小火苗</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12" v-if="infoData?.memo">
      <text :class="$style.left">订单备注</text>
      <text :class="[$style.right, $style.rightMaxW]">{{ infoData?.memo }}</text>
    </view>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro';
import { Toast } from '@/utils';
import { computed, PropType } from 'vue';
import { format } from 'date-fns';
import { ORDER_STATUS } from '@/constants';
import { IOrderInfo } from '@/dto/order';

const props = defineProps({
  data: {
    type: Object as PropType<IOrderInfo | null>,
    default: null,
  },
});

const infoData = computed((): IOrderInfo | null => {
  return props.data || null;
});

const createTime = computed((): string => {
  return infoData.value?.createTime ? format(new Date(infoData.value?.createTime), 'yyyy-MM-dd HH:mm') : '';
});

const completeTime = computed((): string => {
  return infoData.value?.completeTime ? format(new Date(infoData.value?.completeTime), 'yyyy-MM-dd HH:mm') : '';
});

const pointText = computed(() => {
  const gItems = infoData.value?.generateRights;
  const points = gItems?.filter(item => item.type === 'point');
  // const point = (points && points[0] && points[0].value) || 0;

  let point = 0;
  if (points && points.length > 0) {
    points.forEach(item => {
      if (item.value > 0) {
        point += item.value;
      }
    });
  }
  return point;
});

const completedStatus = computed((): boolean => {
  return (infoData.value?.status === ORDER_STATUS.COMPLETED && pointText.value > 0) || false;
});

const handleOrderNoCopy = () => {
  console.log('handleOrderNoCopy: ');
  if (!infoData.value?.orderNo) return;
  Taro.setClipboardData({
    data: infoData.value?.orderNo,
    success() {
      Toast('订单号已复制');
    },
  });
};
</script>

<style lang="scss" module>
.order_info {
  color: $font-color;
  .info_item {
    align-items: baseline;
    width: 100%;
    color: $Tertiary;
    font-family: 'FZLanTingHei-R-GBK';
    &:last-child {
      margin-bottom: 0;
    }
  }
  .left {
    color: $Tertiary;
  }
  .right {
    font-weight: 500;
    color: $Primary;
    font-family: 'CentraleSans-medium';
  }
  .rightMaxW {
    max-width: 235px;
  }

  .copy {
    width: 36px;
    height: 16px;
    text-align: center;
    font-size: 10px;
    line-height: 16px;
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    font-weight: 400;
    border-radius: 8px;
    background: #eee;
    margin-left: 8px;
  }
}
</style>
