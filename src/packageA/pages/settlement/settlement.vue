<template>
  <BackgroundImage :class="$style['settlement-layout']">
    <CustomBar title="填写订单" />
    <view :class="$style.main" class="nut-flex-1" v-if="isLoaded">
      <!-- 地址 -->
      <view class="mg-bottom-14">
        <LocationView :data="sParams.deliverAddr" :a-id="addressId" @setAddr="setDeliverAddr" />
      </view>
      <!-- 商品列表 -->
      <view :class="$style.goos_list" class="mg-bottom-14 box">
        <block v-if="settleInfo?.items && settleInfo?.items.length > 0">
          <block v-for="item in settleInfo?.items" :key="item.id">
            <ProductInfoPanel :data="item" :class="$style.goos_list_mg" />
          </block>
        </block>
      </view>
      <!-- 订单信息 -->
      <OrderInfo
        :data="settleInfo"
        :pointType="pointType"
        :isOptimalCoupon="isOptimalCoupon"
        :canClaimCouponList="couponList?.getCanClaimCouponList.length"
        v-model:memo="memo"
        v-model:showCouponPop="showCouponPop"
        v-model:showCoinPop="showCoinPop"
      />
      <!-- 积分 -->
      <!-- <PopCoin v-model:show="showCoinPop" :usableBalance="usableBalance" @comfirm="handleCoinPopComfirm" /> -->
      <!-- 优惠券 -->
      <PopCoupon
        v-model:show="showCouponPop"
        :couponUsableList="couponList"
        :couponCodes="settleInfo?.couponCodes"
        @comfirm="handleCouponPopComfirm"
        @refresh="setCouponList"
      />

      <view :class="$style.main_placeholder"></view>
      <!-- <PopRemark v-model:show="showRemarkPop" @comfirm="handleRemarkPopComfirm" /> -->
    </view>

    <view v-if="isLoaded" :class="$style.footer" class="nut-flex nut-col-center nut-row-between">
      <!-- <view :class="$style.actualPay" class="f_s-12 f_w-500">
        <text>¥</text>
        <text :class="$style.actualPay_num">{{ settleInfo?.payableAmount }}</text>
      </view> -->
      <CustomPrice :price="settleInfo?.payableAmount" :priceColor="variables.primaryColor" />
      <nut-button
        class="f_s-14 f_w-400"
        shape="square"
        size="large"
        type="primary"
        :class="$style.btn"
        :loading="loadingSave"
        @click="handleOrderBuy"
        >提交订单</nut-button
      >
    </view>

    <Loading :show="!isLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getSettleCommitOrderApi, getSettleCouponList, paySubscribe } from '@/api/settle';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import {
  LINK_FLOW_ORDER_STATUS,
  ORDER_BIZ_CODE_TEXT,
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  ORDER_STOCK_ERROR,
  ORDER_STOCK_ERROR_TEXT,
  TARGET_LOCATION_CHANGE,
} from '@/constants';
import { IAddressesInfo } from '@/dto/address';
import { EDiscountDetailsItemType, IOrderInfo } from '@/dto/order';
import {
  FINISH_TYPE,
  ICouponList,
  IDeliverAddr,
  ISettleCommitOrderParams,
  ISettleInfo,
  ISettleParams,
} from '@/dto/settle';
import { useAddressStore, useSettleStore } from '@/stores';
import { Toast, requestPayment, subscribeMessage, wait } from '@/utils';
import Taro, { getApp, useRouter } from '@tarojs/taro';
import { debounce, isEmpty } from 'lodash';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import LocationView from '../../components/LocationView/LocationView.vue';
import OrderInfo from './components/OrderInfo/OrderInfo.vue';
// import PopCoin from './components/PopCoin/PopCoin.vue';
import PopCoupon from './components/PopCoupon/PopCoupon.vue';
// import PopRemark from './components/PopRemark/PopRemark.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomPrice from '@/components/CustomPrice/CustomPrice.vue';
import Loading from '@/components/Loading/Loading.vue';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/dto/events';
import variables from '@/scss/variables';
import { getRefererPath } from '@/utils/track/config';
import ProductInfoPanel from '../../components/ProductInfoPanel/ProductInfoPanel.vue';

