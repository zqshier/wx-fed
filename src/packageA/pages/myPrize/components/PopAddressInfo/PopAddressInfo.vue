<template>
  <nut-popup
    closeable
    close-icon-position="top-right"
    close-icon="close-little"
    :close-on-click-overlay="false"
    :style="popupStyle"
    @click-close-icon="onClose"
    :safe-area-inset-bottom="true"
    :round="true"
    v-model:visible="isShow"
  >
    <view class="nut-flex-col nut-col-center content" :class="$style.content">
      <view class="f_s-18 f_w-600" :class="$style.pop_title">填写收货信息</view>
      <!-- 表单 -->
      <view :class="$style.form">
        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">收货人</text>
          <view class="item_input" :class="$style.item_input">
            <nut-input placeholder="请填写收货人姓名" class="f_s-14" v-model="formData.name" max-length="16" />
          </view>
        </view>

        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">手机号码</text>
          <view class="item_input" :class="$style.item_input">
            <nut-input placeholder="请填写收货人手机号码" max-length="11" type="tel" v-model="formData.phone" />
          </view>
        </view>

        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">所在地区</text>
          <view :class="$style.item_input" class="item_input" @tap="clickAddress">
            <input
              @click="clickAddress"
              v-model="regionInfo"
              class="f_s-14"
              placeholderClass="f_s-14 f_w-400 placeholderStyle"
              placeholder="省市区、乡镇等"
              :disabled="true"
              type="text"
            />
            <image :class="$style.icon_right" src="../../../../../static/icon/arrowLeft.png"></image>
          </view>
        </view>

        <view class="nut-flex nut-row-between" :class="$style.item">
          <text class="f_s-14 f_w-400" :class="$style.item_text">详细地址</text>
          <view :class="[$style.item_input, $style['item_input-H']]">
            <textarea
              placeholder="街道、楼牌号等"
              placeholderClass="f_s-14 f_w-400 placeholderStyle"
              :auto-height="true"
              :value="formData.address"
              :maxlength="100"
              :disableDefaultPadding="true"
              style="width: 100%; max-height: 40px; font-size: 28rpx"
              @input="changeAddress"
            />
          </view>
        </view>
      </view>
      <!-- 按钮 -->
      <view class="nut-flex nut-row-around f_s-15 f_w-400">
        <view class="nut-flex nut-row-center" :class="[$style.btn, $style.btn_cancel]" @tap="onClose">取消</view>
        <view class="nut-flex nut-row-center" :class="[$style.btn, $style.btn_affirm]" @tap="handleAffirm">确认</view>
      </view>
    </view>
  </nut-popup>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import Validator from 'miniprogram-validator';
import { Toast } from '@/utils';
import { dProps } from './props';

const popupStyle = { width: '690rpx', background: '#fff' };
const emits = defineEmits(['update:isShow', 'secondShow', 'clickAddress', 'clearAddress']);
const props = defineProps(dProps);

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

const formData = reactive({
  name: '',
  phone: '',
  address: '',
  province: '',
  city: '',
  district: '',
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
  emits('clickAddress');
};

const onClose = () => {
  emits('update:isShow', false);
  emits('clearAddress');
};
</script>
<style lang="scss" module>
@import './PopAddressInfo.scss';
</style>
<style lang="scss">
.nutui-popup__close-icon {
  color: $font-color;
}
.content {
  .nut-cell::after {
    border-bottom-color: $white;
  }
  .item_title {
    font-size: 28rpx;
    font-weight: 400;
    color: $Tertiary;
  }
  .placeholderStyle {
    color: $Tertiary;
  }
}
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
    color: $Tertiary;
    font-size: 28rpx;
    font-weight: 400;
  }
}
</style>
