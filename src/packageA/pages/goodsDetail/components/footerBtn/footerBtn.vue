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
        <view
          :class="$style['left-item']"
          class="nut-flex nut-flex-col nut-col-center nut-row-between"
          @click="gotoPage('car')"
        >
          <image :class="$style.icon_cart" src="../../../../../static/icon/cart.png" />
          <view v-if="cartListLen" :class="$style.badge" class="numfnt">
            <text>{{ cartListLen }}</text>
          </view>
          <text :class="$style['left-item_text']" class="f_s-10">购物车</text>
        </view>
      </view>

      <!-- 预售且有预约活动 -->
      <view :class="$style['footer-btn-none']" v-if="hasBooking">
        <nut-button
          :class="[$style['navigation-none'], { [$style['navigation-none_bg']]: !canBook }]"
          v-if="!isBooked"
          :loading="submitLoading"
          size="large"
          @click="handleBook"
          >上新预约</nut-button
        >
        <nut-button :class="[$style['navigation-none'], $style['navigation-none_has']]" v-else size="large"
          >已预约</nut-button
        >
      </view>

      <!-- 预售 -->
      <view :class="$style['footer-btn-none']" v-else-if="isPreSale">
        <nut-button :class="[$style['navigation-none'], $style['navigation-none_bg']]" size="large"
          >即将上新</nut-button
        >
      </view>

      <!-- 商品无库存 -->
      <view
        :class="$style['footer-btn-none']"
        class="f_w-400 f_s-14 nut-flex nut-col-top nut-row-center"
        v-else-if="skuSoldOut"
      >
        <nut-button
          shape="square"
          size="large"
          :class="[$style['navigation-none'], { [$style['navigation-none_has']]: saleSkuData.subscribed }]"
          @click="handleSubscription"
        >
          {{ subscribedText }}
        </nut-button>
      </view>

      <view :class="$style['footer-right']" class="nut-flex f_s-14" v-else>
        <nut-button
          shape="round"
          plain
          :class="$style['right-item']"
          :loading="cartLoadingConfirm"
          @click="addCart(CUSTOM_PAY_TYPE_ADD_CART)"
          >加入购物车</nut-button
        >
        <nut-button
          shape="round"
          type="primary"
          :class="[$style['right-item'], $style['btn-buy']]"
          :loading="buyLoadingConfirm"
          @click="addCart(CUSTOM_PAY_TYPE_BUY)"
          >立即购买</nut-button
        >
      </view>
    </view>
    <!-- 占位 -->
    <view :class="$style.placeholder"> </view>
    <CustomPay
      v-model:show="showPay"
      :data="goodsInfo"
      :activity-infos="activityInfos"
      :skus-data="saleSkuData"
      :type="buyType"
      :readonly="true"
    />
  </view>
</template>
<script setup lang="ts">
import { goodsArrive, goodsBookings } from '@/api/goods';
import { CUSTOM_PAY_TYPE_ADD_CART, CUSTOM_PAY_TYPE_BUY, LOGIN_TARGET, TARGET_REFRESH_CART_PAGE } from '@/constants';
import { GoodsInfo, GoodsInfoSkusItem, IGoodsAct } from '@/dto/goods';
import useLoginPop from '@/hook/useLoginPop';
import { useCartStore } from '@/stores';
import { Toast, goodsBooking, onGoodsDetailClick, subscribeMessage } from '@/utils';
import Taro from '@tarojs/taro';
import { PropType, computed, ref } from 'vue';
import CustomPay from '../CustomPay/CustomPay.vue';

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  data: { type: Object as PropType<GoodsInfo | null>, default: null },
  activityInfos: { type: Array as PropType<IGoodsAct[]>, default: () => [] },
  skusData: { type: Object as PropType<GoodsInfoSkusItem>, default: () => {} },
});

const goodsInfo = computed(() => props.data);

const submitLoading = ref(false);
const cartLoadingConfirm = ref(false);
const buyLoadingConfirm = ref(false);
const showPay = ref<boolean>(false);
const buyType = ref<number>(1);

const cartListLen = computed(
  (): number => (useCartStore().cartInfo?.items && useCartStore().cartInfo?.items.length) || 0,
);

