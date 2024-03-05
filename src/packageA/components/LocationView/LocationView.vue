<template>
  <view v-if="addressData" :class="$style.location" class="box f_w-400 nut-flex-col rounded_corners-8">
    <view class="nut-flex" @tap="gotoAddressListPage">
      <image :class="$style.location_img" src="@/static/icon/location.png"></image>
      <view :class="$style.location_info" class="nut-flex-1">
        <view :class="$style.info_tittle" class="f_s-14 f_w-400 nut-flex nut-row-left">
          <text :class="$style.info_name" class="nut-line-1">{{ addressData.name }}</text>
          <text :class="$style.info_phone">{{ addressData.phone }}</text>
          <text :class="$style.info_default" class="nut-flex f_s-12 f_w-400 nut-row-center" v-if="addressData.default"
            >默认</text
          >
        </view>
        <view :class="$style.info_address" class="f_s-12 nut-line-1">
          {{ addressData.provinceName }}{{ addressData.cityName }}{{ addressData.districtName
          }}{{ addressData.address }}
        </view>
      </view>
      <image v-if="showRight" :class="$style.right_img" src="../../../static/icon/arrowLeft.png"></image>
    </view>
    <view v-if="showRight" :class="$style.wx_addr" class="nut-flex f_s-14" @tap="getWxAddr">
      <image :class="$style.wx_addr_icon" :src="cdnurl('static/icon_wx.png')"></image>
      <text>一键获取微信地址</text>
    </view>
  </view>
  <view v-else :class="$style.location_none" class="box f_s-14">
    <view class="nut-flex nut-row-between nut-col-center" @tap="gotoAddressListPage">
      <view class="nut-flex">
        <image :class="$style.location_img" src="@/static/icon/location.png"></image>
        <view :class="$style.location_none_left">暂无地址，点击添加</view>
      </view>

      <!-- <view :class="$style.location_none_right" class="nut-flex nut-row-left nut-col-center">
      </view> -->
      <image :class="$style.icon_right" src="../../../static/icon/arrowLeft.png"></image>
    </view>
    <view v-if="showRight" :class="$style.wx_addr" class="nut-flex f_s-14" @tap="getWxAddr">
      <image :class="$style.wx_addr_icon" :src="cdnurl('static/icon_wx.png')"></image>
      <text>一键获取微信地址</text>
    </view>
  </view>

  <AddressPicker v-model:info="addressInfo" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Toast, cdnurl } from '@/utils/index';
import { dProps } from './props';
import Taro from '@tarojs/taro';
import { TARGET_LOCATION_CHANGE } from '@/constants';
import { useAddressStore } from '@/stores';
import AddressPicker from '@/components/AddressPicker/AddressPicker.vue';
import { IAddressInfo, IAddressesParams } from '@/dto/address';

const userAddress = useAddressStore();

const emits = defineEmits(['setAddr']);
const props = defineProps(dProps);
const addressInfo = ref<IAddressInfo>({ codes: [], texts: [] });

const addressData = computed(() => {
  return props.data || null;
});

const gotoAddressListPage = () => {
  if (!props.showRight) return;
  Taro.navigateTo({
    url: `/packageA/pages/address/addressList/addressList?target=${TARGET_LOCATION_CHANGE}&aid=${
      props.aId || ''
    }&title=选择地址`,
  });
};

const getWxAddr = () => {
  useAddressStore().addAddressByWx(res => {
    if (res.errMsg === 'chooseAddress:ok') {
      const formData = {
        name: '',
        phone: '',
        address: '',
        code: '',
        zipcode: '000000',
        default: false,
      };

      formData.name = res.userName;
      formData.phone = String(res.telNumber);
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

      addressInfo.value = {
        texts,
        codes: [],
      };

      setTimeout(() => {
        addAddresses(formData);
      }, 100);
    }
    // Taro.navigateTo({
    //   url: `/packageA/pages/address/address?target=${TARGET_LOCATION_CHANGE}`,
    // });
  });
};

const addAddresses = async formData => {
  const params: IAddressesParams = { ...formData };
  params.code = addressInfo.value.codes[addressInfo.value.codes.length - 1];

  try {
    const addr = await userAddress.addUserAddresses(params);
    await userAddress.getUerAddresses();
    emits('setAddr', addr);
  } catch (error) {
    return Toast(error.message, 2000, 'none');
  }
};
</script>

<style lang="scss" module>
.location {
  color: $font-color;
  &_img {
    margin-right: 16px;
    width: 24px;
    height: 24px;
  }
  .location_info {
    margin-right: 16px;
    width: 239px;
    .info_tittle {
      margin-bottom: 4px;
      color: $Primary;
      font-family: 'FZLanTingHei-R-GBK';
      align-items: baseline;
      .info_name {
        max-width: 150px;
        margin-right: 8px;
      }
      .info_phone {
        font-family: 'CentraleSans';
      }
      .info_default {
        margin-left: 15px;
        width: 29px;
        height: 15px;
        background: $Primary;
        border-radius: 2px 2px 2px 2px;
        color: $white;
      }
    }
    .info_address {
      color: $Tertiary;
      font-family: 'FZLanTingHei-R-GBK';
    }
  }
  .right_img {
    width: 16px;
    height: 16px;
  }
}
.location_none {
  color: $font-color;
  padding: 16px;
  // .location_none_right {
  // }
  .icon_right {
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
}
.wx_addr {
  padding-top: 12px;
  margin-top: 18px;
  border-top: 0.5px solid #d9d9d9;
  &_icon {
    width: 24px;
    height: 23px;
    margin-right: 16px;
  }
}
</style>
