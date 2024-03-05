<template>
  <BackgroundImage>
    <view>
      <CustomBar bg-color="transparent" :logo-color="LogoColorType.BLACK" />

      <view :class="$style['pop-poster']" class="nut-flex nut-flex-col nut-col-center nut-row-left">
        <view :class="$style['poster-center']">
          <PosterBuilder
            v-if="data.startDraw"
            :showLoading="true"
            :config="data.config"
            @success="onImgOk"
            @fail="onImgError"
          />
          <image v-if="image" :class="$style.image" :src="imageProcess(image, 'L')" :showMenuByLongpress="true" />
          <view v-else :class="$style.image"></view>
        </view>

        <view :class="$style.footer">
          <nut-button shape="square" size="large" type="primary" :class="$style.btn" @click="savePoster"
            >保存到手机</nut-button
          >
        </view>
      </view>
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import PosterBuilder from '@/components/PosterBuilder/index.vue';
import { posterSource } from '@/dto/point';
import { useUserStore } from '@/stores';
import { Toast, imageProcess } from '@/utils';
import { getQrCodeUrl } from '@/utils/http';
import { IEventsName, tarckEvents } from '@/utils/track';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import Card from './card';

const routerInfo = getCurrentInstance().preloadData || {};
const type = ref<string>(routerInfo.type || '');

const SCOPE_WRITE_PHOTOS_ABLUM = 'scope.writePhotosAlbum';

let image = ref<string>('');

const goodsInfo = computed(() => routerInfo.goodsInfo);
const pointsGoodsInfo = computed(() => routerInfo.pointsGoodsInfo);
const currentSkusData = computed(() => routerInfo.cSkusData);
const isNormalGoods = computed(() => type.value === posterSource.normalGoods);

const data = reactive({
  startDraw: false,
  config: {
    width: 750,
    height: 1352,
  },
});

// 生成海报
const handleCreatePainter = () => {
  const params = { id: goodsInfo.value?.id, uid: useUserStore().getUserInfo?.sid || '' };

  if (!isNormalGoods.value) {
    params.id = pointsGoodsInfo.value?.goodsInfo.id;
    params['promotionId'] = pointsGoodsInfo.value?.promotionId;
  }

  let qrcodeUrl;
  try {
    qrcodeUrl = getQrCodeUrl({
      page: isNormalGoods.value
        ? 'packageA/pages/goodsDetail/goodsDetail'
        : 'packageA/pages/pointGoodsDetail/pointGoodsDetail',
      params,
    });
  } catch (error) {
    Toast('网络错误,请重试', 2000, 'none', true, () => {
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    });
  }
  if (!qrcodeUrl) return;
  const cardData = isNormalGoods.value ? goodsInfo.value : pointsGoodsInfo.value;

  const value = new Card().palette(cardData!, qrcodeUrl);
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
  const path = 'packageA/pages/posterImage/posterImage';
  const goodsId = goodsInfo.value?.id;
  const skuId = currentSkusData.value?.id;
  Taro.saveImageToPhotosAlbum({
    filePath: image.value,
    success(res) {
      console.log('saveImg res=', res);
      tarckEvents([{ path, event: IEventsName.POSTER_CL, properties: { goodsId, skuId, status: 1 } }]);
      Toast('保存成功~');
    },
    fail(err) {
      console.log('saveImg err=', err);
      tarckEvents([{ path, event: IEventsName.POSTER_CL, properties: { goodsId, skuId, status: 0 } }]);
      Toast('保存失败~');
    },
    complete() {
      Taro.vibrateShort();
    },
  });
};

// const onClose = () => {
//   emits('update:show', false);
// };
onMounted(() => {
  handleCreatePainter();
});

onUnmounted(() => {
  Taro.preload({});
});
</script>

<style lang="scss" module>
.pop-poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  .poster-center {
    width: 376px;
    height: 676px;
    .image {
      width: 100%;
      height: 100%;
    }
  }
  .footer {
    // position: fixed;
    // bottom: 0;
    // left: 0;
    margin-top: 20px;
    width: 375px;
    min-height: 55px;
    text-align: center;

    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
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
