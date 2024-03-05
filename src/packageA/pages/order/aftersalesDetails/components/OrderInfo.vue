<template>
  <view :class="$style['order_info']" class="f_s-12 f_400" v-if="infoData">
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">订单编号</text>
      <view class="nut-flex nut-row-center nut-col-baseline">
        <text :class="$style.right">{{ infoData?.orderNo }}</text>
        <view :class="$style.copy" @tap="handleOrderNoCopy(infoData?.orderNo)">复制</view>
      </view>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">退款单号</text>
      <view class="nut-flex nut-row-center nut-col-baseline">
        <text :class="$style.right">{{ infoData.afterSaleNo }}</text>
        <view :class="$style.copy" @tap="handleOrderNoCopy(infoData.afterSaleNo)">复制</view>
      </view>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">退款金额</text>
      <text :class="$style.right">￥{{ infoData.totalRefundAmount }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">申请时间</text>
      <text :class="$style.right">{{ createTime }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
      <text :class="$style.left">退款原因</text>
      <text :class="[$style.right, $style.right_font]">{{ infoData.reason || '' }}</text>
    </view>
    <block
      v-if="infoData.extendInfo?.description || (infoData.extendInfo?.images && infoData.extendInfo?.images.length > 0)"
    >
      <view :class="$style['info_item']" class="nut-flex nut-row-between mg-bottom-12">
        <text :class="$style.left">补充说明</text>
        <text :class="[$style.right, $style.right_font, $style.rightMaxW]">{{
          infoData.extendInfo?.description || ''
        }}</text>
      </view>
      <view
        :class="$style['info_item-img']"
        v-if="infoData.extendInfo?.images && infoData.extendInfo?.images.length > 0"
      >
        <block v-for="item in infoData.extendInfo?.images" :key="item">
          <image :class="$style.list_img" mode="aspectFill" :src="imageProcess(item, 'S')" :lazy-load="true" />
        </block>
      </view>
    </block>
  </view>
</template>
<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, PropType } from 'vue';
import { format } from 'date-fns';
import { imageProcess, Toast } from '@/utils';
import { IAftersalesInfo } from '@/dto/aftersales';

const props = defineProps({
  data: {
    type: Object as PropType<IAftersalesInfo | null>,
    defalut: null,
  },
});

const infoData = computed((): IAftersalesInfo | null => {
  return props.data || null;
});

const createTime = computed((): string => {
  return infoData.value?.createdAt ? format(new Date(infoData.value?.createdAt), 'yyyy-MM-dd HH:mm') : '';
});

const handleOrderNoCopy = val => {
  if (!val) return;
  Taro.setClipboardData({
    data: val,
    success() {
      Toast('单号已复制');
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
    // line-height: 18px;
    color: $Tertiary;
    font-family: 'FZLanTingHei-R-GBK';
    &:last-child {
      margin-bottom: 0;
    }
  }
  .info_item-img {
    text-align: end;
  }
  .left {
    color: $Tertiary;
    margin-right: 12px;
  }
  .right {
    font-weight: 500;
    margin-right: 8px;
    color: $Primary;
    font-family: 'CentraleSans-medium';
  }
  .right_font {
    font-family: 'FZLanTingHei-R-GBK';
    font-weight: 400;
  }
  .rightMaxW {
    max-width: 247px;
  }

  .copy {
    width: 36px;
    height: 16px;
    text-align: center;
    font-size: 10px;
    line-height: 16px;
    color: var(--primary, #333);
    font-family: 'FZLanTingHei-R-GBK';
    font-weight: 400;

    border-radius: 8px;
    background: var(--block, #eee);
  }

  .list_img {
    margin: 3px 2px;
    background: rgba($color: $font-color, $alpha: 0.1);
    width: 72px;
    height: 72px;
  }
}
</style>
