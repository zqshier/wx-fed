<template>
  <view class="container">
    <CustomBar :logo-color="LogoColorType.BLACK" bg-color="transparent" />

    <view :class="$style.swiper_box" v-if="isLoaded">
      <CustomSwiper
        :isAutoPlayHasV="false"
        :autoplay="false"
        :height="toPx(1388)"
        :current="swiperCurrent"
        :isTransition="false"
        imgMode="aspectFill"
        bgColor="#fff"
        videoName="gDetail"
        :list="imgList"
        @change="swiperChange"
        :use-image-bg="true"
        :swiperItemSlot="true"
        :indicatorStyle="{ bottom: 0 }"
      >
        <template v-slot="{ data }">
          <view :class="$style.swiper_content">
            <image mode="aspectFill" :src="data.src" :class="$style.image"></image>
            <image mode="aspectFill" :src="qrcodeUrl" :class="$style.imageQr"></image>
          </view>
        </template>
      </CustomSwiper>

      <nut-button shape="square" size="large" type="primary" :loading="isLoading" :class="$style.btn" @click="getPoster"
        >保存至手机</nut-button
      >
    </view>

    <Loading :show="!isLoaded" />

    <PosterBuilder
      v-if="data.startDraw"
      :showLoading="true"
      :config="data.config"
      @success="onImgOk"
      @fail="onImgError"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import Card from './card';

import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import CustomSwiper from '@/components/CustomSwiper/CustomSwiper.vue';
import Loading from '@/components/Loading/Loading.vue';
import { toPx } from '@/components/PosterBuilder/utils/tools';
import PosterBuilder from '@/components/PosterBuilder/index.vue';

import { useInvitePostStore } from '@/stores';
import { IBanner } from '@/dto/banner';
import savePoster from '@/hook/savePoster';

const { setVal, handleSavePoster, onSaveImageCallback } = savePoster();

const invitePostStore = useInvitePostStore();

const swiperCurrent = ref<number>(0); // 轮播图当前所在滑块
const isLoaded = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const data = reactive({
  startDraw: false,
  config: {
    width: 750,
    height: 1380,
  },
});

const qrcodeUrl = computed((): string => invitePostStore.qrCodeUrl);
const imgList = computed((): IBanner[] => invitePostStore.imgList);

const selectImg = computed(() => imgList.value[swiperCurrent.value].src);

const getPoster = () => {
  if (!qrcodeUrl.value || !selectImg.value) return;
  isLoading.value = true;

  const value = new Card().palette(selectImg.value, qrcodeUrl.value);
  data.config = value;
  data.startDraw = true;
};

onMounted(async () => {
  if (!qrcodeUrl.value) {
    await invitePostStore.getQRCode();
  }
  if (!imgList.value.length) {
    await invitePostStore.getImgList();
  }
  isLoaded.value = true;
});

function swiperChange(val) {
  swiperCurrent.value = val;
}

const onImgOk = result => {
  data.startDraw = false;
  setVal(result.tempFilePath);
  handleSavePoster();
  onSaveImageCallback.value = () => {
    isLoading.value = false;
  };
};

const onImgError = error => {
  console.error('onImgError error=', error);
};
</script>

<style lang="scss" module>
.swiper_box {
  width: 100%;
  position: absolute;
  text-align: center;
}
.swiper_content {
  .image {
    width: 100%;
    height: 698px;
    position: relative;
  }
  .imageQr {
    width: 68px;
    height: 68px;
    position: absolute;
    bottom: 45px;
    right: 24px;
  }
}
.btn {
  width: 345px;
  height: 45px;
  line-height: 45px;
  color: $white;
  font-size: 14px;
  text-align: center;
  background: $primary-color;
  border-radius: 50px;
  z-index: 2;
  margin: 24px 0 10px 0;
}
</style>
