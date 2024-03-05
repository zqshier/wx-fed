<template>
  <view
    class="u-swiper"
    :class="{ 'fade-enter-active': isTransition }"
    :style="{
      backgroundColor: bgColor,
      height: addUnit(height),
      borderRadius: radius,
      ...transitionStyle,
    }"
  >
    <swiper
      class="u-swiper__wrapper"
      :class="{ 'fade-enter-active': isTransition }"
      :style="{
        height: addUnit(height),
        ...transitionStyle,
      }"
      @change="change"
      :circular="circular"
      :interval="interval"
      :duration="duration"
      :autoplay="autoPlaySet"
      :current="current"
      :acceleration="acceleration"
      :displayMultipleItems="displayMultipleItems"
    >
      <swiper-item class="u-swiper__wrapper__item" v-for="(item, index) in list" :key="index">
        <slot v-if="swiperItemSlot" :data="item" :index="index"></slot>
        <block v-else>
          <image
            class="u-swiper__wrapper__item__wrapper__image"
            :src="imageProcess(item.src, 'L')"
            @tap="onClickBanner(item, index)"
            v-if="item.srcType === 'image' && !props.useImageBg"
            :mode="imgMode"
            :style="{ borderRadius: `${props.borderRadius}px` }"
            :lazy-load="lazyLoad"
          />
          <view
            class="u-swiper__wrapper__item__wrapper__image"
            @tap="onClickBanner(item, index)"
            v-if="item.srcType === 'image' && props.useImageBg"
            :style="{
              borderRadius: `${props.borderRadius}px`,
              backgroundSize: '100% auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: `url(${imageProcess(item.src, 'L')})`,
            }"
          >
          </view>
          <!-- TODO: 视频 -->
          <view v-if="item.srcType === 'video'" class="video_box image">
            <!-- <image v-if="isPause" class="pauseImg" :src="cdnurl('static/pauseImg.png')" @tap="playVideo(index)"></image> -->
            <view v-if="item.link" class="see_details f_s-12 nut-flex nut-row-center" @tap="onClickBanner(item, index)">
              查看详情
              <image class="see_details-img" src="../../static/icon/icon_arrows_t.png"></image>
            </view>
            <!-- @tap="onClickVideo(index)" -->
            <video
              class="u-swiper__wrapper__item__wrapper__image"
              :controls="true"
              :enableProgressGesture="false"
              :enablePlayGesture="true"
              :show-fullscreen-btn="false"
              :show-mute-btn="true"
              :muted="true"
              :src="item.src"
              :id="`video-${videoName}-${index}`"
              :style="{ height: addUnit(height) }"
            ></video>
          </view>
        </block>
      </swiper-item>
    </swiper>
    <view
      v-if="indicator && list.length > 1"
      class="indicator-row nut-flex nut-col-center nut-row-center"
      :class="{ 'fade-enter-active': isTransition }"
      :style="indicatorStyle"
    >
      <block v-for="(_, i) in list" :key="i">
        <view class="indicator-dot" :class="{ 'indicator-dot_active': i === currentIndex }"></view>
      </block>
      <!-- <view
        class="indicator-dot"
        :style="{
          transform: `translate3d(0px, 0px, 0px) scaleX(${(currentIndex + 1) / list.length}) scaleY(1)`,
          transitionDuration: '300ms',
        }"
      ></view> -->
    </view>
  </view>
</template>

<script lang="ts" setup>
/**
 * Swiper 轮播图
 * @description 导航轮播，
 * @property {Array}			list					轮播图数据
 * @property {Boolean}			indicator				是否显示面板指示器（默认 true ）
 * @property {String}			indicatorActiveColor	指示器非激活颜色（默认 '$white' ）
 * @property {String}			indicatorInactiveColor	指示器的激活颜色（默认 'rgba(255, 255, 255, 0.35)' ）
 * @property {String | Object}	indicatorStyle			指示器样式，可通过bottom，left，right进行定位
 * @property {String}			indicatorMode			指示器模式（默认 'line' ）
 * @property {Boolean}			autoplay				是否自动切换（默认 true ）
 * @property {String | Number}	current					当前所在滑块的 index（默认 0 ）
 * @property {String | Number}	interval				滑块自动切换时间间隔（ms）（默认 3000 ）
 * @property {String | Number}	duration				滑块切换过程所需时间（ms）（默认 300 ）
 * @property {Boolean}			circular				播放到末尾后是否重新回到开头（默认 true ）
 * @property {Boolean}			acceleration			当开启时，会根据滑动速度，连续滑动多屏，支付宝不支持（默认 false ）
 * @property {Number}			displayMultipleItems	同时显示的滑块数量，nvue、支付宝小程序不支持（默认 1 ）
 * @property {String}			imgMode					图片的裁剪模式（默认 'aspectFill' ）
 * @property {String | Number}	height					组件高度（默认 130 ）
 * @property {String}			bgColor					背景颜色（默认 	'#f3f4f6' ）
 * @property {String | Number}	radius					组件圆角，数值或带单位的字符串（默认 4 ）
 * @property {Boolean}			loading					是否加载中（默认 false ）
 * @property {Boolean}			showTitle				是否显示标题，要求数组对象中有title属性（默认 false ）
 * @event {Function(index)}	click	点击轮播图时触发	index：点击了第几张图片，从0开始
 * @event {Function(index)}	change	轮播图切换时触发(自动或者手动切换)	index：切换到了第几张图片，从0开始
 */
