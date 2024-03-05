<template>
  <view class="container">
    <CustomBar title="领取优惠券" />
    <view :class="$style['main']" v-if="isLoading && list.length > 0">
      <block v-for="(item, index) in list" :key="index">
        <CouponBox
          :itemData="item"
          :page="COMPONENTS_COUPON_TYPE.COUPON_SHARE"
          :index="index"
          @userStateChanged="userStateChanged"
        />
      </block>
    </view>
    <view v-if="isLoading && list.length <= 0" class="nut-flex nut-flex-1 nut-col-center nut-row-center">
      <DefaultPage
        imgWidth="48"
        imgHeight="48"
        imgMbottom="20"
        :icon="require('@/static/icon/no-coupon.png')"
        tip="暂无优惠券"
      />
    </view>

    <view v-if="!isLoading" :class="$style.load" class="nut-flex nut-row-center">
      <Loading1 />
    </view>
    <PopLogin v-model:isShow="showLoginPop" :target="loginTarget" />
  </view>
</template>

<script setup lang="ts">
import { getCouponQuery } from '@/api/coupons';
import CouponBox from '@/components/CouponBox/CouponBox.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import { COMPONENTS_COUPON_TYPE } from '@/constants';
import { ICouponsCenterList, ICouponsItem } from '@/dto/coupons';
import useLoginPop from '@/hook/useLoginPop';
import { Loading1 } from '@nutui/icons-vue-taro';
import { useDidShow, useRouter } from '@tarojs/taro';
import { onMounted, onUnmounted, ref } from 'vue';

const router = useRouter();

const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();
const list = ref<ICouponsItem[]>([]);
const isLoading = ref<boolean>(false);

const codes = ref<string>(router.params.code || '');

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
  if (!codes.value) return;
  let result: ICouponsCenterList = await getCouponQuery(codes.value);
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $white;
  z-index: 10;
}
</style>
