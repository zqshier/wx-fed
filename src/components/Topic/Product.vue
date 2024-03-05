<template>
  <view :class="$style.item" @tap="goOrderDetails">
    <image
      mode="aspectFill"
      :src="imageProcess(item.image, 'S')"
      :lazy-load="true"
      :class="$style.image"
      class="border-05px-box-0"
    ></image>
    <view :class="$style.info">
      <view class="nut-line-1 nut-flex nut-col-top nut-flex-wrap f_s-14" :class="$style.name">{{ item.name }}</view>
      <view class="nut-flex nut-col-bottom f_s-12 f_w-500 numfnt-medium">¥{{ item.price }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ITopicTagItem } from '@/dto/topic';
import { imageProcess } from '@/utils';
import { IEventsName, tarckEvents } from '@/utils/track';
import Taro from '@tarojs/taro';
import { PropType } from 'vue';

const props = defineProps({
  item: {
    type: Object as PropType<ITopicTagItem>,
    default: null,
  },
  // pageUrl: { type: String, default: '' },
});

const goOrderDetails = () => {
  const item = props.item;
  const pathName = '首页';
  const path = 'pages/index/index';
  if (item.itemType === 'link') {
    tarckEvents([{ path, event: IEventsName.GOODS_CL, properties: { id: item.id, name: item.name, pathName } }]);
    Taro.navigateTo({ url: `/pages/webview/webview?src=${encodeURIComponent(item.link)}` });
  } else {
    tarckEvents([{ path, event: IEventsName.GOODS_CL, properties: { goodsId: item.id, name: item.name, pathName } }]);
    // let url = props.pageUrl || '/packageA/pages/goodsDetail/goodsDetail';
    let url = '/packageA/pages/goodsDetail/goodsDetail';
    Taro.navigateTo({
      url: `${url}?id=${item.id}`,
    });
  }
};
</script>
<style lang="scss" module>
.item {
  width: 124px;
  min-height: 184px;
  // margin: 0 4px;
  margin-right: 8px;
  .image {
    width: 123px;
    height: 138px;
    margin-bottom: 8px;
  }

  .info {
    width: 100%;
    color: $Secendary;

    .name {
      margin-bottom: 4px;
    }
  }
}
</style>
