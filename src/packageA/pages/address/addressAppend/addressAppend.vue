<template>
  <BackgroundImage :class="$style['address-layout']" class="address-layout">
    <CustomBar :title="title" />
    <view :class="$style.main">
      <view :class="$style.main_from">
        <nut-form>
          <nut-form-item label="收货人" label-width="80" class="mg-bottom-10">
            <view :class="$style.from_input">
              <input
                v-model="formData.name"
                class="input_color"
                placeholder="请填写收货人姓名"
                placeholderClass="input_pla"
                type="text"
              />
            </view>
          </nut-form-item>

          <nut-form-item label="手机号码" label-width="80">
            <view :class="$style.from_input">
              <input
                v-model="formData.phone"
                type="number"
                class="input_color"
                placeholder="请填写收货人手机号码"
                placeholderClass="input_pla"
                @Input="handlePhone"
              />
            </view>
          </nut-form-item>

          <nut-form-item label="所在地区" label-width="80">
            <view :class="$style.from_input">
              <input
                :value="addressRegion"
                class="input_color"
                placeholder="省市区、乡镇等"
                placeholderClass="input_pla"
                type="text"
                :disabled="true"
                @click="showAddressPick"
              />
            </view>
            <image class="icon_right" src="../../../../static/icon/chevron-right.png"></image>
          </nut-form-item>

          <nut-form-item label="详细地址" label-width="80" class="from_textarea">
            <view :class="[$style.from_input, $style.from_input_height]">
              <textarea
                :value="formData.address"
                :maxlength="100"
                :disableDefaultPadding="true"
                class="input_color"
                placeholder="街道、楼牌号等"
                placeholderClass="input_pla input_pla_top"
                style="width: 100%; height: 46px"
                @input="changeAddress"
              />
            </view>
          </nut-form-item>
        </nut-form>
        <view :class="$style.wx_addr" class="nut-flex nut-row-between f_s-14 f_w-400" @tap="pickWxAddr">
          <image :class="$style.wx_addr_icon" :src="cdnurl('static/icon_wx.png')"></image>
          <text :class="$style.wx_addr_text">一键获取微信地址</text>
          <image :class="$style.wx_addr_icon_right" src="../../../../static/icon/chevron-right.png"></image>
        </view>
      </view>
      <view
        :class="$style['acq-box']"
        class="f_s-14 f_w-400 nut-flex nut-col-center"
        @tap="formData.default = !formData.default"
      >
        <CustomCheckBox :check="Boolean(formData.default)" :class="$style['acq-box_check']" />
        <text>默认地址</text>
      </view>
    </view>
    <view :class="$style.btn_box">
      <nut-button
        shape="square"
        type="primary"
        :class="[$style.btn, $style['btn_save']]"
        :loading="loadingSave"
        @click="handleRegister"
        >保存</nut-button
      >

      <view :class="$style['btn_del-box']" class="nut-flex-col nut-col-center nut-row-center" v-if="addressId">
        <nut-button
          shape="square"
          type="primary"
          plain
          :class="[$style.btn, $style.btn_del]"
          :loading="loadingDel"
          @click="showDelPop = true"
          >删除地址</nut-button
        >
      </view>
      <view :class="$style.safe" class="iphone-end"></view>
    </view>

    <Notice v-model:show="showDelPop" @close="showDelPop = false" submitText="删除" title="" @submit="handleDelComfirm">
      <view class="f_s-16 f_w-400 nut-flex nut-col-center nut-row-center">
        <view :class="$style.notice_title">确定要删除该地址吗？</view>
      </view>
    </Notice>

    <AddressPicker v-model:show="showAddress" v-model:info="addressInfo" @ready="onAreaReady" pre="1111" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { computed, reactive, ref } from 'vue';
import { userAddressesInfoApi, updateUserAddressesApi, deleteUserAddressesApi } from '@/api/address';
import { IAddressInfo, IAddressesInfo, IAddressesParams } from '@/dto/address';
import Validator from 'miniprogram-validator';
import { cdnurl, phoneVerify, Toast } from '@/utils/index';
import { useAddressStore } from '@/stores';

import CustomBar from '@/components/CustomBar/CustomBar.vue';
import CustomCheckBox from '@/components/CustomCheckBox/CustomCheckBox.vue';
import AddressPicker from '@/components/AddressPicker/AddressPicker.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import Notice from '@/components/Notice/Notice.vue';
import { TARGET_LOCATION_CHANGE } from '@/constants';

const loadingSave = ref(false);
const loadingDel = ref(false);
const userAddress = useAddressStore();
const router = useRouter();
let addressId: number = Number(router.params.id || '');

const formData = reactive<IAddressesParams>({
  name: '',
  phone: '',
  address: '',
  code: '',
  zipcode: '000000',
  default: false,
});

const target: string = router.params.target || '';
const addressInfo = ref<IAddressInfo>({ codes: [], texts: [] });
const showAddress = ref<boolean>(false);
const title = computed((): string => {
  return '填写地址';
});
const showDelPop = ref<boolean>(false);
const isAreaReady = ref(false);
let isRequest = true;
const addressRegion = computed(() => {
  const t = addressInfo.value.texts || [];
  if (!t.length) return '';
  if (t[0] === t[1]) {
    return `${t[1]}${t[2]}`;
  }
  return t.join('');
});

useDidShow(() => {
  if (addressId && isRequest) {
    getUserAddressesInfo();
  } else {
    const preload = Taro.getCurrentInstance().preloadData;
    if (preload && preload.wxAddr) {
      Taro.preload({ wxAddr: '' });
      handleWxAddr(preload.wxAddr, true);
    }
  }
});