const useAddress = useAddressStore();
// const poinStore = usePointStore();
const settleStore = useSettleStore();

const router = useRouter<{ mode: string; sParams: string }>();
const sParams = ref<ISettleParams>(JSON.parse(router.params.sParams) || null);
const isLoaded = ref<boolean>(false);
const addressId = ref<number>(0);
const memo = ref<string>(''); // 备注
const showCoinPop = ref<boolean>(false);
const showCouponPop = ref<boolean>(false);
const pointType = ref<number>(1);
const loadingSave = ref<boolean>(false);
const isOptimalCoupon = ref(true);
const couponList = ref<ICouponList>();

// const poinBalance = computed((): number => poinStore.balance);
const settleInfo = computed((): ISettleInfo | null => settleStore.settleInfo);

// const usableBalance = computed((): number => {
//   if (!settleInfo.value) return 0;
//   const max_balance = settleInfo.value.maximumPoint;
//   if (poinBalance.value >= max_balance) return max_balance;
//   return poinBalance.value;
// });

onMounted(() => {
  initeEvenCenter();
  init();
});

onUnmounted(() => {
  console.debug('settlement onUnmounted');
  Taro.eventCenter.off(TARGET_LOCATION_CHANGE);
});

const initeEvenCenter = () => {
  Taro.eventCenter.on(TARGET_LOCATION_CHANGE, (arg: IAddressesInfo | null) => {
    handleDeliverAddr(arg);
    getSetteInfo();
  });
};

const init = async () => {
  await getUerAddresses();
  await getSetteInfo();
  await getCouponList();
  // await poinStore.load();
};

// const handleCoinPopComfirm = async (data: { type: number; coin: number }) => {
//   sParams.value.point = data.coin;

//   await getSetteInfo();

//   pointType.value = data.type;
// };
const setCouponList = data => {
  couponList.value = data;
};

const handleCouponPopComfirm = (code: string) => {
  sParams.value.couponCodes = code.split(',');
  sParams.value.couponUsed = true;
  isOptimalCoupon.value = false;

  getSetteInfo();
};

/** 一键获取微信地址后调用 */
const setDeliverAddr = data => {
  handleDeliverAddr(data);
  getSetteInfo();
  Taro.preload({ wxAddr: '' });
};

const handleDeliverAddr = async (data: IAddressesInfo | null = null) => {
  let _addr: IDeliverAddr | null = null;
  let beforeData: any = null;
  addressId.value = 0;
  if (!data) {
    // useAddress.addressList?.forEach((address: IAddressesInfo) => {
    //   if (address.default) {
    //     beforeData = address;
    //   }
    // });
    if (useAddress.addressList && useAddress.addressList?.length > 0) {
      const data = useAddress.addressList?.find((item: IAddressesInfo) => item.default);
      beforeData = data ? data : useAddress.addressList[0];
    }
  } else {
    beforeData = data;
  }
  if (beforeData) {
    _addr = {
      name: beforeData.name,
      phone: beforeData.phone,
      provinceName: beforeData.province || '',
      cityName: beforeData.city || '',
      districtName: beforeData.district || '',
      zipcode: beforeData.zipcode || '',
      districtCode: beforeData.code || '',
      address: beforeData.address || '',
    };
    addressId.value = beforeData.id;
    sParams.value.deliverAddr = _addr!;
  }
};

