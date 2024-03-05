<template>
  <CustomPopup
    v-model:show="isShow"
    position="center"
    :popup-style="{ width: pxTransform(320) }"
    :z-index="99999"
    v-bind="$attrs"
  >
    <view class="nut-flex-col nut-col-center content" :class="$style.content">
      <view :class="$style.title" class="f_s-16 nut-flex-1 nut-flex nut-row-center">填写信息</view>

      <view :class="$style.form_box">
        <view :class="$style.item" class="nut-flex nut-row-between f_s-14 f_w-400">
          <text :class="$style.item_title">姓名</text>
          <input
            :class="$style.input"
            class="f_s-14 nut-flex-1"
            type="text"
            placeholder="请填写姓名"
            :disabled="detailsData?.isSignUp"
            :placeholder-class="$style.holder"
            v-model="userInfo.name"
          />
        </view>
        <view :class="$style.item" class="nut-flex nut-row-between f_s-14 f_w-400">
          <text :class="$style.item_title">手机号</text>
          <view :class="$style.item_content">{{ oriUserInfo.phone }}</view>
        </view>
        <view :class="$style.item" class="nut-flex nut-row-between f_s-14 f_w-400">
          <text :class="$style.item_title">性别</text>
          <view :class="$style.item_content" class="nut-flex" @tap="handleGenderSheet">
            <input
              :class="$style.input"
              class="nut-flex-1"
              :disabled="true"
              :placeholder-class="$style.holder"
              placeholder="请选择性别"
              :value="genderData[userInfo.gender!].name"
            />
            <image :class="$style.icon_right" src="../../../../../../static/icon/chevron-right.png" />
          </view>
        </view>
        <view :class="$style.item" class="nut-flex nut-row-between f_s-14 f_w-400" @tap="handleAddress">
          <text :class="$style.item_title">所在城市</text>
          <view :class="$style.item_content" class="nut-flex">
            <input
              :class="$style.input"
              class="nut-flex-1"
              :disabled="true"
              :placeholder-class="$style.holder"
              placeholder="请选择"
              :value="addressRegion"
            />
            <image :class="$style.icon_right" src="../../../../../../static/icon/chevron-right.png" />
          </view>
        </view>

        <view :class="$style.item" class="nut-flex nut-row-between f_s-14 f_w-400">
          <text :class="$style.item_title">地址</text>
          <view :class="$style.item_content" class="nut-flex">
            <input
              :class="[$style.input, $style['input-width']]"
              class="nut-flex-1 nut-line-1"
              :disabled="detailsData?.isSignUp"
              :placeholder-class="$style.holder"
              placeholder="请输入家庭住址"
              v-model="userInfo.address"
            />
          </view>
        </view>

        <nut-button
          :class="$style.btn"
          type="primary"
          :loading="loadingRegister"
          @tap="handleSubmit"
          v-if="!detailsData?.isSignUp"
          >提交</nut-button
        >
      </view>
    </view>
    <template #close-icon>
      <image src="../../../../../../static/icon/close.png" :class="$style.close"></image>
    </template>
  </CustomPopup>

  <nut-action-sheet
    v-model:visible="showGenderSheet"
    :menu-items="(genderData as any)"
    @choose="chooseGender"
    cancel-txt="取消"
  ></nut-action-sheet>

  <AddressPicker v-model:show="showAddress" v-model:info="addressInfo" />
</template>

<script setup lang="ts">
import { signUp } from '@/api/activity';
import AddressPicker from '@/components/AddressPicker/AddressPicker.vue';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { IAddressInfo } from '@/dto/address';
import { useUserStore } from '@/stores';
import { Toast } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import { getApp, pxTransform } from '@tarojs/taro';
import { cloneDeep, isEmpty } from 'lodash';
import Validator from 'miniprogram-validator';
import { computed, reactive, ref, watch, watchEffect } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const userStore = useUserStore();

const emits = defineEmits(['update:isShow', 'refresh']);
const props = defineProps(['isShow', 'detailsData']);
const loadingRegister = ref<boolean>(false);
const genderData = ref([
  { id: 0, name: '女' },
  { id: 1, name: '男' },
  { id: 2, name: '其他' },
]);
const showGenderSheet = ref<boolean>(false);

