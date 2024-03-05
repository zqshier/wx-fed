<template>
  <CustomPopup
    v-model:show="isShow"
    position="center"
    :popup-style="{ width: pxTransform(320) }"
    :z-index="99999"
    :closeable="false"
    :close-on-click-overlay="false"
  >
    <view :class="$style.layout" class="nut-flex-col nut-row-center nut-col-center">
      <view :class="$style.title" class="f_s-16">签到成功</view>
      <view :class="$style.tips" class="f_s-14">恭喜你获得以下奖励</view>
      <view :class="$style.award" class="nut-flex nut-row-center nut-col-top">
        <span :class="$style.total" class="f_s-24 f_w-700 numfnt">{{ totalPoint }}</span>
        <span class="f_s-16 f_w-600">小火苗</span>
      </view>

      <view v-if="showInfo" :class="$style.info" class="nut-flex-col nut-flex-1 nut-row-left">
        <view :class="$style.info_item" class="nut-flex nut-row-left" v-for="(item, index) in rewards" :key="index">
          <span :class="$style.left" class="nut-flex-1 nut-line-1">{{ item.memo }}</span>
          <span class="nut-flex-1">{{ item.count }}小火苗</span>
        </view>
      </view>

      <view :class="$style.btn" class="nut-flex nut-flex-1 nut-row-center">
        <nut-button v-if="showDetailBtn" :class="$style.btn_item" plain type="primary" @tap="gotoSignInPage"
          >查看详情</nut-button
        >
        <nut-button
          :class="{ [$style.btn_item]: showDetailBtn }"
          :block="!showDetailBtn"
          :plain="showDetailBtn"
          type="primary"
          @click="emits('update:show', false)"
          >好的</nut-button
        >
      </view>
    </view>
  </CustomPopup>
</template>

<script setup lang="ts">
import { ESigninType, ISigninRewardsData } from '@/dto/daily';
import Taro, { pxTransform } from '@tarojs/taro';
import { PropType, computed, ref, watchEffect } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  rewards: {
    type: Array as PropType<ISigninRewardsData[]>,
    default: () => [],
  },
  showDetailBtn: { type: Boolean, default: false },
});
const emits = defineEmits(['update:show']);

const isShow = ref(false);

const totalPoint = computed((): number => {
  let point = 0;
  props?.rewards.forEach(i => {
    point += i.count;
  });

  return point;
});

const showInfo = computed((): boolean => !!props.rewards.find(i => i.type === ESigninType.continuous));

watchEffect(() => {
  isShow.value = props.show;
});

const gotoSignInPage = () => {
  Taro.navigateTo({ url: '/packageA/pages/signin/signin' });
  emits('update:show', false);
};
</script>

<style lang="scss" module>
.layout {
  width: 320px;
  padding: 32px;
  .title {
    line-height: 24px;
    margin-bottom: 16px;
  }
  .tips {
    line-height: 24px;
    margin-bottom: 16px;
  }

  .award {
    width: 100%;
    padding: 8px 0px;
    color: $Brand;
    margin-bottom: 16px;
    line-height: 18px;
    .total {
      margin-right: 4px;
    }
  }

  .info {
    width: 100%;
    padding: 8px 0 4px;
    margin-bottom: 16px;
    &_item {
      line-height: 18px;
      margin-bottom: 4px;
      .left {
        text-align: right;
        margin-right: 8px;
      }
    }
  }

  .btn {
    width: 100%;
    &_item {
      width: 120px;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