const showAddressPick = () => {
  showAddress.value = true;
};

const handleDelComfirm = async () => {
  loadingDel.value = true;
  showDelPop.value = false;

  Taro.nextTick(async () => {
    try {
      await deleteUserAddressesApi(addressId);
    } catch (error) {
      return Toast(error.message, 2000, 'none');
    } finally {
      loadingDel.value = false;
    }
    await userAddress.getUerAddresses();
    Taro.navigateBack();
  });
};

const changeAddress = e => {
  formData.address = e.detail.value || '';
};

const handlePhone = e => {
  let value = trimNum('+86', String(e.detail.value)).replace(/ /g, '');
  Taro.nextTick(() => {
    formData.phone = value.slice(0, 11);
  });
};

const trimNum = (prefix: string, number: string) => {
  let s: string = number;
  if (prefix.length > 0 && number.startsWith(prefix)) {
    s = number.substring(prefix.length);
  }
  return s;
};

const getUserAddressesInfo = async () => {
  try {
    const result: IAddressesInfo = await userAddressesInfoApi(addressId);
    if (!result) return;

    Object.assign(formData, result);
    addressInfo.value.texts = [result.province, result.city, result.district];
  } catch (error) {
    console.error('getUserAddressesInfo error=', error);
  }
};
const handleRegister = () => {
  const params: IAddressesParams = { ...formData };
  params.phone = String(params.phone);
  params.code = addressInfo.value.codes[addressInfo.value.codes.length - 1];

  const validator = handleValidator();
  const error = validator.validate(params);
  if (error) {
    return Toast(error.msg, 2000, 'none');
  }

  if (!phoneVerify(params.phone)) return Toast('请输入正确手机号', 2000, 'none');
  console.debug('handleRegister error', error);

  loadingSave.value = true;
  if (addressId) {
    return updateUserAddresses(params);
  }
  addUserAddresses(params);
};

let areaReadyCb: () => void = () => {};
const onAreaReady = () => {
  isAreaReady.value = true;
  areaReadyCb && areaReadyCb();
};

const pickWxAddr = () => {
  isRequest = false;
  Taro.chooseAddress({
    success: res => {
      console.debug('pickWxAddr', res);
      if (res.errMsg === 'chooseAddress:ok') {
        handleWxAddr(res);
      }
    },
  });
};

const handleWxAddr = (res: any, isPreload: boolean = false) => {
  formData.name = res.userName;
  formData.phone = res.telNumber;
  formData.address = res.detailInfo;

  const texts: string[] = [];
  if (res.provinceName) {
    texts.push(res.provinceName);
  }
  if (res.cityName) {
    texts.push(res.cityName);
  }
  if (res.countyName) {
    texts.push(res.countyName);
  }

  if (isPreload) {
    if (isAreaReady.value) {
      addressInfo.value = {
        texts,
        codes: [],
      };
    } else {
      areaReadyCb = () => {
        addressInfo.value = {
          texts,
          codes: [],
        };
      };
    }
  } else {
    addressInfo.value = {
      texts,
      codes: [],
    };
  }
};

const updateUserAddresses = async (params: IAddressesParams) => {
  try {
    await updateUserAddressesApi(addressId, params);
    await userAddress.getUerAddresses();
    Taro.navigateBack();
  } catch (error) {
    return Toast(error.message, 2000, 'none');
  } finally {
    loadingSave.value = false;
  }
};

const addUserAddresses = async (params: IAddressesParams) => {
  try {
    const addr = await userAddress.addUserAddresses(params);
    await userAddress.getUerAddresses();
    if (target === TARGET_LOCATION_CHANGE) {
      Taro.eventCenter.trigger(TARGET_LOCATION_CHANGE, addr);
    }
    Taro.navigateBack();
  } catch (error) {
    return Toast(error.message, 2000, 'none');
  } finally {
    loadingSave.value = false;
  }
};

const handleValidator = () => {
  return new Validator({
    name: [
      { message: '请输入收货人姓名', required: true },
      { message: '姓名不能超过50个字', maxlength: 50 },
    ],
    phone: [
      { message: '请输入手机号码', required: true },
      { message: '请输入正确的手机号', minlength: 11 },
    ],
    code: [{ message: '请选择所在地区', required: true }],
    address: [
      { message: '请输入详细地址', required: true },
      { message: '地址不能超过100个字', maxlength: 100 },
    ],
  });
};
</script>

<style lang="scss" module>
@import './addressAppend.scss';
</style>
<style lang="scss">
.address-layout {
  overflow: hidden;

  .nut-cell-group__wrap {
    margin: 0;
    background-color: transparent;
    box-shadow: none;
  }

  .nut-cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
    height: 56px;
    border-bottom: 0.5px solid #d9d9d9;
    color: $Primary;
    background: transparent;
    .nut-form-item__label {
      margin-right: 0;
    }
    .nut-form-item__body__slots {
      justify-content: flex-start;
    }
  }
  .from_textarea {
    align-items: flex-start;
    padding: 18px 0;
    height: 76px;
  }
  .nut-cell::after {
    border: none;
  }
  .nut-form-item__body__slots {
    display: flex;
    justify-content: flex-end;
  }
  .icon_right {
    position: absolute;
    top: 23px;
    right: 18px;
    width: 20px;
    height: 20px;
    // transform: rotate(-90deg);
    margin-top: -5px;
  }
  .input_color {
    font-size: 14px;
    color: $font-color;
  }
  .input_pla {
    font-size: 14px;
    font-weight: 400;
    color: $Tertiary;
    &_top {
      margin-top: 2px;
    }
  }
}
</style>
