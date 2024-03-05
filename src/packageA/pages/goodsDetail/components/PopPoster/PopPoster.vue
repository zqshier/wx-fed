<template>
  <nut-popup v-model:visible="isShow" z-index="9999" position="bottom" @close="onClose" :closeable="true" :round="true">
    <view :class="$style['pop-poster']" class="nut-flex nut-flex-col nut-col-center nut-row-left">
      <view :class="$style.title">分享至</view>
      <view :class="$style['poster-center']">
        <PosterBuilder
          v-if="data.startDraw"
          :showLoading="true"
          :config="data.config"
          @success="onImgOk"
          @fail="onImgError"
        />
        <image v-if="image" :class="$style.image" :src="imageProcess(image, 'L')" />
        <view v-else :class="$style.image"></view>
      </view>
      <nut-button shape="square" size="large" type="primary" :class="$style.btn" @click="savePoster"
        >保存图片</nut-button
      >
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import PosterBuilder from '@/components/PosterBuilder/index.vue';
import { GoodsInfo } from '@/dto/goods';
import { useUserStore } from '@/stores';
import { Toast, imageProcess } from '@/utils';
import { getQrCodeUrl } from '@/utils/http';
import Taro from '@tarojs/taro';
import { PropType, computed, reactive, ref, watch } from 'vue';
import Card from './card';

const emits = defineEmits(['update:show']);
const SCOPE_WRITE_PHOTOS_ABLUM = 'scope.writePhotosAlbum';
const props = defineProps({
  show: { type: Boolean, default: true },
  guidePrice: { type: String, default: '' },
  price: { type: String, default: '' },
  goodsData: { type: Object as PropType<GoodsInfo | null>, default: null },
});
let image = ref<string>('');
const goodsInfo = computed(() => props.goodsData);

const data = reactive({
  startDraw: false,
  config: {},
});

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

watch(isShow, newVal => {
  if (newVal) {
    if (image.value) return;
    handleCreatePainter();
  }
});

// 生成海报
const handleCreatePainter = () => {
  const params = { id: goodsInfo.value?.id, uid: useUserStore().getUserInfo?.sid || '' };
  const qrcodeUrl = getQrCodeUrl({
    page: 'packageA/pages/goodsDetail/goodsDetail',
    params,
  });
  const value = new Card().palette(goodsInfo.value!, props.price, props.guidePrice, qrcodeUrl);
  data.config = value;
  data.startDraw = true;
};

const savePoster = () => {
  Taro.getSetting({
    success(res) {
      if (res.authSetting[SCOPE_WRITE_PHOTOS_ABLUM]) {
        saveImage();
      } else if (res.authSetting[SCOPE_WRITE_PHOTOS_ABLUM] === undefined) {
        Taro.authorize({
          scope: SCOPE_WRITE_PHOTOS_ABLUM,
          success() {
            saveImage();
          },
          fail() {
            authConfirm();
          },
        });
      } else {
        authConfirm();
      }
    },
  });
};

// 授权拒绝后，再次授权提示弹窗
const authConfirm = () => {
  Taro.showModal({
    content: '检测到您没打开保存图片权限，是否去设置打开？',
    confirmText: '确认',
    cancelText: '取消',
    success: res => {
      if (res.confirm) {
        Taro.openSetting({
          success(res) {
            if (res.authSetting[SCOPE_WRITE_PHOTOS_ABLUM]) {
              saveImage();
            } else {
              Toast('您没有授权，无法保存到相册');
            }
          },
        });
      } else {
        Toast('您没有授权，无法保存到相册');
      }
    },
  });
};

const onImgOk = result => {
  image.value = result.tempFilePath;
  data.startDraw = false;
};

const onImgError = error => {
  console.error('onImgError error=', error);
};

// 长按保存图片
const saveImage = () => {
  Taro.saveImageToPhotosAlbum({
    filePath: image.value,
    success(res) {
      console.log('saveImg res=', res);
      Toast('保存成功~');
    },
    fail(err) {
      console.log('saveImg err=', err);
      Toast('保存失败~');
    },
    complete() {
      Taro.vibrateShort();
    },
  });
};

const onClose = () => {
  emits('update:show', false);
};
</script>

<style lang="scss" module>
.pop-poster {
  width: 375px;
  height: 629px;
  padding: 20px 18px 36px;
  background: $white;
  .title {
    width: 339px;
    font-size: 12px;
    color: $font-color;
    line-height: 14px;
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 23px;
    margin-bottom: 30px;
    text-align: center;
  }
  .poster-center {
    width: 268px;
    height: 425px;
    border: 1px solid $primary-color;
    margin-bottom: 35px;
    background: $white;
    .image {
      width: 100%;
      height: 100%;
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
  }
}
</style>
