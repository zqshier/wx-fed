<!-- <template>
  <CustomPopup
    v-model:show="isShow"
    position="center"
    :popup-style="{ width: pxTransform(320) }"
    :z-index="99999"
    v-bind="$attrs"
  >
    <view class="nut-flex-col nut-col-center content" :class="$style.content">
      <view :class="$style.title" class="f_s-16 nut-flex-1 nut-flex nut-row-center">注册会员</view>

      <view :class="$style.form_box">
        <view :class="$style.item" class="nut-flex nut-row-between">
          <input
            :class="$style.input"
            class="f_s-14 nut-flex-1"
            type="number"
            placeholder="+86 请输入手机号码"
            :placeholder-class="$style.holder"
            maxlength="11"
            name="mobile"
            @input="getMobile"
          />
        </view>

        <view :class="$style.item" class="nut-flex nut-row-between">
          <input
            :class="$style.input"
            class="f_s-14 nut-flex-1"
            :placeholder-class="$style.holder"
            placeholder="请输入图形验证码"
            maxlength="4"
            name="vaildate"
            @input="getVaildateCode"
          />
          <image :src="vaildateCodeImg" mode="widthFix" :class="$style.vaildate" @tap="handleResetImg"></image>
        </view>

        <view :class="$style.item" class="nut-flex nut-row-between">
          <input
            :class="$style.input"
            class="f_s-14 nut-flex-1"
            :placeholder-class="$style.holder"
            type="number"
            placeholder="请输入短信验证码"
            maxlength="4"
            name="code"
            :disabled="isCodeCanClick"
            @input="getCode"
          />

          <nut-button
            :class="$style.code_btn"
            type="primary"
            size="small"
            :disabled="!registerParams.vaildate || !registerParams.mobile || !isCodeCanClick"
            @click="handleSendSms"
            >{{ isCodeCanClick ? '发送验证码' : `${timeNum}S后重发` }}</nut-button
          >
        </view>

        <nut-button
          :class="$style.btn"
          type="primary"
          :disabled="!isCanRegister"
          :loading="loadingRegister"
          @click="handleRegister"
          >登录 / 注册</nut-button
        >
      </view>

      <view class="nut-flex nut-row-center end_text" :class="$style.end_text" @tap="handleChange">
        <CustomCheckBox :check="radioChecked" :m-right="8" />
        <view class="nut-flex nut-row-left">
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
import Taro, { pxTransform } from '@tarojs/taro';
import { computed, ref, watchEffect } from 'vue';

import { DOCUMENTS, TARGET_PHOME_AUTH_CALLBACK } from '@/constants';
import { Toast, phoneVerify } from '@/utils/index';
import { tarckEvents, track, IEventsName } from '@/utils/track';
import { sendsmsApi } from '@/api-old';
import { useUserStore } from '@/stores';

import { TARGET_PHOME_AUTH_CALLBACK } from '@/constants';
import { MemberParams, PhoneRes, wxPhoneRes } from '@/dto/user';
import { Toast } from '@/utils/index';
import { pick } from 'lodash';
import { useUserStore, useAppStore } from '@/stores';

import CustomPopup from '../CustomPopup/CustomPopup.vue';
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';

const userStore = useUserStore();
const defaultVcodeUrl = `${process.env.API_HOST_OLD}/interface/getcode.aspx?openid=${userStore?.userInfo?.openid}`;
let timer;

const emits = defineEmits(['update:isShow', 'refresh']);
const props = defineProps(['isShow', 'code', 'target']);
const loadingRegister = ref<boolean>(false);
const radioChecked = ref<boolean>(true);
const vaildateCodeImg = ref('');
const registerParams = ref({ mobile: '', code: '', vaildate: '' });
const isCodeCanClick = ref(true);
const timeNum = ref(60);

