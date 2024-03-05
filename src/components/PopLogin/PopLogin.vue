<template>
  <CustomPopup :zIndex="99999" v-model:show="isShow">
    <view class="nut-flex-col nut-col-center content" :class="$style.content">
      <view :class="$style.title" class="f_s-16 nut-flex-1 nut-flex nut-row-center">注册会员</view>
      <nut-button
        :class="$style.btn"
        type="primary"
        :disabled="!radioChecked"
        :open-type="radioChecked ? 'getPhoneNumber' : ''"
        @getphonenumber="getPhoneNumber"
        :loading="loadingRegister"
      >
        <view class="nut-flex nut-flex-1 nut-row-center">
          <!-- <image style="width: 24px; height: 24px; margin-right: 8px" src="../../static/icon/wechat.png"></image> -->
          <text class="f_s-14">使用手机号登录</text>
        </view>
      </nut-button>

      <view class="nut-flex nut-row-center end_text" :class="$style.end_text" @tap="handleChange">
        <CustomCheckBox :check="radioChecked" :m-right="8" />
        <view class="nut-flex nut-row-left f_s-12">
          <text>我已阅读并同意</text>
          <text :class="$style.link" class="f_w-600" @tap.stop="gotoHelpPage(DOCUMENTS.FUWUXIEYI)">服务协议</text>
          <text>和</text>
          <text :class="$style.link" class="f_w-600" @tap.stop="gotoHelpPage(DOCUMENTS.YINSITIAOKUAN)">隐私条款</text>
        </view>
      </view>
    </view>
    <template #close-icon>
      <image src="./../../static/icon/close.png" :class="$style.close"></image>
    </template>
  </CustomPopup>
</template>

<script setup lang="ts">
import { cdpEventApi } from '@/api/cdp';
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import { DOCUMENTS, TARGET_PHOME_AUTH_CALLBACK, WX_SCENE } from '@/constants';
import { MemberParams, PhoneRes, wxPhoneRes } from '@/dto/user';
import { LOGIN_STATUS_KEY, useAppStore, useUserStore } from '@/stores';
import { Toast } from '@/utils/index';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp } from '@tarojs/taro';
import { pick } from 'lodash';
import { computed, ref, watchEffect } from 'vue';
import CustomPopup from '../CustomPopup/CustomPopup.vue';
const linkflow = getApp()[`${process.env.APP_ID}`];

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

// 1. 用户资料里有手机号，说明已经注册过，走登录接口，只验证手机号是否和该账号匹配，不更新手机号
// 2. 用户资料里没有手机号，说明未注册过，走注册接口，注册接口会更新用户手机号
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

  // 设置登录态 (防止重新登录后获取的值不是最新的)
  Taro.setStorageSync(LOGIN_STATUS_KEY, true);

  let trackFailReason = '';
  let isNewMember = true;

  const hasPhone = !!userStore.userInfo?.phone;
  let result;
  try {
    result = hasPhone ? await userStore.loginMember(params) : await userStore.registerMember(params);
  } catch (error) {
    Taro.setStorageSync(LOGIN_STATUS_KEY, false);
    trackFailReason = error.message;
    return Toast(error.message, 2000, 'none');
  } finally {
    loadingRegister.value = false;
    onTrack(params, trackFailReason, isNewMember);
  }

  if (!hasPhone) {
    isNewMember = result.isNew;

    if (!userStore.userInfo?.memberLevel) {
      Toast('恭喜您成为Zippo会员，新人礼包已到账');
    }
  }

  emits('refresh', result);

  // 全局通知注册会员成功, 以执行下一步
  if (props.target) Taro.eventCenter.trigger(TARGET_PHOME_AUTH_CALLBACK, props.target);

  onClose();
};

const handleChange = () => {
  radioChecked.value = !radioChecked.value;
};

const onClose = () => {
  emits('update:isShow', false);
};

const onTrack = (params: MemberParams, trackFailReason: string, isNewMember: boolean) => {
  if (!linkflow) return;
  const triggerPagePath = getRefererPath();
  // 埋点 底部菜单点击
  const inviteWayMap = {
    [WX_SCENE.SCENE_1007]: '分享产品',
    [WX_SCENE.SCENE_1008]: '分享产品',
    [WX_SCENE.SCENE_1047]: '邀请海报',
  };

  const inviteWay =
    (params.introducer && userStore.onShowOptions?.scene && inviteWayMap[userStore.onShowOptions.scene]) || '';

  linkflow.track({
    event: ELinkflowEventsName.Login_Register,
    props: {
      failReason: trackFailReason,
      memberId: userStore.userInfo?.memberLevel || '',
      mobilePhone: params.phone.phone || '',
      triggerPagePath,
      triggerFunction: props.target,
      isInviteRegistration: !!userStore.introducer,
      isNewMember,
      inviteWay,
      shareEncodeMiniUserId: userStore.introducer,
    } as ILinkflowEventsProps,
  });

  // 注册成功 通过推荐人途径-邀请注册成功埋点
  if (params?.introducer && trackFailReason === '') {
    const { openid = '', unionid = '', nickname = '' } = userStore.userInfo!;
    if (openid && unionid) {
      cdpEventApi({
        sid: params.introducer,
        messages: [
          {
            data: {
              event: ELinkflowEventsName.Invitation_RegistrationSuccessful,
              props: { inviteeOpenId: openid, inviteeUnionId: unionid, inviteeNickname: nickname },
            },
          },
        ],
      });
    }
  }
};
</script>
<style lang="scss" module>
.content {
  padding: 32px 24px;
  .btn {
    min-width: 236px;
    height: 40px;
    margin: 32px auto 24px;
  }
  .end_text {
    .link {
      font-family: 'FZLanTingHei-B-GBK';
      color: $Secendary;
      text-decoration: underline;
      padding: 0 5px;
    }
  }
}
.close {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
}
</style>
