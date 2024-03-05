<template>
  <CustomPopup v-model:show="showPop" :zIndex="100">
    <view :class="$style.pop_container" class="nut-flex-col nut-col-top nut-row-left">
      <view :class="$style.ginfo" class="nut-flex nut-row-between nut-col-top">
        <image :class="$style.image" :src="goodsData?.goodsInfo.images[0]" mode="aspectFill"></image>
        <view class="nut-flex-1 nut-row-left nut-col-top">
          <view :class="$style.name" class="f_s-16 nut-line-2">{{ goodsData?.goodsInfo.name }}</view>
          <view :class="$style.point" class="nut-flex">
            <text class="numfnt-medium f_w-500 f_s-20" style="padding-right: 4px">{{ pointStr }}</text>
            <text>小火苗</text>
            <block v-if="priceStr > 0">
              <text>+</text>
              <text :class="$style.price">{{ priceStr }}</text>
              <text>元</text>
            </block>
          </view>
          <view class="nut-flex nut-col-top" :class="$style.num">
            <text>剩余库存</text>
            <text class="numfnt-medium f_w-500 f_s-14" :class="$style.num_r">{{
              saleSkuData?.pointMallSaleData?.remainStock
            }}</text>
          </view>
        </view>
      </view>
      <view :class="$style.address" class="nut-flex nut-row-between f_s-14">
        <block v-if="isGoods">
          <text style="padding-right: 10px">收货地址</text>
          <view class="nut-flex-1 nut-flex nut-row-right" @tap="selectAddress">
            <text class="nut-line-1 nut-flex-1" style="text-align: right">{{
              (detailedAddress && detailedAddress) || '暂无地址，点击添加'
            }}</text>
            <image class="icon-right" src="../../../../../static/icon/arr-right-s.png"></image>
          </view>
        </block>
        <block v-else>
          <text :class="$style.coupon_tips">兑换后优惠券直接发放到下单账号中</text>
        </block>
      </view>
      <nut-button
        :class="$style.btn"
        :block="true"
        type="primary"
        :disabled="isGoods && !detailedAddress"
        @click="handleVerifyComfirm"
        >我要兑换</nut-button
      >
    </view>
  </CustomPopup>

  <Notice
    v-model:show="showVerifyPop"
    @close="closeVerifyPop"
    :confirmBtnStyle="confirmBtnStyle"
    :isComfirmBtnplain="false"
    :submitLoading="loadingSubmit"
    submitText="兑换"
    title=""
    @submit="handleSubmit"
  >
    <view class="f_s-16 f_w-400 nut-flex nut-col-center nut-row-center">
      <view :class="$style.notice_title">是否确认兑换该商品</view>
    </view>
  </Notice>
</template>

<script setup lang="ts">
import { getPresettleApi, getSettleCommitOrderApi } from '@/api/settle';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import {
  OMS_CART_ERROR_TEXT,
  ORDER_STOCK_ERROR,
  ORDER_STOCK_ERROR_TEXT,
  PERSETTLE_CHECKITEM_TYPE_TEXT,
} from '@/constants';
import { TARGET_LOCATION_CHANGE_POINT } from '@/constants/base';
import { IAddressesInfo } from '@/dto/address';
import { IOrderInfo } from '@/dto/order';
import { IPointsGoodsSkus, pointMallTypeTargetType } from '@/dto/point';
import {
  FINISH_TYPE,
  IDeliverAddr,
  IPresettleParamsItems,
  IPromotionsParamsItems,
  ISettleCommitOrderParams,
  ISettleParams,
} from '@/dto/settle';
import { useAddressStore, usePointsGoodStore } from '@/stores';
import { Toast, requestPayment, wait } from '@/utils';
import { IEventsName, tarckEvents } from '@/utils/track';
import Taro from '@tarojs/taro';
import { debounce, isEmpty } from 'lodash';
import { computed, onMounted, ref } from 'vue';

const confirmBtnStyle = {
  color: '#FFF',
  background: `#333`,
  border: 'none',
};

const path = 'packageA/pages/pointGoodsDetail/pointGoodsDetail';

const emits = defineEmits(['update:show', 'update:showPoster']);
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});

const goodsStore = usePointsGoodStore();
const useAddress = useAddressStore();

const goodsData = computed(() => goodsStore.goodsInfo);

const showPop = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const loadingSubmit = ref(false);
const showVerifyPop = ref(false);

const goodsNum = ref<number>(1);
const addressId = ref<number>(0);
const sParams = ref<ISettleParams>({
  items: [],
  promotions: [],
  couponCodes: [],
  settleCartMode: 'point',
  couponUsed: false,
  point: 0,
  deliverAddr: {
    name: '',
    phone: '',
    provinceName: '',
    cityName: '',
    districtName: '',
    zipcode: '',
    districtCode: '',
    address: '',
  },
});

const saleSkuData = computed((): IPointsGoodsSkus => {
  return goodsStore.skusData;
});

const pointStr = computed((): number => {
  return saleSkuData.value.pointMallSaleData?.point || 0;
});

const priceStr = computed((): number => {
  return saleSkuData.value.pointMallSaleData?.price || 0;
});