const isShow = computed({
  get() {
    if (props.isShow) track({ name: '注册弹窗打开', theaction: 'pv' });
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});

const isCanRegister = computed((): boolean => radioChecked.value && !!registerParams.value.code);

watchEffect(() => {
  if (isShow.value) vaildateCodeImg.value = defaultVcodeUrl;
  // useAppStore().setShowTabbar(!isShow.value);
});

function getMobile(event) {
  registerParams.value.mobile = event.detail.value;
}

function getVaildateCode(event) {
  registerParams.value.vaildate = event.detail.value;
}

function getCode(event) {
  registerParams.value.code = event.detail.value;
}

function handleResetImg() {
  vaildateCodeImg.value = `${defaultVcodeUrl}&v=${Math.random()}`;
  track({ name: '重置图形验证码', theaction: 'kv' });
}

async function handleSendSms() {
  const { mobile, vaildate } = registerParams.value;
  if (!phoneVerify(mobile)) return Toast('请输入正确手机号', 2000);

  try {
    const result: any = await sendsmsApi({ mobile, imgcode: vaildate });

    if (result.errcode === -1) {
      Toast('验证码错误');
      handleResetImg();
      registerParams.value.vaildate = '';
    }
    if (result.errcode === 0) {
      Toast('短信发送成功');
      // 短信发送成功倒计时
      handleCountDown();
    }
  } finally {
    track({ name: '发送短信验证码', theaction: 'kv' });
  }
}

async function handleRegister() {
  if (loadingRegister.value) return;
  loadingRegister.value = true;
  const { mobile, code } = registerParams.value;
  try {
    const result = await userStore.registerOldMember({
      mobile,
      code,
      nickName: '微信用户',
      avatarUrl:
        'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
      gender: 0,
      country: '',
      province: '',
      city: '',
      language: '',
    });
    console.debug('注册弹窗 result=', result);
    if (result.errcode == 0) {
      Toast('注册成功');
      emits('refresh', result);
      // 全局通知注册会员成功, 以执行下一步
      if (props.target) {
        Taro.eventCenter.trigger(TARGET_PHOME_AUTH_CALLBACK, props.target);
      }
      tarckEvents([
        {
          event: IEventsName.REGISTER_CM,
          path: Taro.getCurrentInstance()!.page?.route,
        },
      ]);
      onClose();
    } else {
      Toast(result.errmsg);
    }
  } finally {
    loadingRegister.value = false;
  }
}

function handleCountDown() {
  timer = setInterval(() => {
    timeNum.value--;
    isCodeCanClick.value = false;
    if (timeNum.value === 0) {
      clearInterval(timer);
      isCodeCanClick.value = true;
      timeNum.value = 60;
    }
  }, 1000);
}

const handleChange = () => {
  radioChecked.value = !radioChecked.value;
};

const gotoHelpPage = (item: { code: string; title: string }) => {
  Taro.navigateTo({
    url: `/packageA/pages/help/help?title=${item.title}&code=${item.code}`,
  });
};

const onClose = () => {
  emits('update:isShow', false);
};
</script>
<style lang="scss" module>
.content {
  width: 320px;
  padding: 32px;

  .title {
    line-height: 24px;
    margin-bottom: 16px;
  }

  .form_box {
    .item {
      position: relative;
      margin-bottom: 8px;
      width: 256px;
      height: 40px;
      padding: 0 4px 0 16px;
      border-radius: 20px;
      background: $white;
      border: 1px solid $Divide;
      .input {
        height: 40px;
        line-height: 40px;
        margin-right: 16px;
        box-sizing: border-box;
      }

      .vaildate {
        width: 66px;
        height: 28px;
        margin-right: 12px;
      }
      .holder {
        color: $Tertiary;
      }

      .code_btn {
        width: 92px;
        padding: 0;
      }
    }
  }
  .btn {
    min-width: 256px;
    height: 40px;
    margin: 8px auto 24px;
  }
  .end_text {
    color: $Secendary;
    .link {
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
</style> -->
