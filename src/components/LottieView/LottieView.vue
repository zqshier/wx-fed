<template>
  <canvas
    class="canvas"
    :id="canvasId"
    type="2d"
    :style="{ width: `${config.width}px`, height: `${config.height}px` }"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import lottie from 'lottie-miniprogram';
import { cdnurl, findNode } from '@/utils';
// import lottieJson from './data.json'; //json的动画可以找产品要

const props = defineProps({
  /** 画布id */
  // id: {
  //   type: String,
  //   default: 'lottie',
  // },
  /** 本地json地址 */
  jsonData: {
    type: Object,
    default: () => {},
  },
  /** 自动播放 */
  autoplay: {
    type: Boolean,
    default: false,
  },
  /** 循环 */
  loop: {
    type: Boolean,
    default: false,
  },
  /** 网络加载json地址 */
  assetsPath: {
    type: String,
    default: 'static/car-loading.json',
  },
  /** 画布宽高 */
  config: {
    type: Object,
    default: () => {
      return { width: 48, height: 48 };
    },
  },
  /** 加载动画延迟时间 */
  timeout: {
    type: Number,
    default: 300,
  },
});

const canvasId = ref(`lottie-${Math.random().toString().slice(-10)}`);
const emits = defineEmits(['onComplete']);
const sysInfo = Taro.getSystemInfoSync(); //获取设备系统的数据
let lottieObj: any = undefined;
const inited = ref(false);

onMounted(() => {
  console.debug('LottieView---onMounted');
  setTimeout(() => init(), props.timeout);
  const router = getCurrentInstance().router;
  if (router) {
    Taro.eventCenter.once(router.onReady, () => {
      console.debug('LottieView---onReady');
      init();
    });
  }
});

// 初始化加载动画
const init = async () => {
  if (inited.value) return;
  inited.value = true;

  console.debug('LottieView view init', canvasId.value);
  const canvas = await findNode(`#${canvasId.value}`);
  console.debug('LottieView view init canvas', canvas);
  if (!canvas) return;

  const context = canvas.getContext('2d');
  const dpr = sysInfo.pixelRatio;
  canvas.width = props.config.width * dpr;
  canvas.height = props.config.height * dpr;

  lottie.setup(canvas);
  lottieObj = lottie.loadAnimation({
    loop: props.loop, //循环
    autoplay: props.autoplay, //自动播放
    //   animationData: props.jsonData,  // 本地动画
    path: cdnurl(props.assetsPath), //path和animationData只需要一个，path需要注意合法域名
    rendererSettings: {
      context,
    },
  });

  emits('onComplete');
};

const play = () => {
  console.debug(`LottieView id:${canvasId.value} play`);
  lottieObj && lottieObj.play();
};

const stop = () => {
  console.debug(`LottieView id:${canvasId.value} stop`);
  lottieObj && lottieObj.stop();
};

const pause = () => {
  console.debug(`LottieView id:${canvasId.value} pause`);
  lottieObj && lottieObj.pause();
};

defineExpose({
  play,
  stop,
  pause,
});
</script>

<style lang="less"></style>