const isShow = computed({
  get() {
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});

let addressTexts = reactive({
  province: '',
  city: '',
  district: '',
});

const oriUserInfo = computed(() => userStore.getUserInfo!);
const userInfo = ref({
  gender: typeof oriUserInfo.value.gender === 'undefined' ? 0 : oriUserInfo.value.gender || 0,
  name: oriUserInfo.value.name || '',
  province: oriUserInfo.value.province || '',
  city: oriUserInfo.value.city || '',
  district: oriUserInfo.value.district || '',
  address: oriUserInfo.value.address || '',
});

const showAddress = ref<boolean>(false);
const addressInfo = ref<IAddressInfo>({
  codes: [],
  texts: [userInfo.value.province || '', userInfo.value.city || '', userInfo.value.district || ''],
});

watch(
  () => addressInfo.value,
  newVal => {
    addressInfo.value.texts = newVal.texts;

    const texts = newVal.texts;
    if (texts) {
      addressTexts.province = texts[0];
      addressTexts.city = texts[1];
      addressTexts.district = texts[2];
    }
  },
  { deep: true },
);

watchEffect(() => {
  initData();
});

const addressRegion = computed(() => {
  const t = addressInfo.value.texts || [];
  if (!t.length) return '';
  if (t[0] === t[1]) {
    return `${t[1]}${t[2]}`;
  }
  return t.join('');
});

const handleSubmit = async () => {
  if (loadingRegister.value) return;

  const info = cloneDeep(userInfo.value);
  const { province, city, district } = addressTexts;

  if (!district) {
    province ? (info.province = province) : '';
    city ? (info.city = province) : '';
    city ? (info.district = city) : '';
  } else {
    province ? (info.province = province) : '';
    city ? (info.city = city) : '';
    city ? (info.district = district) : '';
  }

  const validator = new Validator({
    name: [{ required: true }, { message: '姓名不能超过10个字', maxlength: 10 }],
    gender: [{ required: true }],
    province: [{ required: true }],
    city: [{ required: true }],
    address: [{ required: true }],
  });
  const error = validator.validate(info);
  console.debug('handleSubmit error', error);

  if (error) return Toast('请完善报名信息', 2000, 'none');
  loadingRegister.value = true;

  const params = {
    activityId: props.detailsData.detail.id,
    ...info,
  };

  // console.log('-------', params);
  // return;
  let result;
  try {
    result = await signUp(params);
  } catch (error) {
    console.error('signUp: error', error);
  } finally {
    loadingRegister.value = false;
  }

  if (!result) return;

  userStore.getUsersProfile();
  Toast('报名成功', 2000, 'none');

  emits('refresh');
  onClose();
  const { title: campaignName = '', id: campaignId = '' } = props.detailsData.detail;
  linkflow &&
    linkflow.track({
      event: ELinkflowEventsName.Campaign_Submit,
      props: {
        campaignName,
        campaignId,
        campaignStatus: '进行中',
        name: info.name,
        nickname: oriUserInfo.value.nickname || '',
        gender: genderData.value.find(i => i.id === info.gender)?.name,
        state: info.province,
        city: info.city,
        street: info.district,
        address: info.address,
        triggerPagePath,
      } as ILinkflowEventsProps,
    });
};

const chooseGender = (itemParams: any) => {
  userInfo.value.gender = itemParams.id;
};

function handleGenderSheet() {
  if (props.detailsData.isSignUp) return;
  showGenderSheet.value = true;
}

function handleAddress() {
  if (props.detailsData.isSignUp) return;
  showAddress.value = true;
}

const onClose = () => {
  emits('update:isShow', false);
};

function initData() {
  const userRecord = props.detailsData?.userRecord || {};
  if (isEmpty(userRecord)) return;

  const data = userInfo.value;

  for (const key in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(key) && userRecord.hasOwnProperty(key)) {
      data[key] = userRecord[key];
    }
  }

  addressInfo.value.texts = [data.province, data.city, data.district];
}
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
      height: 56px;
      border-bottom: 0.5px solid $Divide;
      color: $Primary;
      font-family: 'FZLanTingHeiS-R-GB';

      .item_title {
        width: 80px;
        line-height: 20px;
      }
      .item_content {
        width: 176px;
      }
      .input {
        height: 20px;
        line-height: 20px;
        box-sizing: border-box;
        &-width {
          max-width: 176px;
        }
      }

      .icon_right {
        width: 20px;
        height: 20px;
      }
      .holder {
        color: $Tertiary;
      }
    }
  }
  .btn {
    margin-top: 10px;
    min-width: 256px;
    height: 40px;
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
