<template>
  <BackgroundImage :class="$style.layout">
    <CustomBar title="个人信息" />

    <view :class="$style.main" class="nut-flex nut-flex-col nut-row-left nut-col-top">
      <view :class="$style.avatar_box" class="nut-flex nut-row-center">
        <button :class="$style.avatar" open-type="chooseAvatar" @chooseavatar="handlechooseavatar">
          <image
            :class="$style.avatar_img"
            :src="userInfo.avatar || './../../../static/icon/logo_circle.png'"
            mode="aspectFill"
          />
        </button>
      </view>

      <view :class="$style.main_item" class="nut-flex nut-col-center nut-row-center f_s-14">
        <view :class="$style.info_label">昵称</view>
        <view class="nut-flex-1">
          <input
            v-model="userInfo.nickname"
            type="nickname"
            :class="$style.info_input"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请输入昵称"
          />
        </view>
      </view>

      <view :class="$style.main_item" class="nut-flex nut-col-center nut-row-center f_s-14">
        <view :class="$style.info_label">姓名</view>
        <view class="nut-flex-1">
          <input
            :class="$style.info_input"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请填写姓名"
            v-model="userInfo.name"
          />
        </view>
      </view>

      <view :class="$style.main_item" class="nut-flex nut-col-center nut-row-center f_s-14" @tap="clickDatepicker">
        <view :class="$style.info_label">生日</view>
        <view class="nut-flex-1 nut-flex nut-col-center but-row-between">
          <input
            :class="$style.info_input"
            class="nut-flex-1"
            :disabled="true"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请选择生日日期"
            :value="birthdayTime"
          />
          <image :class="$style.icon_right" src="../../../static/icon/chevron-right.png" v-if="!oriUserInfo.birthday" />
        </view>
      </view>

      <view :class="$style.main_item" class="nut-flex nut-col-center nut-row-between f_s-14">
        <view :class="$style.info_label">手机号</view>
        <view class="nut-flex-1 nut-flex nut-col-center nut-row-between">
          <input
            :class="$style.info_input"
            type="number"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请输入手机号码"
            :value="oriUserInfo.phone"
            :disabled="true"
          />

          <nut-button
            :class="$style.btn_phone"
            type="primary"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
            :loading="loadingRegister"
          >
            更换手机号
          </nut-button>
        </view>
      </view>

      <view
        :class="$style.main_item"
        class="nut-flex nut-col-center nut-row-center f_s-14"
        @tap="showGenderSheet = true"
      >
        <view :class="$style.info_label">性别</view>
        <view class="nut-flex-1 nut-flex nut-col-center but-row-between">
          <input
            :class="$style.info_input"
            class="nut-flex-1"
            :disabled="true"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请选择性别"
            :value="genderData[userInfo.gender!].name"
          />
          <image :class="$style.icon_right" src="../../../static/icon/chevron-right.png" />
        </view>
      </view>

      <view :class="$style.main_item" class="nut-flex nut-col-center nut-row-center f_s-14" @tap="showAddress = true">
        <view :class="$style.info_label">所在城市</view>
        <view class="nut-flex-1 nut-flex nut-col-center but-row-between">
          <input
            :class="$style.info_input"
            class="nut-flex-1 nut-line-1"
            :disabled="true"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请选择所在城市"
            :value="addressRegion"
          />
          <image :class="$style.icon_right" src="../../../static/icon/chevron-right.png" />
        </view>
      </view>

      <view :class="[$style.main_item, $style.main_item_max]" class="nut-flex nut-col-top nut-row-center f_s-14">
        <view :class="$style.info_label">地址</view>
        <view class="nut-flex-1">
          <textarea
            :class="$style.info_textarea"
            :disable-default-padding="true"
            :placeholder-style="inputPlaceholderStyle"
            placeholder="请输入家庭住址"
            v-model="userInfo.address"
          />
        </view>
      </view>
    </view>
    <view :class="$style.btn">
      <nut-button
        shape="round"
        size="large"
        type="primary"
        :class="$style.submit"
        :loading="loadingSave"
        @click="handleSave"
        >保存</nut-button
      >
    </view>

    <nut-action-sheet
      v-model:visible="showGenderSheet"
      :menu-items="genderData"
      @choose="chooseGender"
      cancel-txt="取消"
    ></nut-action-sheet>

    <AddressPicker v-model:show="showAddress" v-model:info="addressInfo" />

    <view :catch-move="true">
      <nut-popup position="bottom" v-model:visible="showDatepicker">
        <nut-date-picker
          v-model="currentDate"
          :min-date="minDate"
          @confirm="handleConfirm"
          @cancel="showDatepicker = false"
        ></nut-date-picker>
      </nut-popup>
    </view>

    <!-- 生日信息提示 -->
    <Notice
      v-model:show="showVerifyPop"
      @close="closeVerifyPop"
      :confirmBtnStyle="confirmBtnStyle"
      :isComfirmBtnplain="false"
      :submitLoading="loadingSave"
      submitText="确认"
      title="提示"
      @submit="handleSubmit"
    >
      <view :class="$style.notice_title" class="f_s-14 nut-flex nut-col-center nut-row-center">
        生日信息只能保存一次，保存后不能修改
      </view>
    </Notice>

    <!-- 离开页面提示 -->
    <Notice
      v-model:show="showBackPop"
      @otherClose="goBack"
      :confirmBtnStyle="confirmBtnStyle"
      :isComfirmBtnplain="false"
      :cancelFunKey="true"
      submitText="返回保存"
      cancelText="离开"
      title="提示"
      @submit="closeBackPop"
    >
      <view :class="$style.notice_title" class="f_s-14 nut-flex nut-col-center nut-row-center">
        您尚未保存本次信息，是否离开并放弃更改？
      </view>
    </Notice>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { uploadFile } from '@/api/upload';