import { IBanner } from '@/dto/banner';
import { getQueryString, handleLink, imageProcess } from '@/utils';
import { ELinkflowEventsName, IEventsName, ILinkflowEventsProps, tarckEvents } from '@/utils/track';
import Taro, { getApp } from '@tarojs/taro';
import { computed, onMounted, ref, watch } from 'vue';
import { dProps } from './props';

const linkflow = getApp()[`${process.env.APP_ID}`];

const emits = defineEmits(['change']);
const props = defineProps(dProps);
const currentIndex = ref<number>(0);
// const isPause = ref<boolean>(false); // 是否暂停

const autoPlaySet = computed(() => {
  if (!props.isAutoPlayHasV) {
    // 个别轮播中含有视频时不自动轮播
    const result = props.list.some(item => item.srcType === 'video');
    if (result) return false;
  }
  return props.autoplay;
});

watch(
  () => props.current,
  (val, preVal) => {
    if (val === preVal) return;
    currentIndex.value = Number(val); // 和上游数据关联上
  },
);

const change = e => {
  // 当前的激活索引
  const { current } = e.detail;
  pauseVideo(currentIndex.value);
  currentIndex.value = current;
  playVideo(current);
  emits('change', current);
};

// const onClickVideo = index => {
//   pauseVideo(index);
// };

// 首次进入播放视频
const checkFirstVideo = () => {
  if (!props.list?.length) return;
  if (props.list[currentIndex.value].srcType === 'video') {
    playVideo(currentIndex.value);
  }
};

// 视频暂停
const pauseVideo = index => {
  if (props.list[index].srcType === 'image') return;
  const video = Taro.createVideoContext(`video-${props.videoName}-${index}`);
  video.pause();
  // isPause.value = true;
};

// 视频播放
const playVideo = index => {
  if (props.list[index].srcType === 'image') return;

  tarckEvents([
    {
      path: Taro.getCurrentInstance().page?.route,
      event: IEventsName.BANNER_CL,
      properties: { idx: index, name: props.list[index].title, id: props.list[index].id },
    },
  ]);

  const video = Taro.createVideoContext(`video-${props.videoName}-${index}`);
  video.play();
  // isPause.value = false;
};

const onClickBanner = (item: IBanner, index: number) => {
  if (props.usage === 'home') {
    onClickTrack(item, index);
  } else {
    tarckEvents([
      {
        path: Taro.getCurrentInstance().page?.route,
        event: IEventsName.BANNER_CL,
        properties: { idx: index, name: props.list[index].title, id: props.list[index].id },
      },
    ]);
  }

  handleLink(item.linkType, item.link, item.mpAppId);
};

function addUnit(value: string | number = 'auto', unit = props.unit) {
  if (value === '100vh') return value;
  if (/%$/g.test(value + '')) return value;
  return `${value}${unit}`;
}

const onClickTrack = (item: IBanner, index: number) => {
  if (!linkflow) return;
  // 埋点 首页_banner
  linkflow.track({
    event: ELinkflowEventsName.Home_Banner_Click,
    props: {
      targetClass: item.desc,
      targetAddress: item.link,
      targetName: item.title,
      miniSkuId: getQueryString('skuId', item.link),
      Index: `${index}`,
    } as ILinkflowEventsProps,
  });
};

onMounted(() => {
  checkFirstVideo();
});
</script>

<style lang="scss">
.u-swiper {
  position: relative;
  overflow: hidden;
  // transition: height 500ms ease-in-out;

  &__wrapper {
    flex: 1;
    // transition: height 500ms ease-in-out;

    &__item {
      flex: 1;

      &__wrapper {
        display: flex;
        position: relative;
        overflow: hidden;
        flex: 1;

        &__image {
          width: 100%;
          height: 100%;
        }

        &__video {
          flex: 1;
        }

        &__title {
          position: absolute;
          background-color: rgba(0, 0, 0, 0.3);
          bottom: 0;
          left: 0;
          right: 0;
          font-size: 28rpx;
          padding: 12rpx 24rpx;
          color: $white;
          flex: 1;
        }
      }
    }
  }

  &__indicator {
    position: absolute;
    bottom: 10px;
  }
  .indicator-row {
    position: absolute;
    left: 0;
    bottom: 0;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    width: 100%;
    height: 5px;
    z-index: 2;
    .indicator-dot {
      width: 5px;
      height: 5px;
      background: $Tertiary;
      border-radius: 50%;
      margin: 0 5px;

      &_active {
        background: $Brand;
      }
    }
    // .indicator-dot {
    //   // position: absolute;
    //   // left: 0;
    //   // top: 0;
    //   width: 100%;
    //   height: 100%;
    //   transform: scale(0);
    //   background: $font-color;
    //   transform-origin: left top;
    // }
  }
  .video_box {
    position: relative;
    height: 100%;
    .pauseImg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      z-index: 10;
    }
    .see_details {
      position: absolute;
      bottom: 8px;
      left: 0;
      width: 70px;
      height: 22px;
      background: rgba($color: #000000, $alpha: 0.5);
      color: rgba($color: $white, $alpha: 0.5);
      z-index: 10;
      will-change: transform;
      &-img {
        margin-left: 2px;
        width: 6px;
        height: 11px;
      }
    }
  }
}
.fade-enter-active {
  transition: all 300ms ease-in-out;
}
</style>
