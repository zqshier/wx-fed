<template>
  <view :class="$style.item" class="mg-bottom-16" @tap="goDetail">
    <view :class="$style.item_status" class="nut-flex-col nut-col-center f_s-12 f_w-600">
      <image :class="$style.status_icon" :src="status.icon" mode="aspectFit" />
      <text>{{ status.text }}</text>
    </view>

    <image :class="$style.item_img" :src="data?.image" mode="aspectFit" />
    <view :class="$style.item_title" class="f_s-12 f_w-400">{{ data?.title }}</view>
  </view>
</template>

<script setup lang="ts">
import { IActListItem } from '@/dto/activity';
import { cdnurl } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp } from '@tarojs/taro';
import { PropType, computed } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();
const bgImg = `url(${cdnurl('static/vector.png')})`;

const props = defineProps({
  data: {
    type: Object as PropType<IActListItem>,
    default: [] as any,
  },
});

const status = computed(() => {
  const obj = {
    text: '',
    icon: '',
  };
  switch (props.data?.state) {
    case 0:
      obj.text = '未开始';
      obj.icon = require('@/packageA/image/progress.png');
      break;
    case 1:
      obj.text = '进行中';
      obj.icon = require('@/packageA/image/wait.png');
      break;
    case 2:
      obj.text = '已结束';
      obj.icon = require('@/packageA/image/end.png');
      break;
  }

  return obj;
});

function goDetail() {
  linkflow &&
    linkflow.track({
      event: ELinkflowEventsName.Campaign_Click,
      props: {
        campaignName: props.data?.title,
        campaignId: props.data?.id,
        campaignStatus: status.value.text,
        triggerPagePath,
      } as ILinkflowEventsProps,
    });

  Taro.navigateTo({
    url: `/packageA/pages/events/eventDetails/eventDetails?id=${props.data?.id}`,
  });
}
</script>

<style lang="scss" module>
.item {
  width: 343px;
  border-radius: 10px;
  border: 0.5px solid $Divide;
  box-sizing: content-box;
  // border-top: none;
  position: relative;
  .item_status {
    position: absolute;
    top: 0;
    right: 16px;
    color: white;
    width: 50px;
    height: 80px;
    fill: rgba(217, 217, 217, 0.5);
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
    background: v-bind(bgImg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-family: 'FZLanTingHei-B-GBK';
    .status_icon {
      width: 24px;
      height: 24px;
      margin-top: 10px;
      margin-bottom: 2px;
    }
  }
  .item_img {
    width: 100%;
    height: 128px;
    border-radius: 10px 10px 0 0;
  }
  .item_title {
    width: 100%;
    padding: 8px 16px;
    background: white;
    color: $Primary;
    font-family: 'FZLanTingHeiS-R-GB';
    word-break: break-all;
    border-radius: 0 0 10px 10px;
  }
}
</style>
