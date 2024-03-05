<template>
  <view :class="$style.footer">
    <view :class="$style['footer-fixed']" class="nut-flex nut-col-top nut-row-between">
      <view :class="$style['footer-left']" class="nut-flex f_w-400">
        <view
          :class="[$style['left-item'], $style['left-item_mgR']]"
          class="nut-flex nut-flex-col nut-col-center nut-row-between"
          @click="gotoPage('home')"
        >
          <image :class="$style.icon_cart" src="../../../../../static/icon/home.png" />
          <text :class="$style['left-item_text']" class="f_s-10">首页</text>
        </view>
      </view>

      <!-- 预售且有预约活动 -->
      <view :class="$style['footer-btn-none']" v-if="hasBooking">
        <nut-button
          :class="[$style['navigation-none'], { [$style['navigation-none_bg']]: !canBook }]"
          v-if="!isBooked"
          :loading="submitLoading"
          :disabled="!canBook"
          size="large"
          @click="handleBook"
          >开售预约</nut-button
        >
        <nut-button :class="[$style['navigation-none'], $style['navigation-none_has']]" v-else size="large"
          >已预约</nut-button
        >
      </view>

      <!-- 预售 -->
      <view :class="$style['footer-btn-none']" v-else-if="isPreSale">
        <nut-button disabled :class="[$style['navigation-none'], $style['navigation-none_bg']]" size="large"
          >即将上新</nut-button
        >
      </view>

      <view :class="$style['footer-btn-none']" class="f_w-400 f_s-14 nut-flex nut-col-top nut-row-center" v-else>
        <nut-button
          v-if="goodsInfo?.jumpToDetail"
          shape="square"
          size="large"
          :class="[$style['navigation-none'], $style['btn-mag'], $style['navigation-none_width']]"
          @click="goShop"
        >
          选购同款
        </nut-button>

        <nut-button
          v-if="skuSoldOut"
          shape="round"
          type="primary"
          :disabled="true"
          :class="[$style['navigation-none'], { [$style['navigation-none_width']]: goodsInfo?.jumpToDetail }]"
        >
          已售罄
        </nut-button>

        <nut-button
          v-else
          shape="round"
          type="primary"
          :class="[$style['navigation-none'], { [$style['navigation-none_width']]: goodsInfo?.jumpToDetail }]"
          :loading="buyLoadingConfirm"
          @click="handleVerifyComfirm"
          >我要兑换</nut-button
        >
      </view>
    </view>
    <!-- 占位 -->
    <view :class="$style.placeholder"> </view>
  </view>

  <PopExchange v-model:show="showExchangePop" />
</template>
<script setup lang="ts">
import { goodsBookings } from '@/api/goods';
import { CUSTOM_PAY_TYPE_ADD_CART, LOGIN_TARGET, TARGET_REFRESH_CART_PAGE } from '@/constants';
import useLoginPop from '@/hook/useLoginPop';
import { usePointsGoodStore } from '@/stores';
import { Toast, goodsBooking, onGoodsDetailClick, subscribeMessage } from '@/utils';
import Taro from '@tarojs/taro';
import { computed, ref } from 'vue';
import PopExchange from '../PopExchange/PopExchange.vue';

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  pionBalance: {
    type: Number,
    default: 0,
  },
});

const goodsStore = usePointsGoodStore();
const goodsInfo = computed(() => goodsStore.goodsInfo);
// const getMemberLevel = computed((): Boolean => !!useUserStore().userInfo!.phone);

const submitLoading = ref(false);
const cartLoadingConfirm = ref(false);
const buyLoadingConfirm = ref(false);
const showExchangePop = ref(false);

// 预售且有预约活动
// 超过通知发送时间，则不展示预约按钮状态
const hasBooking = computed((): boolean => {
  if (!isPreSale.value) return false;
  const booking = goodsBooking(goodsInfo.value);
  if (!booking) return false;

  return Date.now() < new Date(booking.sendAt).getTime();
});

// 选中的suk信息
const saleSkuData = computed(() => {
  return goodsStore.skusData;
});

const skuSoldOut = computed((): boolean => {
  return saleSkuData.value.pointMallSaleData?.remainStock === 0;
});

const canBook = computed((): boolean => {
  const t = goodsInfo.value?.booking?.start;
  return Date.now() > new Date(t!).getTime() && !isBooked.value;
});

