<template>
  <BackgroundImage>
    <CustomBar :title="title" />

    <view :class="$style.main" class="nut-flex nut-flex-col nut-flex-1" v-if="list && list.length > 0">
      <view
        :class="$style['main-item']"
        class="box rounded_corners-8 nut-flex nut-col-center nut-row-between"
        v-for="item in list"
        :key="item.id"
        @tap="handleToPage(item)"
      >
        <view
          :class="$style['item-left']"
          class="f_s-12 f_w-400 nut-flex nut-flex-col nut-flex-1 nut-row-left nut-col-top"
        >
          <view :class="$style['left-top']" class="f_w-400 nut-flex nut-col-center nut-row-left">
            <text :class="$style['left-top_name']" class="nut-line-1 f_s-16">{{ item.name }}</text>
            <text :class="$style['left-top_phone']" class="f_s-14">{{ item.phone }}</text>
            <view :class="$style.tag" v-if="item.default" class="f_s-12">默认</view>
          </view>
          <view :class="$style['left-bottom']" class="nut-line-1">{{ item.region }}{{ item.address }}</view>
        </view>
        <image
          :class="$style['item-right']"
          src="../../../../static/icon/icon_edit.png"
          mode="scaleToFill"
          @tap.stop="gotoAddAddressPage(item)"
        />
      </view>
    </view>
    <view v-else :class="$style.main" class="nut-flex nut-flex-1 nut-col-center nut-row-center">
      <view :class="$style.empty_box">
        <DefaultPage
          imgWidth="48"
          imgHeight="48"
          imgMbottom="16"
          :icon="cdnurl('static/no-location.png')"
          tip="暂无收货地址"
        />
      </view>
    </view>
    <view :class="$style.navigation" class="nut-flex-col nut-col-center nut-row-center">
      <view :class="$style.btn" hover-class="btn-hover" @tap="gotoAddAddressPage">添加地址</view>
      <view :class="$style.safe" class="iphone-end"></view>
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { TARGET_LOCATION_CHANGE, TARGET_LOCATION_CHANGE_POINT } from '@/constants';
import { useAddressStore } from '@/stores';
import { IAddressesInfo } from '@/dto/address';
import { isEmpty } from 'lodash';
import { cdnurl } from '@/utils';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
const userAddress = useAddressStore();

const router = useRouter();
const target: string = router.params.target || '';
const addressId: string = router.params.aid || '';
const title: string = router.params.title || '收货地址';
const chooseItem = ref<IAddressesInfo | null>(null);
const list = computed(() => {
  return userAddress.addressList;
});

useDidShow(async () => {
  if (list.value && list.value.length > 0) {
    initData();
    return;
  }
  await userAddress.getUerAddresses();
  await initData();
});

const targetType = computed(() => {
  return target === TARGET_LOCATION_CHANGE || target === TARGET_LOCATION_CHANGE_POINT;
});

onMounted(() => {
  //预加载地址数据
  useAddressStore().preload();
});

onUnmounted(() => {
  // console.warn('onUnmounted', chooseItem.value);
  if (targetType.value) {
    Taro.eventCenter.trigger(target, chooseItem.value);
  }
});

const initData = () => {
  if (!isEmpty(addressId) && !isEmpty(list.value)) {
    chooseItem.value = list.value?.filter(item => item.id === Number(addressId))[0] || null;
  }
};

const handleToPage = (item: IAddressesInfo | null = null) => {
  if (targetType.value && item && item.id) {
    chooseItem.value = item;
    Taro.eventCenter.trigger(target, item);
    Taro.navigateBack();
    return;
  }
  gotoAddAddressPage(item);
};

const gotoAddAddressPage = (item: IAddressesInfo | null = null) => {
  let url = '/packageA/pages/address/addressAppend/addressAppend';
  if (item && item.id) {
    url = `/packageA/pages/address/addressAppend/addressAppend?id=${item.id}`;
  }
  Taro.navigateTo({
    url,
  });
};
</script>

<style lang="scss" module>
@import './addressList.scss';
</style>