import AddressPicker from '@/components/AddressPicker/AddressPicker.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import Notice from '@/components/Notice/Notice.vue';

import { IAddressInfo } from '@/dto/address';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import { PhoneRes, UpdateUserParams as UserInfo, wxPhoneRes } from '@/dto/user';
import variables from '@/scss/variables';
import { useUserStore } from '@/stores';
import { Toast } from '@/utils';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp } from '@tarojs/taro';
import { format } from 'date-fns';
import { pick } from 'lodash';
import Validator from 'miniprogram-validator';
import { computed, provide, reactive, ref, watch } from 'vue';

const confirmBtnStyle = {
  color: '#FFF',
  background: `#333`,
  border: 'none',
};

const userStore = useUserStore();
const oriUserInfo = computed(() => userStore.getUserInfo!);
const userInfo = ref<UserInfo>({
  gender: typeof oriUserInfo.value.gender === 'undefined' ? 0 : oriUserInfo.value.gender || 0,
  nickname: oriUserInfo.value.nickname || '',
  name: oriUserInfo.value.name || '',
  avatar: oriUserInfo.value.avatar || '',
  birthday: oriUserInfo.value.birthday,
  province: oriUserInfo.value.province || '',
  city: oriUserInfo.value.city || '',
  district: oriUserInfo.value.district || '',
  address: oriUserInfo.value.address || '',
});

const inputPlaceholderStyle = ref(`color: ${variables.tertiary}`);
const genderData = ref([
  { id: 0, name: '女' },
  { id: 1, name: '男' },
  { id: 2, name: '其他' },
]);
const showGenderSheet = ref<boolean>(false);
const loadingSave = ref<boolean>(false);
const showAddress = ref<boolean>(false);
const addressInfo = ref<IAddressInfo>({
  codes: [],
  texts: [userInfo.value.province || '', userInfo.value.city || '', userInfo.value.district || ''],
});

let addressTexts = reactive({
  province: '',
  city: '',
  district: '',
});

const loadingRegister = ref<boolean>(false);

const showDatepicker = ref<boolean>(false);
const showVerifyPop = ref(false);
const showBackPop = ref(false); // 未保存退出页面提示
const isModified = ref(true); // 是否修改
const isSetAddress = ref(false); // 是否赋值过地址

const currentDate = ref(new Date(1990, 0, 1, 0, 0, 0));
const minDate = new Date(1920, 0, 1, 0, 0, 0);