const isBooked = computed((): boolean => {
  return goodsInfo.value?.booking?.booked || false;
});

// 即将上新 (当前时间大于即将上新 小于上新时间)
const isPreSale = computed((): boolean => {
  const goods = goodsStore.goodsInfo;
  if (goods?.startTime && new Date(goods.startTime).getTime() > Date.now()) {
    return true;
  }
  return false;
});

// const subscribedText = computed((): string => {
//   return saleSkuData.value.subscribed ? '已订阅' : '到货提醒';
// });

const gotoPage = type => {
  if (type === 'home') {
    Taro.switchTab({ url: '/pages/index/index' });
  } else {
    Taro.eventCenter.trigger(TARGET_REFRESH_CART_PAGE);
    Taro.navigateTo({ url: '/packageA/pages/cart/cart' });
  }
};

const handleVerifyComfirm = () => {
  checkMemberLevel(LOGIN_TARGET.exchangePointGoods, handleVerifyComfirm);
  // const target: string = LOGIN_TARGET.exchangePointGoods;
  // const flag = authFlow({ target });
  // Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
  //   if (target === decodeURIComponent(arg)) {
  //     handleVerifyComfirm();
  //   }
  // });
  // if (!flag) return;

  if (props.pionBalance < saleSkuData.value.pointMallSaleData.point) {
    Toast('积分不足');
    return;
  }

  showExchangePop.value = true;
  buyLoadingConfirm.value = false;
};

const setLoadingConfirm = type => {
  console.log('type: ', type);
  type === CUSTOM_PAY_TYPE_ADD_CART ? (cartLoadingConfirm.value = false) : (buyLoadingConfirm.value = false);
};

// 订阅到货通知
// const handleSubscription = async () => {
//   if (saleSkuData.value.subscribed) return;

//   const target: string = 'handleSubscription';
//   const flag = authFlow({ target });
//   Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
//     if (target === decodeURIComponent(arg)) {
//       handleSubscription();
//     }
//   });
//   if (!flag) return;

//   handleReplenishNotice();
//   const templateId = process.env.GOODS_ARRIVE_MID;
//   if (!templateId) return;

//   const params = {
//     itemId: goodsInfo.value?.goodsInfo.id || 0,
//     skuId: saleSkuData.value.id,
//     templateId,
//   };
//   try {
//     await subscribeMessage([templateId]);
//     const res = await goodsArrive(params);

//     if (!res) return;
//     Toast('订阅成功');
//     setSkusSubscribed();
//   } catch (error) {
//     console.log('handleSubscription error', error);
//   }
// };

// function setSkusSubscribed() {
//   const findSkus = goodsInfo.value?.goodsInfo.skus.find(item => item.id === saleSkuData.value.id);
//   if (findSkus) {
//     findSkus.subscribed = true;
//   }
// }

const handleBook = async () => {
  checkMemberLevel(LOGIN_TARGET.bookingSaleGoods);
  // const flag = authFlow({ target: 'none' });
  // if (!flag) return;

  const b = goodsInfo.value?.booking;
  if (!b) return;

  let subed = false;
  try {
    if (!canBook.value) {
      Toast('商品即将开始预约，请耐心等待');
      return;
    }

    submitLoading.value = true;
    const subRes = await subscribeMessage(b.templateIds);

    subed = subRes[b.templateIds as any] === 'accept';
    const res = await goodsBookings(b.id, subed);
    Object.assign(b, res);
    Toast('预约成功');
  } catch (err) {
    Toast((err && err.messae) || '预约失败');
  } finally {
    submitLoading.value = false;
  }
};

const goShop = () => {
  onGoodsDetailClick(
    {
      barcode: saleSkuData.value.barcode,
      sn: saleSkuData.value.sn,
      id: `${saleSkuData.value.id}`,
      price: +saleSkuData.value.pointMallSaleData.price || 0,
      point: saleSkuData.value.pointMallSaleData.point,
      name: goodsInfo.value?.goodsInfo.name || '',
      type: '积分商品',
    },
    '选购同款',
  );
  Taro.navigateTo({ url: `/packageA/pages/goodsDetail/goodsDetail?id=${goodsInfo.value?.goodsInfo.id}` });
};

defineExpose({ setLoadingConfirm });
</script>
<style lang="scss" module>
@import './footerBtn.scss';
</style>
