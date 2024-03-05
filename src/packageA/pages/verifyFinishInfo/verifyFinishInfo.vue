<template>
  <BackgroundImage :class="$style.layout">
    <CustomBar title="完善信息" />

    <view :class="$style.main" class="nut-flex-col nut-row-center nut-col-center">
      <!-- <view
        v-if="product.name && product.qrPhoto"
        :class="$style.goods"
        class="nut-flex-col nut-row-center nut-col-center"
      >
        <text>{{ product.name }}</text>
        <image :class="$style.image" :src="product.qrPhoto"></image>
      </view> -->

      <view :class="$style.info">
        <view :class="$style.info_item" class="nut-flex-wrap nut-flex-col nut-row-left nut-col-top">
          <view :class="$style.label" class="f_s-14">购买目的</view>
          <view :class="$style.item_bottom" class="nut-flex nut-flex-wrap nut-col-center but-row-between">
            <view
              :class="[$style.radio_box, item.value === qrCompleteInfo.buyPurpose && $style.active]"
              class="nut-flex nut-col-center nut-row-top"
              v-for="item in buyPurposeList"
              :key="item.value"
              @tap="handleChangeBuyPurpose(item.value)"
            >
              <view :class="$style.radio"></view>
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <view :class="$style.btn">
        <nut-button :block="true" type="primary" :loading="loadingSave" @tap="handleSubmit"
          >提交信息领取小火苗</nut-button
        >
      </view>
    </view>
  </BackgroundImage>
</template>
<script setup lang="ts">
import { IUiCodeBuyPurposeData, IUiCodeProductVo, uicodeSetBuyPurpose } from '@/api/uicode';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import { TARGET_VERIFY_FINISH } from '@/constants';
import { Toast } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp, useRouter } from '@tarojs/taro';
import Validator from 'miniprogram-validator';
import { onMounted, ref } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const router = useRouter();
const buyPurposeList = [
  { label: '自用', value: '3' },
  { label: '送礼', value: '1' },
  { label: '收藏', value: '2' },
];

const qrCompleteInfo = ref<IUiCodeBuyPurposeData>({
  cipher: (router.params?.cipher && router.params.cipher + '') || '',
  buyPurpose: '3',
});
const product = ref<IUiCodeProductVo>({
  name_e: '',
  name: '',
  qrPhoto: '',
  code: '',
  barcode: '',
});
const loadingSave = ref(false);

onMounted(() => {
  if (router.params.product) {
    try {
      product.value = JSON.parse(decodeURIComponent(router.params?.product));
    } catch (e) {
      /* empty */
    }
  }
});

function handleChangeBuyPurpose(value) {
  qrCompleteInfo.value.buyPurpose = value;
}

async function handleSubmit() {
  const validator = new Validator({
    buyPurpose: [{ message: '购买目的不能为空', required: true }],
  });

  const error = validator.validate(qrCompleteInfo.value);
  console.debug('handleSubmit error', error);
  if (error) {
    return Toast(error.msg, 2000, 'none');
  }

  loadingSave.value = true;
  let result;
  try {
    const { cipher, buyPurpose } = qrCompleteInfo.value;
    result = await uicodeSetBuyPurpose({ cipher, buyPurpose });
    console.debug('verifyFinishInfo page handleSubmit result', result);
  } catch (error) {
    return Toast(error.message);
  } finally {
    loadingSave.value = false;
  }

  if (!result) return;

  Taro.eventCenter.trigger(TARGET_VERIFY_FINISH);
  Toast('保存成功', 2000, 'none', true, () => {
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  });

  linkflow &&
    linkflow.track({
      event: ELinkflowEventsName.InteractiveTask_BuyPurpose_Submit,
      props: {
        buyPurpose: buyPurposeList.find(i => i.value === qrCompleteInfo.value.buyPurpose)?.label,
        triggerPagePath,
      } as ILinkflowEventsProps,
    });
}
</script>
<style lang="scss" module>
@import './verifyFinishInfo.scss';
</style>