const birthdayTime = computed((): string => {
  if (!userInfo.value.birthday) return '';
  initCurrentDate();
  return format(new Date(userInfo.value.birthday!), 'yyyy-MM-dd');
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

const addressRegion = computed(() => {
  const t = addressInfo.value.texts || [];
  if (!t.length) return '';
  if (t[0] === t[1]) {
    return `${t[1]}${t[2]}`;
  }
  return t.join('');
});

const chooseGender = (itemParams: any) => {
  userInfo.value.gender = itemParams.id;
};

const handlechooseavatar = e => {
  console.debug('handlechooseavatar', e);
  const avatar = e?.detail.avatarUrl || '';
  userInfo.value.avatar = avatar;
};

const handleConfirm = ({ selectedValue }) => {
  userInfo.value.birthday = selectedValue.join('-');
  showDatepicker.value = false;
};

const initCurrentDate = () => {
  currentDate.value = new Date(userInfo.value.birthday!);
};

const uploadAvatar = async (avatar: string) => {
  let flag = true;
  if (avatar.includes('https://')) flag = false;
  if (!flag) return avatar;
  try {
    const avatarUrl = await uploadFile(avatar);
    return avatarUrl;
  } catch (error) {
    console.error('uploadAvatar error=', error);
    Toast(error.message);
  }
  return avatar;
};

// 未保存退出页面
const pageBack = async () => {
  await compareObjects(userInfo.value, oriUserInfo.value);

  isModified.value ? Taro.navigateBack() : (showBackPop.value = true);
};
provide('back', pageBack);

// 获取手机号
const getPhoneNumber = async ({ detail }: { detail: wxPhoneRes }) => {
  if (!detail.code) return Toast('获取手机号失败');

  // const params: MemberParams = {
  //   phone: {
  //     code: '',
  //     phone: '',
  //   },
  //   rid: '',
  // };

  if (loadingRegister.value) return;
  loadingRegister.value = true;

  try {
    const result: PhoneRes = await userStore.updatePhonenumber(detail);
    if (!result) return;
    const data = pick(result, 'code', 'phone');

    // params.phone = data;
    // params.rid = result.rid;

    oriUserInfo.value.phone = data.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    userInfo.value.phone = data;
    userInfo.value.rid = result.rid;
  } catch (error) {
    // loadingRegister.value = false;
    return Toast(error.message, 2000, 'none');
  } finally {
    loadingRegister.value = false;
  }
};

const handleSave = () => {
  isModified.value = true;

  if (!isSetAddress.value) {
    setAddress();
  }

  const validator = new Validator({
    nickname: [
      { message: '昵称不能为空', required: true },
      { message: '姓名不能超过30个字', maxlength: 30 },
    ],
    name: [{ message: '姓名不能超过10个字', maxlength: 10 }],
    birthday: [{ message: '生日不能为空', required: true }],
    province: [{ message: '所在城市不能为空', required: true }],
    city: [{ message: '所在城市不能为空', required: true }],
    address: [{ message: '地址不能为空', required: true }],
  });
  const error = validator.validate(userInfo.value);
  console.debug('handleSubmit error', error);
  if (error) {
    return Toast(error.msg, 2000, 'none');
  }

  if (!oriUserInfo.value.birthday) {
    return (showVerifyPop.value = true);
  }

  handleSubmit();
};

const handleSubmit = async () => {
  const info = userInfo.value;
  loadingSave.value = true;

  // console.log('info', info);
  // return;
  try {
    // 上传图片
    if (info.avatar) {
      info.avatar = await uploadAvatar(info.avatar!);
    } else {
      delete info.avatar;
    }

    await userStore.updateUsersProfile(info);
    Toast('保存成功', 2000, 'none', true, () => {
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    });
    onTrack();
  } catch (error) {
    return Toast(error.message);
  } finally {
    loadingSave.value = false;
  }
};

const closeVerifyPop = () => {
  console.log(123);
  showVerifyPop.value = false;
  loadingSave.value = false;
};

const closeBackPop = () => {
  showBackPop.value = false;
};

const goBack = async () => {
  closeBackPop();
  Taro.navigateBack();
};

// 校验是否修改
const compareObjects = async (obj1, obj2) => {
  if (!isSetAddress.value) {
    setAddress();
  }
  const keys1 = Object.keys(obj1);
  // const keys2 = Object.keys(obj2);

  // 遍历属性数组，逐个比较属性值
  for (let key of keys1) {
    // 检查属性值是否相同
    if (Object.prototype.hasOwnProperty.call(obj2, key) && obj1[key] !== obj2[key]) {
      return (isModified.value = false);
    }
  }

  // 所有属性值都相同
  return (isModified.value = true);
};

const setAddress = () => {
  const info = userInfo.value;
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

  isSetAddress.value = true;
};

const onTrack = () => {
  const linkflow = getApp()[`${process.env.APP_ID}`];
  if (!linkflow) return;
  const triggerPagePath = getRefererPath();
  // 埋点 完善/修改个人信息
  linkflow.track({
    event: ELinkflowEventsName.SettingInfo_Submit,
    props: {
      name: oriUserInfo.value.name,
      nickname: oriUserInfo.value.nickname,
      gender: genderData.value.find(o => o.id === oriUserInfo.value.gender)?.name,
      state: oriUserInfo.value.province,
      city: oriUserInfo.value.city,
      street: oriUserInfo.value.district,
      address: oriUserInfo.value.address,
      userAction: '完善/修改',
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};

const clickDatepicker = () => {
  if (oriUserInfo.value.birthday) return;
  showDatepicker.value = true;
};
</script>

<style lang="scss" module>
@import './userInfo.scss';
</style>