// 预售且有预约活动
// 超过通知发送时间，则不展示预约按钮状态
const hasBooking = computed((): boolean => {
  if (!isPreSale.value) return false;
  const booking = goodsBooking(goodsInfo.value);
  if (!booking) return false;
  return Date.now() < new Date(booking.sendAt).getTime();
});

// 选中的suk信息
const saleSkuData = computed(() => props.skusData);

const skuSoldOut = computed((): boolean => {
  return saleSkuData.value.isSoldOut;
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
  const goods = goodsInfo.value;
  if (goods?.onSaleAt && new Date(goods.onSaleAt).getTime() > Date.now()) {
    return true;
  }
  return false;
});

const subscribedText = computed((): string => {
  return saleSkuData.value.subscribed ? '已订阅' : '到货提醒';
});

const gotoPage = type => {
  if (type === 'home') {
    Taro.switchTab({ url: '/pages/index/index' });
  } else {
    Taro.eventCenter.trigger(TARGET_REFRESH_CART_PAGE);
    Taro.navigateTo({ url: '/packageA/pages/cart/cart' });
  }
};

const addCart = (type: number = 0) => {
  const target: string = type === CUSTOM_PAY_TYPE_ADD_CART ? LOGIN_TARGET.addCart : LOGIN_TARGET.buyGoods;
  checkMemberLevel(target, () => addCart(type));
  // const flag = authFlow({ target });
  // Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
  //   if (target === decodeURIComponent(arg)) {
  //     addCart(type);
  //   }
  // });
  // if (!flag) return;

  onGoodsDetailClick(
    {
      barcode: saleSkuData.value.barcode,
      sn: saleSkuData.value.sn,
      id: `${saleSkuData.value.id}`,
      price: (saleSkuData.value?.price && +saleSkuData.value?.price) || 0,
      name: goodsInfo.value?.name || '',
      type: '商品',
    },
    type === CUSTOM_PAY_TYPE_ADD_CART ? '加入购物车' : '立即购买',
  );

  if (showPay.value) return;
  buyType.value = type;
  showPay.value = true;
};

// 订阅到货通知
const handleSubscription = async () => {
  if (saleSkuData.value.subscribed) return;

  checkMemberLevel(LOGIN_TARGET.subscribeGoods, handleSubscription);
  // const target: string = LOGIN_TARGET.subscribeGoods;
  // const flag = authFlow({ target });
  // Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
  //   if (target === decodeURIComponent(arg)) {
  //     handleSubscription();
  //   }
  // });
  // if (!flag) return;

  onGoodsDetailClick(
    {
      type: '商品',
      barcode: saleSkuData.value.barcode,
      sn: saleSkuData.value.sn,
      id: `${saleSkuData.value.id}`,
      price: (saleSkuData.value?.price && +saleSkuData.value?.price) || 0,
      name: goodsInfo.value?.name || '',
    },
    '到货提醒',
  );

  const templateId = process.env.GOODS_ARRIVE_MID;
  if (!templateId) return;

  const params = {
    itemId: goodsInfo.value?.id || 0,
    skuId: saleSkuData.value.id,
    templateId,
  };
  try {
    await subscribeMessage([templateId]);
    const res = await goodsArrive(params);

    if (!res) return;
    Toast('订阅成功');
    setSkusSubscribed();
  } catch (error) {
    console.log('handleSubscription error', error);
  }
};

function setSkusSubscribed() {
  const findSkus = goodsInfo.value?.skus.find(item => item.id === saleSkuData.value.id);
  if (findSkus) {
    findSkus.subscribed = true;
  }
}

const handleBook = async () => {
  checkMemberLevel(LOGIN_TARGET.bookingGoods, handleBook);
  // const flag = authFlow({ target: 'none' });
  // if (!flag) return;

  const b = goodsInfo.value?.booking;
  if (!b) return;

  onGoodsDetailClick(
    {
      type: '商品',
      barcode: saleSkuData.value.barcode,
      sn: saleSkuData.value.sn,
      id: `${saleSkuData.value.id}`,
      price: (saleSkuData.value?.price && +saleSkuData.value?.price) || 0,
      name: goodsInfo.value?.name || '',
    },
    '上新预约',
  );

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
</script>
<style lang="scss" module>
@import './footerBtn.scss';
</style>