const isGoods = computed((): boolean => {
  return goodsData.value?.pointMallTypeTargetType === pointMallTypeTargetType.goods;
});

const detailedAddress = computed((): string => {
  if (!sParams.value.deliverAddr) return '';
  const { provinceName = '', cityName = '', address = '' } = sParams.value.deliverAddr;
  if (provinceName && cityName && address) {
    return `${provinceName} ${cityName} ${address}`;
  }
  return '';
});

// 兑换
const handleVerifyComfirm = () => {
  showVerifyPop.value = true;
};

const closeVerifyPop = () => {
  showVerifyPop.value = false;
  loadingSubmit.value = false;
};

// 预结算
const handleSubmit = debounce(async () => {
  if (!goodsData.value) return;

  const goodsId = goodsData.value.goodsInfo.id;

  // 购买项
  const item: IPresettleParamsItems = {
    goodsId,
    skuId: saleSkuData.value.id,
    count: Number(goodsNum.value),
    selectPromotion: '',
  };

  // 活动
  const promotions: IPromotionsParamsItems = {
    goodsInfos: [
      {
        goodsId,
        skuId: saleSkuData.value.id,
        count: Number(goodsNum.value),
      },
    ],
    promotionId: goodsData.value.promotionId,
  };
  sParams.value.items = [{ ...item }];
  sParams.value.promotions = [{ ...promotions }];

  // 优惠券商品不需要地址
  if (!isGoods.value) {
    delete sParams.value.deliverAddr;
  }

  if (!sParams.value) return;
  loadingSubmit.value = true;

  let result;
  try {
    result = await getPresettleApi(sParams.value);
  } catch (error) {
    console.error('error', error);
    loadingSubmit.value = false;

    return Toast((error?.code && OMS_CART_ERROR_TEXT[error.code]) || error?.message || '兑换失败，请稍后再试');
  } finally {
    const goodsId: any = goodsData.value?.goodsInfo.id;

    tarckEvents([{ path, event: IEventsName.GOODS_EXCHANGE_CL, properties: { goodsId } }]);
  }

  if (!result) return;
  if (result.item?.length > 0) {
    loadingSubmit.value = false;
    return Toast(PERSETTLE_CHECKITEM_TYPE_TEXT[result.item[0].type] || '兑换失败，请稍后再试');
  }

  placeOrder();
}, 500);

// 结算
const placeOrder = async () => {
  if (!sParams.value) return;

  const params: ISettleCommitOrderParams = {
    ...sParams.value,
    memo: '',
  };

  let result: IOrderInfo | undefined;
  try {
    result = await getSettleCommitOrderApi(params);
    // 判断是否需要支付
    if (Number(result?.payableAmount) === 0) {
      loadingSubmit.value = false;
      return gotoFinishPage(result);
    }
  } catch (error) {
    loadingSubmit.value = false;
    console.error('error', error);
    if (error.code && error.code === ORDER_STOCK_ERROR[error.code.toUpperCase()]) {
      Toast(ORDER_STOCK_ERROR_TEXT[error.code]);
    } else {
      Toast('兑换失败');
    }
  }

  if (!result) {
    loadingSubmit.value = false;
    return;
  }
  await getOrderChargel(result);
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
      // await handleSubscribe(orderNo);
      Taro.redirectTo({ url });
      return;
    }

    Toast(errMsg);
    await wait(1500);
    Taro.redirectTo({ url });
    return;
  }
};

// 跳转完成页
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

function selectAddress() {
  Taro.navigateTo({
    url: `/packageA/pages/address/addressList/addressList?target=${TARGET_LOCATION_CHANGE_POINT}&title=选择地址`,
  });
}

const handleDeliverAddr = async (data: IAddressesInfo | null = null) => {
  let _addr: IDeliverAddr | null = null;
  let beforeData: any = null;
  addressId.value = 0;

  if (!data) {
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

const getUerAddresses = async () => {
  if (isEmpty(useAddress.addressList)) {
    await useAddress.getUerAddresses();
    await handleDeliverAddr();
  } else {
    await handleDeliverAddr();
  }
};

onMounted(async () => {
  await getUerAddresses();
  initeEvenCenter();
});

const initeEvenCenter = () => {
  Taro.eventCenter.on(TARGET_LOCATION_CHANGE_POINT, (arg: IAddressesInfo | null) => {
    handleDeliverAddr(arg);
  });
};
</script>

<style lang="scss" module>
.pop_container {
  width: 375px;
  padding: 48px 16px 8px 16px;
  .ginfo {
    width: 343px;
    min-height: 120px;
    padding-bottom: 24px;
    .image {
      width: 108px;
      height: 120px;
      margin-right: 16px;
    }
    .name {
      margin-bottom: 8px;
    }
    .point {
      margin-bottom: 24px;
    }
    .num {
      line-height: 18px;
      &_r {
        line-height: 20px;
        padding-left: 8px;
      }
    }
  }

  .address {
    width: 343px;
    height: 56px;
    line-height: 56px;
    border-top: 0.5px solid $Divide;
    border-bottom: 0.5px solid $Divide;
    margin-bottom: 24px;
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    .coupon_tips {
      width: 100%;
      text-align: center;
    }
  }
  .btn {
    margin-bottom: 10px;
  }
}
</style>
