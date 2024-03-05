<template>
  <nut-popup
    :pop-class="$style.gift_layout"
    closeable
    @click-close-icon="onClose"
    :round="true"
    class="newGift"
    v-model:visible="isShow"
  >
    <view :class="$style.title" class="nut-flex nut-flex-col nut-col-center nut-row-center">
      <text class="f_s-18 f_w-600">生日礼包</text>
      <text :class="$style.tips" class="f_s-12 f_w-400">还有人记得你的生日哦，已为您发放生日礼包</text>
    </view>

    <giftContents :data="list" />
    <view :class="$style.instructions" class="f_s-12 f_w-400">以上奖励已自动发放至您的账户</view>

    <view :class="$style.btn_row" class="nut-flex nut-row-center nut-col-cener">
      <nut-button :class="$style.btn_receive" type="primary" plain @click="gotoCouponPage">立即前往</nut-button>
    </view>
  </nut-popup>
</template>
<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { computed, PropType } from 'vue';
import { INewComerGiftsInfo } from '@/dto/user';
import { subscribeMessage } from '@/utils';

import giftContents from './giftContents.vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array as PropType<INewComerGiftsInfo[]>,
    default: null,
  },
});

const emits = defineEmits(['update:show', 'close']);
const list = computed((): INewComerGiftsInfo[] => props.data);

const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const gotoCouponPage = async () => {
  if (list.value.find(item => item.type === 'coupon')) {
    handleSubscribe().finally(() => {
      Taro.navigateTo({ url: '/packageA/pages/coupon/couponList/couponList' });
    });
  } else {
    Taro.navigateTo({ url: '/packageA/pages/myIntegral/myIntegral' });
  }

  onClose();
};

const handleSubscribe = async () => {
  try {
    const mid = process.env.COUPON_EXPIRE_MID!;
    await subscribeMessage([mid]);
  } catch (error) {
    console.error('handleSubscribe', error);
  }
};
const onClose = () => {
  emits('close', false);
};
</script>
<style lang="scss">
.newGift {
  .nutui-iconfont {
    font-weight: 600;
    color: #444;
  }
}
</style>
<style lang="scss" module>
.gift_layout {
  // width: 300px;
  max-height: 500px;
  padding: 40px 30px 32px 30px;
  background: $white;
  border-radius: 20px;
  .title {
    font-family: 'FZLanTingHei-B-GBK';
    color: #444;
    width: 100%;
    .tips {
      margin-top: 4px;
      // color: $Tertiary;
    }
  }
  .instructions {
    margin: 16px 0;
    width: 100%;
    text-align: center;
    color: $Tertiary;
    font-family: 'FZLanTingHei-R-GBK';
  }
  .btn_row {
    width: 100%;
    .btn_receive {
      width: 236px;
      height: 45px;
    }
  }
}
</style>
