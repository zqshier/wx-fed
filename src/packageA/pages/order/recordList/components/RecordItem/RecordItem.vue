<template>
  <view :class="$style.container" class="f_s-12 f_w-400" v-if="data">
    <view :class="$style.status" class="nut-flex nut-row-between mg-bottom-8">
      <text :class="$style.status_title" class="f_s-14 f_w-500">{{ status }}</text>
      <text
        :class="[$style.status_ins, $style['status_ins-color']]"
        class="nut-line-2"
        v-if="data.auditStatus === 2 && data.refuseReason"
        >{{ data?.refuseReason }}</text
      >
      <text :class="[$style.status_ins]" v-if="data.auditStatus === 1 && data.predictIntegral"
        >+{{ data?.predictIntegral }} 小火苗</text
      >
    </view>
    <view :class="$style['info_item']" class="nut-flex mg-bottom-8">
      <text :class="$style.left">订单渠道</text>
      <text :class="$style.right">{{ data.orderChannel }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex mg-bottom-8" v-if="data.orderNo">
      <text :class="$style.left">订单编号</text>
      <text :class="$style.right">{{ data.orderNo }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex mg-bottom-8">
      <text :class="$style.left">提交时间</text>
      <text :class="$style.right">{{ format(new Date(data.createdAt), 'yyyy.MM.dd HH:mm') }}</text>
    </view>

    <view :class="$style['info_item']" class="nut-flex nut-col-top mg-bottom-8" v-if="data.productName">
      <text :class="$style.left">产品名称</text>
      <text :class="[$style.right, $style.right_width]">{{ data.productName }}</text>
    </view>
    <view :class="$style['info_item']" class="nut-flex mg-bottom-8" v-if="data.orderAmount">
      <text :class="$style.left">订单金额</text>
      <text :class="$style.right">{{ data.orderAmount }}</text>
    </view>

    <view :class="$style['info_item']" class="nut-flex nut-col-top mg-bottom-8" v-if="data.screenshot.length">
      <text :class="$style.left">订单截图</text>
      <view :class="$style.screenshot" class="nut-flex nut-row-left">
        <view :class="$style.content" v-for="(url, index) in data.screenshot" :key="url" @tap="handlePreview(index)">
          <view :class="$style.layer" class="nut-flex nut-row-center">
            <image :class="$style.icon" src="../../../../../../static/icon/search.png"></image>
          </view>
          <image :class="$style.item_img" mode="aspectFill" :src="imageProcess(url, 'S')" :lazy-load="true"></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { IConversionItem } from '@/dto/order';
import { format } from 'date-fns';
import { imageProcess } from '@/utils';
import Taro from '@tarojs/taro';

const props = defineProps({
  data: {
    type: Object as PropType<IConversionItem>,
    default: () => {},
  },
});

const status = computed(() => {
  switch (props.data?.auditStatus) {
    case 0:
      return '审核中';
    case 1:
      return '转换成功';
    case 2:
      return '转换失败';
    default:
      return '';
  }
});

function handlePreview(current) {
  const sources =
    props.data?.screenshot.map(item => {
      return { url: item };
    }) || [];
  Taro.previewMedia({
    current,
    sources,
  });
}
</script>

<style lang="scss" module>
.status {
  &_title {
    color: $Primary;
    font-family: 'FZLanTingHeiS-R-GB';
  }
  &_ins {
    max-width: 170px;
    &-color {
      color: #f00;
    }
  }
}
.info_item {
  // align-items: baseline;
  width: 100%;
  color: $Tertiary;
  font-family: 'FZLanTingHei-R-GBK';
  &:last-child {
    margin-bottom: 0;
  }
  .left {
    margin-right: 10px;
    color: $Tertiary;
    width: 58px;
  }
  .right {
    color: $Primary;
    &_width {
      max-width: 253px;
    }
  }
  .item_img {
    margin-right: 10px;
    width: 72px;
    height: 72px;
  }
  .screenshot {
    width: 253px;

    .content {
      margin-right: 10px;
      position: relative;
      width: 72px;
      height: 72px;
      .layer {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.1);
        width: 100%;
        height: 100%;
        .icon {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}
</style>