const handleOrderBuy = debounce(async () => {
  if (handleShowNotFonudTips()) return;
  loadingSave.value = true;
  const params: ISettleCommitOrderParams = {
    items: sParams.value.items || [],
    promotions: sParams.value.promotions || [],
    couponCodes: sParams.value.couponCodes || [],
    couponUsed: sParams.value.couponUsed || false,
    point: sParams.value.point || 0,
    addressId: addressId.value,
    memo: memo.value,
    settleCartMode: sParams.value.settleCartMode,
    deliverAddr: sParams.value.deliverAddr,
  };

  let result: IOrderInfo | undefined;
  try {
    result = await getSettleCommitOrderApi(params);
    // 判断是否需要支付
    if (Number(result?.payableAmount) === 0) {
      loadingSave.value = false;
      return gotoFinishPage(result);
    }
  } catch (error) {
    loadingSave.value = false;
    console.error('error', error);
    if (error.code && error.code === ORDER_STOCK_ERROR[error.code.toUpperCase()]) {
      Toast(ORDER_STOCK_ERROR_TEXT[error.code]);
    }
  }

  if (!result) {
    loadingSave.value = false;
    return;
  }

  onSubmitTrack(result);
  await getOrderChargel(result);
}, 500);

const gotoFinishPage = (data: IOrderInfo) => {
  const gItems = data.generateRights;
  const points = gItems?.filter(item => item.type === 'point');

  let point = 0;
  if (points && points.length > 0) {
    points.forEach(item => {
      if (item.value > 0) {
        point += item.value;
      }
    });
  }

  Taro.preload({ type: FINISH_TYPE.orderDetails, orderNo: data.orderNo });
  Taro.redirectTo({
    url: `/packageA/pages/finish/finish?point=${point}`,
  });
};

const getSetteInfo = async () => {
  try {
    const params: ISettleParams = sParams.value;
    await settleStore.getSettle(params);
    await handleInitData();
    isLoaded.value = true;
  } catch (error) {
    console.error('getSetteInfo error=', error);
  }
};

const getCouponList = async () => {
  try {
    const result = await getSettleCouponList({ settleParams: sParams.value });
    couponList.value = result;
  } catch (error) {
    console.error('getSettleCouponList error=', error);
  }
};

const handleShowNotFonudTips = () => {
  if (!settleInfo.value?.districtCheck) {
    if (isEmpty(sParams.value.deliverAddr)) {
      Toast('请填写收货地址');
    } else {
      Toast('该地区不支持配送');
    }
    return true;
  }
  return false;
};

const handleInitData = () => {
  if (!settleInfo.value) return;
  const code = settleInfo.value.couponCodes;
  sParams.value.couponCodes = code;
  sParams.value.couponUsed = code.length > 0 ? true : false;
  const point = settleInfo.value.point;
  sParams.value.point = point;
};

const getUerAddresses = async () => {
  if (isEmpty(useAddress.addressList)) {
    await useAddress.getUerAddresses();
    await handleDeliverAddr();
  } else {
    await handleDeliverAddr();
  }
};

// const getSettleCart = async () => {
//   try {
//     const params: ISettleCartParams = sParams.value;
//     await settleStore.getSettleCart(params);
//   } catch (error) {
//     console.error('getSettleCart error=', error);
//   }
// };

// const getSettleBuyNow = async () => {
//   try {
//     const params: ISettleBuyNowParams = sParams.value;
//     await settleStore.getSettleBuyNow(params);
//     await handleInitData();
//   } catch (error) {
//     console.error('getSettleBuyNow error=', error);
//   }
// };

// 订阅 待付款通知
const handleSubscribe = async orderNo => {
  const mid = process.env.PAYMENT_MID as string;

  const params = {
    orderNo: orderNo,
    templateId: mid,
  };
  try {
    await subscribeMessage([mid]);
    await paySubscribe(params);
  } catch (error) {
    console.log('handleSubscribe error', error);
  }
};

const getOrderChargel = async (data: IOrderInfo) => {
  const { orderNo } = data;
  try {
    await requestPayment(orderNo);
    gotoFinishPage(data);
  } catch (error) {
    console.error('getOrderChargel error=', error);
    const errMsg = (error && error.message) || '支付失败，请联系客服';
    const url = `/packageA/pages/order/orderDetails/orderDetails?orderNo=${orderNo}`;
    if (errMsg === 'requestPayment:fail cancel') {
      // 取消支付时订阅消息
      await handleSubscribe(orderNo);
      Taro.redirectTo({ url });
      return;
    }

    Toast(errMsg);
    await wait(1500);
    Taro.redirectTo({ url });
    return;
  }
};

