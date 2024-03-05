<template>
  <CustomPopup v-model:show="isShow" :popupStyle="popupStyle" position="center">
    <view class="nut-flex-col nut-col-center content" :class="$style.content">
      <view class="f_s-16" :class="$style.pop_title">{{ title }}</view>
      <!-- 表单 -->
      <view :class="$style.form">
        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">姓名</text>
          <view class="item_input" :class="$style.item_input">
            <nut-input
              placeholder="请填写姓名"
              class="f_s-14"
              v-model="formData.name"
              max-length="16"
              :readonly="isCheck"
            />
          </view>
        </view>

        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">手机号码</text>
          <view class="item_input" :class="$style.item_input">
            <nut-input
              placeholder="请填写手机号码"
              max-length="11"
              type="tel"
              v-model="formData.phone"
              :readonly="isCheck"
            />
          </view>
        </view>

        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">所在地区</text>
          <view :class="$style.item_input" class="item_input" @tap="clickAddress">
            <nut-input
              @click="clickAddress"
              v-model="regionInfo"
              class="f_s-14"
              placeholder="省市区、乡镇等"
              :readonly="true"
            />
            <image :class="$style.icon_right" :src="require('@/static/icon/chevron-right.png')"></image>
          </view>
        </view>

        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">详细地址</text>
          <view :class="$style.item_input">
            <textarea
              placeholder="街道、楼牌号等"
              placeholderClass="f_s-14 f_w-400 placeholderStyle"
              :auto-height="true"
              :value="formData.address"
              :maxlength="100"
              :disableDefaultPadding="true"
              style="width: 100%; max-height: 40px; font-size: 28rpx"
              :disabled="isCheck"
              @input="changeAddress"
            />
          </view>
        </view>
      </view>
      <!-- 按钮 -->
      <nut-button v-if="!isCheck" shape="round" type="primary" :class="$style.btn" @click="handleAffirm"
        >提交</nut-button
      >
    </view>
  </CustomPopup>
</template>

<script setup lang="ts">
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { Toast } from '@/utils';
import Validator from 'miniprogram-validator';
import { computed, reactive, ref, watchEffect } from 'vue';
import { dProps } from './props';

const popupStyle = { width: `auto` };

const emits = defineEmits(['update:isShow', 'secondShow', 'clickAddress', 'clearAddress']);
const props = defineProps(dProps);

const isCheck = ref(false); // 查看类型

const formData = reactive({
  name: '',
  phone: '',
  address: '',
  province: '',
  city: '',
  district: '',
});

const isShow = computed({
  get() {
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});

const regionInfo = computed(() => {
  console.log('props.addressInfo.texts.join: ', props.addressInfo.texts.join(''));
  return props.addressInfo.texts.join('') || '';
});

const title = computed(() => (isCheck.value ? '收货信息' : '填写收货信息'));

watchEffect(() => {
  if (!props.addrInfo?.name) return;
  for (const key in props.addrInfo) {
    if (Object.prototype.hasOwnProperty.call(props.addrInfo, key)) {
      const d = props.addrInfo[key];
      formData[key] = d;
    }
  }
  isCheck.value = true;
});

const handleAffirm = () => {
  const validator = handleValidator();
  const error = validator.validate(formData);
  console.debug('handleRegister error', error);
  if (error) return Toast(error.msg);

  let province = '',
    city = '',
    district = '';
  const texts = props.addressInfo.texts;
  if (texts) {
    province = texts[0];
    city = texts[1];
    district = texts[2] || '';
  }

  formData.phone = String(formData.phone);
  formData.province = province;
  formData.city = city;
  formData.district = district;

  emits('secondShow', { type: true, formData });
};

const handleValidator = () => {
  return new Validator({
    name: [
      { message: '请输入收货人姓名', required: true },
      { message: '姓名不能超过16个字', maxlength: 16 },
    ],
    phone: [
      { message: '请填写收货人手机号码', required: true },
      { message: '请输入正确的手机号', minlength: 11 },
    ],
    address: [{ message: '请输入详细地址', required: true }],
  });
};

const changeAddress = e => {
  formData.address = e.detail.value || '';
};

const clickAddress = () => {
  if (isCheck.value) return;
  emits('clickAddress');
};

// const onClose = () => {
//   emits('update:isShow', false);
//   emits('clearAddress');
// };
</script>
<style lang="scss" module>
@import './PopAddressInfo.scss';
</style>
<style lang="scss">
.item_input {
  .nut-input {
    background: transparent;
    padding: 0;
    border: none;
    input {
      width: 100%;
    }
  }
  .nut-placeholder {
    font-size: 28rpx;
    font-weight: 400;
  }
}
</style>
