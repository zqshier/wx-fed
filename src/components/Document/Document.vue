<template>
  <view :class="$style.layout" class="nut-flex nut-flex-col nut-col-top nut-row-left">
    <block v-for="(item, index) in contents" :key="index">
      <view :class="[$style.item, className]" :style="imageStyle">
        <view
          v-if="item.type === 'image'"
          :class="$style.item_img"
          :style="([(imageSizes.get(imageProcess(item.content, 'L', format)) as any),{...imageHeight}] as any)"
          @tap.stop="gotoPage(item.meta)"
        >
          <image
            :class="$style.image"
            :data-id="imageProcess(item.content, 'L', format)"
            :src="imageProcess(item.content, 'L', format)"
            :lazy-load="true"
            :mode="imageMode"
            :show-menu-by-longpress="true"
            @load="onImageLoad"
          />
        </view>

        <view
          v-if="item.type === 'video'"
          :class="$style.item_img"
          :style="(imageSizes.get(`video-${item.content}`) as any)"
          @tap.stop="gotoPage(item.meta)"
        >
          <view
            :class="$style.pause_box"
            class="nut-flex nut-flex-col nut-row-center"
            @tap.stop="playVideo(`video-${item.content}`)"
          >
            <view v-show="isPause" class="nut-flex nut-flex-col nut-row-center">
              <image :class="$style.play_image" :src="require('@/static/icon/play.png')"></image>
              <text class="f_s-12">点击播放视频</text>
            </view>
          </view>

          <video
            :show-progress="videoFullScreenKey"
            :show-play-btn="videoFullScreenKey"
            :show-center-play-btn="videoFullScreenKey"
            :direction="90"
            :src="item.content"
            :id="`video-${item.content}`"
            :title="title"
            style="width: 100%; height: 100%"
            @loadedmetadata="onVideoLoad"
            @play="isPause = false"
            @pause="isPause = true"
            @ended="isPause = true"
            @fullscreenchange="onFullscreenchange"
          ></video>
        </view>

        <template v-if="item.type === 'text'">
          <block v-for="text in item.content.split('\n')" :key="text">
            <view :class="$style.item_text" :style="textStyle">
              <text :userSelect="true">{{ text }}</text>
            </view>
          </block>
        </template>
      </view>
    </block>
  </view>
</template>

<script setup lang="ts">
import { DocumentContentVo as IContent, DocumentContentMeta as IContentMeta } from '@/dto/document';
import { useDocumentStore } from '@/stores';
import { handleLink, imageProcess } from '@/utils';
import Taro from '@tarojs/taro';
import { CSSProperties, computed, onMounted, ref, watch } from 'vue';

interface IImageSize {
  width: string;
  height: string;
}

const documentStore = useDocumentStore();
const props = defineProps([
  'code',
  'maxWidth',
  'imageStyle',
  'imageBoxStyle',
  'imageHeight',
  'dcontents',
  'format',
  'className',
  'imageMode',
  'textStyle',
]);
const emit = defineEmits(['clickCallback']);

const contents = ref<IContent[]>([]); // 说明详情

const imageSizes = ref<Map<string, IImageSize>>(new Map());
const isPause = ref<boolean>(true); // 是否暂停
const videoFullScreenKey = ref(false); // 视频是否全屏
const title = ref('');

const code = computed(() => {
  return props.code;
});

const imageStyle = computed((): CSSProperties => (props.imageStyle && { ...props.imageStyle }) || {});

watch(
  () => props.dcontents,
  newValue => {
    if (!newValue) return;
    contents.value = newValue;
  },
);

onMounted(() => {
  Taro.nextTick(async () => {
    if (code.value) {
      const doc = await documentStore.load(code.value);
      contents.value = doc?.contents || [];
      title.value = doc?.title || '';
    }
    if (props.dcontents) contents.value = props.dcontents || [];
  });
});

function onImageLoad(evt) {
  const { width, height } = evt.detail;
  const maxWidth = !props.maxWidth ? 375 : props.maxWidth;
  const scale = maxWidth / width;
  imageSizes.value.set(evt.currentTarget.dataset.id, {
    width: Taro.pxTransform(maxWidth),
    height: Taro.pxTransform(height * scale),
  });
}

function onVideoLoad(evt) {
  console.debug(evt);
  const { width, height } = evt.detail;
  const maxWidth = !props.maxWidth ? 375 : props.maxWidth;
  const scale = maxWidth / width;
  imageSizes.value.set(evt.mpEvent.currentTarget.id, {
    width: Taro.pxTransform(maxWidth),
    height: Taro.pxTransform(height * scale),
  });
}

// 视频播放
const playVideo = id => {
  const video = Taro.createVideoContext(id);
  isPause.value ? video.play() : video.pause();
  isPause.value = !isPause.value;
};

const onFullscreenchange = event => {
  const { fullScreen } = event.detail;
  console.debug('fullScreen', fullScreen);
  videoFullScreenKey.value = fullScreen;
};

// const handlePreviewImage = (url: string) => {
//   const urls = contents.value?.filter(o => o.type === 'image').map(o => o.content);
//   if (!urls || !urls.length) return;
//   Taro.previewImage({ current: url, urls });
// };

function gotoPage(meta: IContentMeta) {
  if (!meta.link) return;
  emit('clickCallback', meta);
  handleLink(meta.linkType, meta.link);
}
</script>

<style lang="scss" module>
.layout {
  width: 100%;
  height: auto;
  .item {
    .item_img {
      position: relative;
      max-width: 375px;
      min-height: 10px;
      .image {
        width: 100%;
        height: 100%;
      }
      .pause_box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: $white;
        width: 100%;
        height: calc(100% - 80px);
        z-index: 99;
        .play_image {
          width: 48px;
          height: 48px;
          margin-bottom: 4px;
        }
      }
    }
  }
  .item_text {
    width: 100%;
    font-size: 14px;
    color: $font-color;
    line-height: 22px;
    padding: 0 18px;
    margin: 20px 0;
    white-space: pre-wrap;
  }
}
</style>