const onSubmitTrack = (data: IOrderInfo) => {
  const linkflow = getApp()[`${process.env.APP_ID}`];
  if (!linkflow) return;
  const triggerPagePath = getRefererPath();
  // 埋点 提交订单-主订单
  linkflow.track({
    event: ELinkflowEventsName.Order_Submit,
    props: {
      totalPrice: +data.goodsAmount || data.goodsAmount,
      totalQuantity: data.orderItems.length,
      paymentPrice: +data.payableAmount || data.payableAmount,
      receiverName: data.deliverAddr.name,
      receiverMobile: data.deliverAddr.phone,
      deliveryProvince: data.deliverAddr.provinceName,
      deliveryCity: data.deliverAddr.cityName,
      deliveryDistrict: data.deliverAddr.districtName,
      deliveryAddress: data.deliverAddr.address,
      payDate: data.payTime,
      orderId: data.orderNo,
      shippingFee: +data.costFreight || data.costFreight,
      couponNum: `${data.couponList.length}`,
      orderType: ORDER_BIZ_CODE_TEXT[data.bizCode],
      orderRemark: data.memo,
      saleChannel: '小程序',
      // storeId: '',
      storeName: '会员小程序商城',
      triggerPagePath,
      orderStatus: LINK_FLOW_ORDER_STATUS[data.status],
    } as ILinkflowEventsProps,
  });

  if (Array.isArray(data.orderItems)) {
    for (const item of data.orderItems) {
      // 优惠券信息
      const couponDetail = data.discountDetails?.items.find(
        o => o.type === EDiscountDetailsItemType.coupon && o.items.find(i => i.skuId === item.skuId),
      );
      // 埋点 提交订单-子订单
      linkflow.track({
        event: ELinkflowEventsName.OrderDetail_Submit,
        props: {
          orderId: data.orderNo,
          lineId: `${data.orderNo}-${item.skuId}`,
          lineStatus: ORDER_STATUS_TEXT[ORDER_STATUS.PENDING_PAID],
          productName: item.goodsInfo.name,
          skuId: item.goodsInfo.skuBarCode,
          outerSkuId: item.goodsInfo.skuSn,
          miniSkuId: `${item.skuId}`,
          price: +item.mktPrice || item.mktPrice,
          itemTotalPrice: +item.totalPrice || item.totalPrice,
          quantity: item.count,
          itemPaymentPrice: +item.payableAmount || item.payableAmount,
          couponAllocatedAmount: +item.couponDiscountAmount || item.couponDiscountAmount,
          pointAllocatedAmount: +item.pointDiscountAmount || item.pointDiscountAmount,
          // priceAllocatedAmount: 0,
          saleChannel: '小程序',
          // storeId: '',
          storeName: '会员小程序商城',
          payDate: data.payTime,
          couponId: couponDetail?.couponCode || '',
          couponName: couponDetail?.name || '',
        } as ILinkflowEventsProps,
      });
    }
  }
};
</script>

<style lang="scss" module>
.settlement-layout {
  .main {
    padding: 14px 15px;
    .goos_list {
      padding-bottom: 10px;
      &_mg {
        margin-bottom: 16px;
      }
      &_mg:last-child {
        margin-bottom: 0;
      }
    }
  }
  .main_placeholder {
    height: 88px;
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 375px;
    height: 88px;
    padding: 8px 8px 0 24px;
    border-radius: 28px 28px 0px 0px;
    background: var(--bottom, rgba(165, 165, 165, 0.08));
    box-shadow: 0px 0px 16px 16px rgba(165, 165, 165, 0.15) inset;
    backdrop-filter: blur(8px);
    z-index: 100;
    align-items: baseline;
    .btn {
      width: 120px;
      height: 40px;
      border-radius: 40px;
      color: var(--white, #fff);
      font-size: 14px;
      font-family: 'FZLanTingHei-R-GBK';
      line-height: 20px;
    }
  }
}
</style>
