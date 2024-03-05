<template>
  <CustomPopup v-model:show="isShow" :popupStyle="popupStyle" position="center" :closeable="false">
    <view class="nut-flex-col nut-col-center" :class="$style.content">
      <view class="f_s-16 f_w-600" :class="$style.pop_title">提示</view>
      <view class="f_s-16 f_w-400" :class="$style.pop_hint"
        >奖品将在15个工作日内发放，收件信息提交后不可更改，请再次确认您的信息无误</view
      >
      <!-- 按钮 -->
      <view class="nut-flex nut-row-center">
        <nut-button shape="round" type="primary" plain :class="$style.btn" @click="onClose">取消</nut-button>
        <nut-button shape="round" type="primary" :class="[$style.btn, $style.btn_confirm]" @click="handleAffirm"
          >确认</nut-button
        >
      </view>
    </view>
  </CustomPopup>
</template>
<script setup lang="ts">
import { fillAddresses } from '@/api/prizes';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { IAddrParams } from '@/dto/prizes';
import { Toast } from '@/utils';
import { computed } from 'vue';
import { dProps } from './props';

const popupStyle = { width: 'auto' };

const emits = defineEmits(['update:show', 'close']);
const props = defineProps(dProps);

const isShow = computed(() => props.show);

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
  // width: 280px;
  padding: 24px 16px 16px 16px;
  .pop_title {
    margin-bottom: 16px;
  }
  .pop_hint {
    width: 232px;
    text-align: center;
    line-height: 24px; /* 150% */
    margin-bottom: 32px;
  }

  .btn {
    width: 120px;
  }

  .btn_confirm {
    margin-left: 8px;
  }
}
</style>
