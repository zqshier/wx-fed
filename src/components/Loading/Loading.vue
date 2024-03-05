<template>
  <!-- <nut-overlay
    v-model:visible="isShow"
    :duration="0.3"
    :lock-scroll="true"
    :overlay-style="props.overlayStyle"
    z-index="9999"
  > -->
  <view :class="$style.wrapper" class="nut-flex nut-row-center" v-if="show">
    <image :class="[$style.loading]" :src="imaUrl" @load="emits('loaded')"></image>
    <!-- <view :class="$style.bg" v-if="!isVideo"></view>
      <view :class="{ [$style.loading_show]: !isVideo }">
        <video
          :class="[$style.loading]"
          :src="url"
          :controls="false"
          :autoplay="true"
          :loop="true"
          :muted="true"
          initial-time="1"
          @timeUpdate="onTimeUpdate"
          @loadedmetadata="onRenderStart"
        />
      </view> -->
  </view>
  <!-- </nut-overlay> -->
</template>
<script lang="ts" setup>
// import { CSSProperties, computed, PropType } from 'vue';
import { cdnurl } from '@/utils';
// import { Loading1 } from '@nutui/icons-vue-taro';

// const url = cdnurl('static/loading.mp4');
const imaUrl = cdnurl('static/loading_compress.png');
// const isVideo = ref<boolean>(false);
// const enterTime = ref<number>(Date.now());
// const videoUpdateNum = ref<number>(0);

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  // showTime: {
  //   type: Number,
  //   default: 1000,
  // },
  // overlayStyle: {
  //   type: Object as PropType<CSSProperties>,
  //   default: () => ({ backgroundColor: 'rgba(255, 255, 255, 1)' }),
  // },
});
const emits = defineEmits(['loaded']);

// const isShow = computed({
//   get() {
//     return props.show;
//   },
//   set(v) {
//     emits('update:show', v);
//   },
// });

// 播放进度变化时触发, 触发频率 250ms 一次
// function onTimeUpdate() {
//   // console.debug('onTimeUpdate', evt);
//   // videoUpdateNum.value += 1;
//   // if (videoUpdateNum.value > Math.floor(props.showTime / 250)) {
//   //   emits('update:show', false);
//   // }
//   if (isVideo.value) return;
//   // console.log('onTimeUpdate: =======');
//   isVideo.value = true;
// }

// // 视频元数据加载完成时触发
// function onRenderStart() {
//   // if (Date.now() - enterTime.value < 50 || isVideo.value) return;
//   console.log('onRenderStart: =======');
//   // isVideo.value = true;
// }
</script>
<style lang="scss" module>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loading {
  width: 101px;
  height: 101px;
}

// .loading_show {
//   opacity: 0;
// }
// .bg {
//   width: 100px;
//   height: 100px;
//   background: white;
//   position: absolute;
//   z-index: 2;
// }
</style>
