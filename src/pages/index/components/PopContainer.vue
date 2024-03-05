<template>
  <nut-popup
    v-model:visible="isShow"
    :style="{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      height: `${isShow ? '100%' : '0'}`,
    }"
    position="bottom"
    duration="0.4"
    @tap="onClose"
    @opened="onOpened"
  >
    <view class="nut-flex-col nut-col-center" :class="$style.layout" v-if="doc.length" @tap.stop="handleStopClick">
      <image
        v-if="showIcon"
        :class="$style.close_icon"
        src="../../../static/icon/close.png"
        @tap.stop="onClose"
      ></image>
      <image
        v-for="item in doc"
        :key="item.id"
        :class="$style.image"
        :data-id="imageProcess(item.src, 'L')"
        :src="imageProcess(item.src, 'L')"
        :show-menu-by-longpress="true"
        @tap="handleCallback(item)"
      />
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { IBanner } from '@/dto/banner';
import { useBannerStore } from '@/stores';
import { getQueryString, handleLink, imageProcess } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import { getApp } from '@tarojs/taro';
import { onMounted, ref, watchEffect } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const bannerStore = useBannerStore();
const props = defineProps(['code', 'show']);
const doc = ref<IBanner[]>([]);
const isShow = ref(false);
const showIcon = ref(false);

// const imageStyle = {
//   borderRadius: `${pxTransform(30)}`,
//   overflow: 'hidden',
// };

watchEffect(() => {
  isShow.value = doc.value.length > 0 && props.show;
});

const onOpened = () => {
  onTrack('打开');
  showIcon.value = true;
  // tarckEvents([{ path, event: IEventsName.POPUP_OPEN_CL, properties: { ...eventProps.value } as any }]);
};

const onClose = () => {
  onTrack('关闭');
  // const desc = fromIcon ? `点击x关闭` : `点击外蒙层关闭`;
  // tarckEvents([{ path, event: IEventsName.POPUP_CLOSE_CL, properties: { ...eventProps.value, desc } }]);
  isShow.value = false;
};

const handleCallback = (item: IBanner) => {
  onTrack('点击');
  handleLink(item.linkType, item.link);
  isShow.value = false;
};

const onTrack = (userAction: '打开' | '关闭' | '点击') => {
  if (!linkflow) return;
  const [item, _] = doc.value;
  const miniSkuId = (item?.link && getQueryString('skuId', item.link)) || '';
  linkflow.track({
    event: ELinkflowEventsName.Popup_Click,
    props: {
      userAction,
      targetClass: item?.desc || '',
      targetAddress: item?.link || '',
      targetName: item?.title || '',
      miniSkuId,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};

const handleStopClick = () => {};

onMounted(async () => {
  const res = await bannerStore.getBanners(props.code); // 'shouyetanchuang'
  doc.value = res ? res : [];
});
</script>

<style lang="scss">
.popStyle {
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  height: 100%;
}
</style>
<style lang="scss" module>
.layout {
  width: 300px;
  height: 400px;
  background: transparent;
  border-radius: 30px;
  position: relative;
}

.close_icon {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  z-index: 2;
}
.image {
  width: 300px;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
}
</style>
