<template>
  <nut-overlay
    v-model:visible="isShow"
    :overlay-class="$style.overlay"
    :z-index="200"
    :close-on-click-overlay="false"
    :class="[isCome ? $style.fade_show : $style.hide]"
    catchMove
  >
    <view v-if="isCome" :class="$style.main" class="nut-flex-col nut-row-center nut-col-center">
      <!-- LOGO面 -->
      <view
        :class="[$style.bgImg_box, $style.front, [$style['bounce-in-bck']], { [$style['flip-vertical-left']]: isOk }]"
      >
        <image :src="imageProcess(data.bgImg, 'M', 'png')" mode="aspectFill"></image>
      </view>
      <!-- 奖品面 -->
      <view :class="$style.win_box" class="nut-flex-col nut-row-center nut-col-center">
        <view :class="[$style.title, $style['fade-in']]">
          <CustomTitle title="恭喜您获得" :tips="data.name" tipsFontSize="14" />
        </view>

        <view
          :class="[$style.bgImg_box, $style.bgImg_in_box, $style.back, $style['flip-vertical-right']]"
          class="nut-flex-col nut-row-center nut-col-center"
        >
          <image :src="imageProcess(data.image, 'M', 'png')" mode="aspectFill" style="z-index: 2010"></image>
        </view>
        <view class="nut-flex-col nut-row-center nut-col-center" :class="[$style.bottom, $style['fade-in']]">
          <text :class="$style.tips" class="f_s-14">以上奖励已发放到您的账户</text>
          <view class="nut-flex nut-row-center" :class="$style.btn_box">
            <nut-button shape="round" type="primary" plain :class="$style.btn" @click="handDetails">{{
              btnText
            }}</nut-button>
            <nut-button shape="round" type="primary" plain :class="[$style.btn, $style.btn_close]" @click="handClasp"
              >关闭</nut-button
            >
          </view>
        </view>
      </view>
    </view>
  </nut-overlay>
</template>

<script setup lang="ts">
import { downImage } from '@/components/PosterBuilder/utils/tools';
import { IPrizeInfoAward, prizeType } from '@/dto/prizes';
import { Toast, imageProcess } from '@/utils';
import Taro from '@tarojs/taro';
import { computed, inject, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import CustomTitle from './CustomTitle.vue';

interface IData extends IPrizeInfoAward {
  bgImg: string;
}

let timer;

const emits = defineEmits(['update:isShow']);
const props = defineProps(['isShow', 'comeData', 'awardData']);

const code = ref<string>(inject('id') || '');
const isOk = ref<boolean>(false);
const isCome = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});

const data = computed((): IData => props.awardData);

const btnText = computed(() => {
  let text = '查看详情';
  if (data.value.type === prizeType.virtual) {
    text = '即刻下载';
  } else if (data.value.type === prizeType.redpcove) {
    text = '立即领取';
  }
  return text;
});

watchEffect(() => {
  if (isShow.value) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      isCome.value = true;
      clearTimeout(timer);
    }, 10);
  } else {
    isCome.value = false;
  }

  if (isCome.value) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      isOk.value = true;
      clearTimeout(timer);
    }, 350);
  } else {
    isOk.value = false;
  }
});

const handClasp = () => {
  emits('update:isShow', false);
};

const handDetails = async () => {
  if (data.value.type === prizeType.redpcove) {
    Taro.showRedPackage({ url: data.value.result || '', fail: err => Toast(err.errMsg), complete: () => handClasp() });
  } else if (data.value.type === prizeType.virtual) {
    await saveImage(data.value.image);
    handClasp();
  } else {
    handClasp();
    Taro.navigateTo({ url: `/packageB/pages/myPrize/myPrize?code=${code.value}` });
  }
};

const saveImage = (url = '') => {
  if (!url) return;
  downImage(url).then(filePath => {
    Taro.saveImageToPhotosAlbum({
      filePath,
      success(res) {
        console.log('saveImg res=', res);
        Toast('下载成功');
      },
      fail(err) {
        console.log('saveImg err=', err);
        Toast('下载失败');
      },
      complete: () => Taro.vibrateShort(),
    });
  });
};

onMounted(() => {});
onUnmounted(() => clearTimeout(timer));

const comeX = `${props.comeData.x}px`;
const comeY = `${props.comeData.y}px`;
</script>
<style lang="scss" module>
.overlay {
  // background: none;
  // background: rgba(165, 165, 165, 0.08);
  // box-shadow: inset 16.1667px -16.1667px 16.1667px rgba(165, 165, 165, 0.077),
  //   inset -16.1667px 16.1667px 16.1667px rgba(255, 255, 255, 0.077);
  // backdrop-filter: blur(7.76px);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}
.hide {
  transform: translate3d(v-bind(comeX), v-bind(comeY), 0) scale(0);
}
.main {
  position: relative;
  height: 100%;
  /* //子元素获得透视效果  */
  -webkit-perspective: 1500;
  -moz-perspective: 1500;

  .win_box {
    position: relative;
    width: 100%;
    height: 100%;
    // transform-style: preserve-3d;
    .title {
      width: 375px;
      margin-bottom: 30px;
    }
  }
  .bgImg_box {
    position: relative;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    border-radius: 20px;
    overflow: hidden;
    image {
      width: 300px;
      height: 400px;
    }
  }
  .bgImg_in_box {
    border-radius: 20px;
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
  .bottom {
    width: 375px;
    padding-top: 17px;
    .tips {
      color: $Tertiary;
      margin-bottom: 8px;
    }
    .btn_box {
      width: 303px;
      .btn {
        width: 128.5px;
        background-color: transparent;
        &_close {
          margin-left: 16px;
        }
      }
    }
  }
  .front {
    position: absolute;
    z-index: 2002;
    transform: rotateY(200deg); //默认隐藏
  }
  .back {
    z-index: 2001;
    transform: rotateY(-180deg); //默认隐藏
  }

  .bounce-in-bck {
    animation: bounce-in-bck 0.4s both;
  }

  @keyframes bounce-in-bck {
    0% {
      transform: scale(2.6);
      animation-timing-function: ease-in;
      opacity: 0;
    }
    66% {
      transform: scale(0.98);
      animation-timing-function: ease-out;
      opacity: 1;
    }
    88% {
      transform: scale(1.02);
      animation-timing-function: ease-in;
    }
    100% {
      transform: scale(1);
      animation-timing-function: ease-out;
    }
  }

  .flip-vertical-left {
    // animation: flip-vertical-left 5s ease-out both;
    animation: flip-vertical-left 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) none;
  }
  @keyframes flip-vertical-left {
    0% {
      transform: rotateY(0);
    }
    100% {
      transform: rotateY(200deg);
    }
  }

  .flip-vertical-right {
    animation: flip-vertical-right 1s cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.3s both;
  }
  @keyframes flip-vertical-right {
    0% {
      transform: rotateY(-200deg);
    }
    100% {
      transform: rotateY(0);
    }
  }

  .fade-in {
    animation: fade-in 300ms ease-out 1s both;
  }
  @keyframes fade-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  .fade_show {
    animation: fade_show 1s ease-out both;
  }
  @keyframes fade_show {
    0% {
      transform: translate3d(v-bind(comeX), v-bind(comeY), 0) scale(0);
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }
}
</style>
