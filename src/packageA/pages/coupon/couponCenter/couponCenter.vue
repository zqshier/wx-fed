<template>
  <BackgroundImage>
    <CustomBar title="领券中心" />
    <view :class="$style['main']" v-if="isLoading">
      <block v-for="(item, index) in list" :key="index">
        <!-- <view class="nut-flex-col nut-col-center" :class="$style['main-item']"> -->
        <CouponBox
          :itemData="item"
          :page="COMPONENTS_COUPON_TYPE.COUPON_CENTER"
          :index="index"
          @userStateChanged="userStateChanged"
        />
        <!-- </view> -->
      </block>
    </view>

    <view v-if="!isLoading" :class="$style.load" class="nut-flex nut-row-center">
      <Loading1 />
    </view>
    <PopLogin v-model:isShow="showLoginPop" :target="loginTarget" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getCouponsCenter } from '@/api/coupons';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CouponBox from '@/components/CouponBox/CouponBox.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import { COMPONENTS_COUPON_TYPE } from '@/constants';
import { ICouponsCenterList, ICouponsItem } from '@/dto/coupons';
import useLoginPop from '@/hook/useLoginPop';
import { Loading1 } from '@nutui/icons-vue-taro';
import { useDidShow } from '@tarojs/taro';
import { onMounted, onUnmounted, ref } from 'vue';

const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();

const list = ref<ICouponsItem[]>([]);
const isLoading = ref<boolean>(false);

onMounted(() => {
  onRegisterEvent();
});

onUnmounted(() => {
  offRegisterEvent();
});

useDidShow(() => {
  getCouponList();
});

async function getCouponList() {
  let result: ICouponsCenterList = await getCouponsCenter();
  if (!result) return;
  list.value = result.list;

  isLoading.value = true;
}

function userStateChanged(val: number, index: number) {
  list.value[index].userState = val;
}
</script>

<style lang="scss" module>
.main {
  width: 100%;
  padding: 16px;
  .main-item {
    margin-bottom: 12px;
  }
}
.load {
  margin-top: 260px;
}
</style>
