<template>
  <nut-popup
    :style="popupStyle"
    @click-close-icon="onClose"
    :safe-area-inset-bottom="true"
    :round="true"
    v-model:visible="isShow"
  >
    <view class="nut-flex-col nut-col-center content" :class="$style.content">
      <view class="f_s-18 f_w-600" :class="$style.pop_title">提示</view>
      <view class="f_s-14 f_w-400" :class="$style.pop_hint">请确认您的收货信息无误</view>
      <!-- 按钮 -->
      <view class="nut-flex nut-row-around f_s-15 f_w-400">
        <view class="nut-flex nut-row-center" :class="[$style.btn, $style.btn_cancel]" @tap="onClose">取消</view>
        <view class="nut-flex nut-row-center" :class="[$style.btn, $style.btn_affirm]" @tap="handleAffirm">确认</view>
      </view>
    </view>
  </nut-popup>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Toast } from '@/utils';
import { IAddrParams } from '@/dto/prizes';
import { fillAddresses } from '@/api/prizes';
import { dProps } from './props';
const popupStyle = { width: '690rpx', background: '#fff' };

const emits = defineEmits(['update:show', 'close']);
const props = defineProps(dProps);

const isShow = computed(() => {
  return props.show;
});

const paramsData = computed(() => {
  return props.data;
});

const handleAffirm = async () => {
  const params: IAddrParams = { ...paramsData.value };
  params.id = props.prizeId;
  console.log('params: ', params);

  if (!props.code || !props.prizeId) return;
  try {
    const data: IAddrParams = await fillAddresses(props.code, params);
    console.log('data: ', data);
    close();
  } catch (err) {
    Toast(err.message, 3000);
    console.error('fillAddresses err=', err);
  }
};

const close = () => {
  onClose();
  emits('close');
};

const onClose = () => {
  emits('update:show', false);
};
</script>
<style lang="scss" module>
.content {
  padding: 18px;
  box-sizing: border-box;
  .pop_title {
    margin-top: 30rpx;
  }
  .pop_hint {
    margin: 50px 0;
  }

  .btn {
    width: 135px;
    height: 45px;
    border-radius: 27px;
    border: 1px solid $primary-color;
    &_cancel {
      color: $primary-color;
    }
    &_affirm {
      margin-left: 12px;
      background: $primary-color;
      color: $white;
    }
  }
}
</style>
