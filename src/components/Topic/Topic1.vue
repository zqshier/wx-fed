<template>
  <view :class="$style.goods" class="nut-flex nut-flex-col nut-col-center nut-row-left" id="topic1">
    <view :class="$style.title">
      <TopicTags :tags="data.tags" v-model:idx="curIndex" :tag-color="variables.white" :line-color="variables.white" />
    </view>
    <nut-button :class="$style.btn" type="primary" @click="goGoodsDetails">了解更多</nut-button>
    <!-- <swiper
      :class="$style.swiper"
      :circular="false"
      :current="swiperIndex"
      :duration="timeOut"
      :cache-extent="1"
      easing-function="linear"
    >
      <swiper-item :class="$style.swiper_item" v-for="(item, index) in goods" :key="index">
        <view :catch-move="true" style="width: 100%; height: 100%">
          <view :class="$style.name" class="f_s-12" v-if="item.subtitle">{{ item.subtitle }}</view>
          <image :class="$style.image" :src="imageProcess(item.image, 'L')" mode="aspectFill" :lazy-load="true" />
        </view>
      </swiper-item>
    </swiper> -->
    <scroll-view
      :class="$style.swiper"
      class="nut-flex nut-row-left nut-col-top"
      :scroll-x="true"
      :enhanced="true"
      :show-scrollbar="false"
      :enable-flex="true"
    >
      <view
        v-if="goods.length > 0"
        :class="[$style.swiper_box, isRun ? $style.ani_run : $style.ani_stop]"
        class="nut-flex nut-col-top nut-row-left"
        :style="swiperStyle"
      >
        <view :class="$style.swiper_item" v-for="item in goods" :key="item.id">
          <view :class="$style.name" class="f_s-12" v-if="item.subtitle">{{ item.subtitle }}</view>
          <image :class="$style.image" :src="imageProcess(item.image, 'L')" mode="aspectFill" />
        </view>
      </view>
    </scroll-view>
    <!-- <view :class="$style.indicator" class="nut-flex nut-row-center" v-if="goods.length > 1">
      <block v-for="(_, i) in goods" :key="i">
        <view :class="[$style.dot, i === swiperIndex && $style.active]"></view>
      </block>
    </view> -->
  </view>
</template>

<script setup lang="ts">
import { ITopic, ITopicTagItem } from '@/dto/topic';
import variables from '@/scss/variables';
import { getQueryString, imageProcess } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import Taro, { eventCenter, getApp, getCurrentInstance } from '@tarojs/taro';
import { computed, onMounted, ref, watchEffect } from 'vue';
import TopicTags from './TopicTags.vue';
import { topicProps } from './props';
const props = defineProps(topicProps);
const data = ref<ITopic>(props.data as any);
const curIndex = ref<number>(0); // 当前选中
// const swiperIndex = ref<number>(0); // 当前选中
const timeOut = ref(5000);
// let direction = 'right';
// let timer;
const swiperStyle = ref('');
const isRun = ref(false);

const goods = computed(() => data.value.tags[curIndex.value]?.items);

watchEffect(() => {
  // console.debug('props.isLoad', props.isLoad);
  isRun.value = props.animationKey;
});

onMounted(async () => {
  eventCenter.on(getCurrentInstance().router!.onShow, () => {
    console.debug('Topic1 onShow');
    isRun.value = true;
  });
  eventCenter.on(getCurrentInstance().router!.onHide, () => {
    console.debug('Topic1 onHide');
    isRun.value = false;
  });
  swiperStyle.value = `animation-duration: ${((goods.value.length * timeOut.value) / 1000) * 2}s;`;
});

// function handleTimer() {
//   timer = setInterval(function () {
//     handleCarousel();
//   }, timeOut.value);
// }

// function handleCarousel() {
//   direction === 'right' ? swiperIndex.value++ : swiperIndex.value--;
//   // console.debug('swiperIndex.value', swiperIndex.value);
//   // console.debug('direction', direction);
//   if (goods.value.length - 1 === swiperIndex.value) {
//     direction = 'left';
//   } else if (swiperIndex.value === 0) {
//     direction = 'right';
//   }
// }

const goGoodsDetails = () => {
  const idx = goods.value.findIndex(i => i.link);
  const item: ITopicTagItem = goods.value[idx];

  // const pathName = '首页';
  // const path = 'pages/index/index';

  onClickTrack(item, idx);

  if (item.itemType === 'link') {
    // tarckEvents([{ path, event: IEventsName.GOODS_CL, properties: { id: item.id, name: item.name, pathName, idx } }]);
    Taro.navigateTo({ url: `/pages/webview/webview?src=${encodeURIComponent(item.link)}` });
  } else {
    // tarckEvents([
    //   { path, event: IEventsName.GOODS_CL, properties: { goodsId: item.id, name: item.name, pathName, idx } },
    // ]);
    Taro.navigateTo({
      url: `/packageA/pages/goodsDetail/goodsDetail?id=${item.id}`,
    });
  }
};

const onClickTrack = (item: ITopicTagItem, index: number) => {
  const linkflow = getApp()[`${process.env.APP_ID}`];
  if (!linkflow) return;
  // 埋点 首页_品牌故事
  linkflow.track({
    event: ELinkflowEventsName.Home_BrandStory_Click,
    props: {
      targetClass: item.subtitle,
      targetAddress: item.link,
      targetName: item.name,
      miniSkuId: getQueryString('skuId', item.link),
      Index: `${index}`,
    } as ILinkflowEventsProps,
  });
};
</script>
<style lang="scss" module>
.goods {
  position: relative;
  width: 375px;
  height: 812px;
  .title {
    position: absolute;
    top: 95px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .btn {
    position: absolute;
    top: 590px;
    left: 50%;
    transform: translateX(-50%);
    background: transparent;
    border-color: $white;
    color: $white;
    z-index: 10;
  }
  .swiper {
    width: 375px;
    height: 812px;
    pointer-events: none;

    &_box {
      transition: 1s;
      animation-name: carousel;
      animation-timing-function: linear;
      animation-iteration-count: infinite;

      &.ani_run {
        animation-play-state: running;
      }

      &.ani_stop {
        animation-play-state: paused;
      }
    }

    &_item {
      position: relative;
      width: 375px;
      height: 812px;
      .image {
        display: block;
        width: 100%;
        height: 100%;
      }
      .name {
        position: absolute;
        top: 183px;
        left: 50%;
        width: 144px;
        color: $white;
        line-height: 18px;
        text-align: center;
        transform: translateX(-50%);
      }
    }
  }

  // .indicator {
  //   position: absolute;
  //   bottom: 209px;
  //   left: 50%;
  //   transform: translateX(-50%);
  //   .dot {
  //     width: 5px;
  //     height: 5px;
  //     background: $Tertiary;
  //     border-radius: 50%;
  //     margin: 0 3px;
  //   }
  //   .active {
  //     background: $Brand;
  //   }
  // }
  @keyframes carousel {
    0% {
      transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    }
    50% {
      transform: translate3d(-1870px, 0, 0) scale3d(1, 1, 1);
    }
    100% {
      transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
    }
  }
}
</style>
