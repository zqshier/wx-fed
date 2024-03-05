<template>
  <CustomPopup v-model:show="isShow">
    <view :class="$style.pop_container" class="nut-flex-col nut-col-center nut-row-center f_s-16 f_w-400">
      <text :class="$style.title">注册会员</text>

      <nut-button :class="$style.btn" shape="square" plain open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
        >使用手机号快捷登录</nut-button
      >

      <view class="nut-flex nut-row-center end_text f_s-12" :class="$style.end_text" @tap="handleChange">
        <CustomCheckBox :check="radioChecked" :m-right="8" />
        <view class="nut-flex nut-row-left">
          <text>我已阅读并同意</text>
          <text :class="$style.link" class="f_w-600" @tap.stop="gotoHelpPage(DOCUMENTS.FUWUXIEYI)">服务协议</text>
          <text>和</text>
          <text :class="$style.link" class="f_w-600" @tap.stop="gotoHelpPage(DOCUMENTS.YINSITIAOKUAN)">隐私条款</text>
        </view>
      </view>
    </view>
  </CustomPopup>
</template>
<script lang="ts" setup>
import { mandatePhoneApi } from '@/api/prizes';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { DOCUMENTS } from '@/constants';
import { PhoneRes, wxPhoneRes } from '@/dto/user';
import { useUserStore } from '@/stores';
import { Toast } from '@/utils';
import Taro from '@tarojs/taro';
import { computed, ref } from 'vue';

const userStore = useUserStore();

const emits = defineEmits(['update:isShow']);
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
});

const radioChecked = ref<boolean>(true);

const isShow = computed({
  get() {
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});

const handleChange = () => {
  radioChecked.value = !radioChecked.value;
};

const gotoHelpPage = (item: { code: string; title: string }) => {
  Taro.navigateTo({
    url: `/packageA/pages/help/help?title=${item.title}&code=${item.code}`,
  });
};

const getPhoneNumber = async ({ detail }: { detail: wxPhoneRes }) => {
  if (!detail.code) {
    Toast('获取手机号失败');
    return;
  }

  try {
    const result: PhoneRes = await mandatePhoneApi(detail);
    if (!result) return;
    await userStore.getUsersProfile();

    emits('update:isShow', false);
  } catch (error) {
    return Toast(error.message, 2000, 'none');
  }
};

// const onClose = () => {
//   emits('update:isShow', false);
// };
</script>
<style lang="scss" module>
.pop_container {
  color: var(--Primary, #333);
  text-align: center;
  font-family: 'FZLanTingHeiS-R-GB';
  padding: 0 24px;
  .title {
    margin-top: 32px;
  }

  .end_text {
    .link {
      text-decoration: underline;
      padding: 0 5px;
    }
  }

  .btn {
    margin: 32px 0 24px 0;
    width: 174px;
    height: 40px;
    background: $Primary;
    border-radius: 28px;
    font-size: 14px;
    font-weight: 400;
    color: $white;
    border: none;
  }
}
</style>
