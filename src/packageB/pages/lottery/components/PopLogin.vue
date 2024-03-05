<template>
  <CustomPopup :zIndex="99999" v-model:show="isShow">
    <view :class="$style.pop_container" class="nut-flex-col nut-col-center nut-row-center f_s-16 f_w-400">
      <text :class="$style.title">注册会员</text>

      <nut-button
        :class="$style.btn"
        shape="square"
        :disabled="!radioChecked"
        :open-type="radioChecked ? 'getPhoneNumber' : ''"
        :loading="loadingRegister"
        @getphonenumber="getPhoneNumber"
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
<script setup lang="ts">
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { DOCUMENTS, TARGET_PHOME_AUTH_CALLBACK } from '@/constants';
import { MemberParams, PhoneRes, wxPhoneRes } from '@/dto/user';
import { useAppStore, useUserStore } from '@/stores';
import { Toast } from '@/utils/index';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp } from '@tarojs/taro';
import { pick } from 'lodash';
import { computed, ref, watchEffect } from 'vue';

const userStore = useUserStore();

const emits = defineEmits(['update:isShow', 'refresh']);
const props = defineProps(['isShow', 'code', 'target']);
// const popupStyle = { width: pxTransform(375), background: 'rgba(255, 255, 255, 0.8)', 'backdrop-filter': 'blur(10px)' };
const loadingRegister = ref<boolean>(false);
const radioChecked = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});

watchEffect(() => {
  useAppStore().setShowTabbar(!isShow.value);
});

const gotoHelpPage = (item: { code: string; title: string }) => {
  Taro.navigateTo({
    url: `/packageA/pages/help/help?title=${item.title}&code=${item.code}`,
  });
};

const getPhoneNumber = async ({ detail }: { detail: wxPhoneRes }) => {
  if (!detail.code) return Toast('获取手机号失败');

  const params: MemberParams = {
    phone: {
      code: '',
      phone: '',
    },
    rid: '',
    introducer: userStore.introducer,
  };

  if (loadingRegister.value) return;
  loadingRegister.value = true;

  try {
    const result: PhoneRes = await userStore.updatePhonenumber(detail);
    if (!result) return;
    params.phone = pick(result, 'code', 'phone');
    params.rid = result.rid;
  } catch (error) {
    loadingRegister.value = false;
    return Toast(error.message, 2000, 'none');
  }

  if (!params.rid) return;

  let trackFailReason = '';
  try {
    console.log('注册会员成功params:', params);
    const result = await userStore.registerMember(params);
    if (!userStore.userInfo?.memberLevel) {
      Toast('恭喜您成为Zippo会员，新人礼包已到账');
    }
    emits('refresh', result);
    // 全局通知注册会员成功, 以执行下一步
    if (props.target) Taro.eventCenter.trigger(TARGET_PHOME_AUTH_CALLBACK, props.target);
    onClose();
  } catch (error) {
    trackFailReason = error.message;
    return Toast(error.message, 2000, 'none');
  } finally {
    loadingRegister.value = false;
    const linkflow = getApp()[`${process.env.APP_ID}`];
    const memberId = userStore.userInfo?.memberLevel || '';
    const triggerPagePath = getRefererPath();
    // 埋点 底部菜单点击
    linkflow.track({
      event: ELinkflowEventsName.Login_Register,
      props: {
        failReason: trackFailReason,
        memberId,
        mobilePhone: params.phone.phone || '',
        triggerPagePath,
        triggerFunction: props.target,
      } as ILinkflowEventsProps,
    });
  }
};

const handleChange = () => {
  radioChecked.value = !radioChecked.value;
};

const onClose = () => {
  emits('update:isShow', false);
};
</script>
<style lang="scss" module>
.pop_container {
  color: $Primary;
  text-align: center;
  padding: 0 24px;

  .title {
    padding: 32px 0;
  }

  .end_text {
    padding-bottom: 32px;
    .link {
      text-decoration: underline;
      padding: 0 5px;
    }
  }

  .btn {
    width: 174px;
    height: 40px;
    background: $Primary;
    margin-bottom: 24px;
    border-radius: 28px;
    font-size: 14px;
    font-weight: 400;
    color: $white;
    border: none;
  }
}
</style>
