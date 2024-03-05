<template>
  <BackgroundImage>
    <CustomBar :title="orderDetail ? ORDER_STATUS_TEXT[orderDetail.status] : '订单详情'" :fixed="true" />

    <view
      v-if="orderDetail && orderDetail.expirationTime && paidStatus"
      class="f_s-12 f_w-600 nut-flex nut-col-center nut-row-center"
      :class="$style.header_tips"
      >订单将于
      <nut-countdown
        :class="$style.header_tips_countdown"
        class="f_s-12"
        :endTime="new Date(orderDetail.expirationTime).getTime()"
        format="HH:mm:ss"
        @on-end="changeOrderStatus"
      />后自动关闭
    </view>

    <view :class="[$style.main]" v-if="infoLoaded">
      <!-- 物流 -->
      <view :class="$style.parcel" class="box mg-bottom-14 rounded_corners-8" v-if="orderDetail && showLogistics">
        <ParcelItems :data="orderDetail.parcelItems" />
      </view>
      <!-- 地址 -->
      <view :class="$style.top" v-if="orderDetail && showAddress" class="mg-bottom-14">
        <LocationView :showRight="false" :data="orderDetail.deliverAddr" />
      </view>
      <view :class="$style.center">
        <!-- 商品列表 -->
        <view
          v-if="orderDetail && orderDetail.orderItems && orderDetail.orderItems.length > 0"
          :class="[$style.order_item]"
          class="box mg-bottom-14 rounded_corners-8"
        >
          <view :class="[$style['order-info']]" class="f_s-12 f_w-400 mg-bottom-12">商品信息</view>

          <block v-for="item in orderDetail.orderItems" :key="item.id">
            <view :class="$style.list" @tap="gotoGoodsDetailsPage(item)">
              <OrderBox :data="item" :showPrice="!isPointsOrder" />
            </view>
          </block>
        </view>
        <view v-if="orderDetail" :class="$style.info">
          <!-- 商品信息 -->
          <view :class="[$style.info_item]" class="box mg-bottom-14">
            <GoodsInfo :data="orderDetail" :isPointsOrder="isPointsOrder" />
          </view>
          <!-- 订单信息 -->
          <view :class="[$style.info_item]" class="box mg-bottom-14">
            <view :class="[$style['order-info']]" class="f_s-12 f_w-400 mg-bottom-12">订单信息</view>
            <OrderInfo :data="orderDetail" />
          </view>
        </view>
      </view>
      <view :class="$style.main_placeholder"></view>
    </view>
    <view
      v-if="orderDetail && showFooter && !isPointsOrder"
      :class="$style.footer"
      class="f_s-12 f_w-400 nut-flex nut-col-top nut-row-right"
    >
      <block v-if="paidStatus">
        <nut-button shape="square" plain type="primary" :class="$style.btn" @click="handleCancel">取消订单</nut-button>
        <nut-button
          shape="square"
          type="primary"
          :class="[$style.btn, $style.btn_pay]"
          @click="handlePay"
          :loading="payLoading"
          >去支付</nut-button
        >
      </block>

      <nut-button
        v-if="showCommentButton"
        :class="[$style.btn_comment, { [$style['btn_comment-can']]: canComment }]"
        class="nut-flex nut-row-center"
        shape="square"
        type="primary"
        :plain="canComment"
        @click="goComment"
        >{{ canComment ? '查看评价' : '评价' }}</nut-button
      >

      <nut-button
        v-if="showAfterSalesButton"
        :class="[$style.btn, $style.btn_service]"
        class="nut-flex nut-row-center"
        @click="handleRefund"
        >申请售后</nut-button
      >
    </view>

    <view
      v-if="orderDetail && isPointsOrder && paidStatus"
      :class="$style.footer"
      class="f_s-12 f_w-400 nut-flex nut-col-top nut-row-right"
    >
      <nut-button shape="square" plain type="primary" :class="$style.btn" @click="showCancelBox = true"
        >取消订单</nut-button
      >
      <nut-button
        shape="square"
        type="primary"
        :class="[$style.btn, $style.btn_pay]"
        @click="handlePay"
        :loading="payLoading"
        >去支付</nut-button
      >
    </view>
    <PopOrderCancelBox
      v-model:show="showCancelBox"
      :orderNo="orderDetail?.orderNo"
      :isPointsOrder="isPointsOrder"
      @refresh="handleRefresh"
    />

    <PopOrderRbatchItem v-model:show="showRbatchBox" :fullRefund="shipmentStatus" :data="orderDetail?.orderItems" />
    <Loading :show="!infoLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getOrdersDetailApi } from '@/api/order';
import { ORDER_STATUS, ORDER_STATUS_TEXT } from '@/constants';
import { IOrderInfo, OrderBizCode, OrderCommentStatus } from '@/dto/order';
import { useOrderStore, useReversibleStore } from '@/stores';
import { Toast, requestPayment } from '@/utils';
import Taro, { getApp, useDidShow, useRouter } from '@tarojs/taro';
import { isEmpty } from 'lodash';
import { computed, onMounted, onUnmounted, ref } from 'vue';
// import variables from '@/scss/variables';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import Loading from '@/components/Loading/Loading.vue';
import LocationView from '../../../components/LocationView/LocationView.vue';
import GoodsInfo from './components/GoodsInfo.vue';
import OrderInfo from './components/OrderInfo.vue';
import ParcelItems from './components/ParcelItems.vue';
// import OrderBox from './components/OrderBox.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import OrderBox from '@/components/OrderItem/OrderBox.vue';
import PopOrderCancelBox from '@/components/PopOrderCancelBox/PopOrderCancelBox.vue';
import PopOrderRbatchItem from '@/components/PopOrderRbatchItem/PopOrderRbatchItem.vue';
import { ELinkflowEventsName, IEventsName, ILinkflowEventsProps, tarckEvents } from '@/utils/track';

const linkflow = getApp()[`${process.env.APP_ID}`];
const path = 'packageA/pages/orderDetails/orderDetails';
const useReversible = useReversibleStore();

const router = useRouter();
const orderNo: string = router.params.orderNo || '';
const orderDetail = ref<IOrderInfo | null>(null);
/** 取消订单 */
const showCancelBox = ref<boolean>(false);
/** 申请退款 */
const showRbatchBox = ref<boolean>(false);
const infoLoaded = ref<boolean>(false);
const isRequest = ref<boolean>(true);

const payLoading = ref(false);

const orderItemInfo = computed((): IOrderInfo => useOrderStore().getOrderItemInfo);

/** 待付款 */
const paidStatus = computed((): boolean => {
  return orderDetail.value?.status === ORDER_STATUS.PENDING_PAID || false;
});
/** 待发货 */
const shipmentStatus = computed((): boolean => {
  return orderDetail.value?.status === ORDER_STATUS.PENDING_SHIPMENT || false;
});
/** 待收货 */
const receiptStatus = computed((): boolean => {
  return orderDetail.value?.status === ORDER_STATUS.PENDING_RECEIPT || false;
});
/** 已完成 */
const completedStatus = computed((): boolean => {
  return orderDetail.value?.status === ORDER_STATUS.COMPLETED || false;
});

/** 交易关闭 */
const closedStatus = computed((): boolean => {
  return orderDetail.value?.status === ORDER_STATUS.CLOSED || false;
});
/** 物流信息显示 */
const showLogistics = computed(() => {
  if (
    (receiptStatus.value || completedStatus.value || closedStatus.value) &&
    orderDetail.value &&
    orderDetail.value.parcelItems.length > 0
  ) {
    return true;
  }
  return false;
});
/** 地址信息显示 */
const showAddress = computed(() => {
  if (orderDetail.value && !isEmpty(orderDetail.value.deliverAddr)) {
    return true;
  }
  return false;
});

const showFooter = computed((): boolean => {
  return paidStatus.value || shipmentStatus.value || receiptStatus.value || completedStatus.value;
});

const showAfterSalesButton = computed((): boolean => {
  return shipmentStatus.value || receiptStatus.value || completedStatus.value;
});

const showCommentButton = computed((): boolean => {
  return completedStatus.value && orderDetail.value?.commentStatus !== OrderCommentStatus.close;
});

/** 积分兑换订单 */
const isPointsOrder = computed((): boolean => {
  return orderDetail.value?.bizCode === OrderBizCode.Point;
});

const canComment = computed((): boolean => orderDetail.value?.commentStatus === OrderCommentStatus.comment);

onMounted(() => {
  initData();
});

useDidShow(() => {
  if (!isRequest.value) return;
  getOrdersDetail();
});

onUnmounted(() => {
  useOrderStore().setOrderItemInfo(null);
});

const initData = () => {
  if (isEmpty(orderItemInfo.value)) return;
  orderDetail.value = Object.assign({}, orderDetail.value, orderItemInfo.value);
};

const handleRefresh = (status: string) => {
  if (!orderDetail.value) return;
  orderDetail.value.status = status;
};

const changeOrderStatus = () => {
  if (!orderDetail.value?.status) return;
  orderDetail.value.status = ORDER_STATUS.CANCELED;
};

const handlePay = async () => {
  console.debug('handlePay');
  // tarckEvents([{ path, event: IEventsName.ORDER_PAY_CL, properties: { orderNo } }]);
  onTrack('去支付');

  payLoading.value = true;
  try {
    await getOrderChargel();
  } finally {
    payLoading.value = false;
  }
};

const handleRefund = () => {
  onTrack('申请售后');

  if (!verifyTime()) return;
  if (shipmentStatus.value) {
    Taro.navigateTo({
      url: `/packageA/pages/order/refund/refund?data=${JSON.stringify(orderDetail.value?.orderItems)}`,
    });
    return;
  }
  showRbatchBox.value = true;
};

/**  获取售后可退状态 */
const getItemStatus = async () => {
  const orderStatus = orderDetail.value?.status || '';

  // 设置订单状态(申请退款中使用)
  useReversible.setOrderStatus(orderStatus);

  let result = await useReversible.getAfterSalesStatus(orderNo);
  console.log('result: ', result);

  if (!result) return;
  const itemList = result.items || [];

  orderDetail.value?.orderItems.forEach(item => {
    let skuId = item.skuId;

    let index = itemList.findIndex(items => items.skuId === skuId);
    item.isReversible = itemList[index].serveStatus === 'noserving' ? true : false;
  });
};

const getOrdersDetail = async () => {
  try {
    const result = await getOrdersDetailApi(orderNo);
    orderDetail.value = result;
    infoLoaded.value = true;

    if (paidStatus.value) return;
    getItemStatus();
  } catch (error) {
    console.error('getOrdersDetail error=', error);
  }
};

const getOrderChargel = async () => {
  try {
    const { alreadyPaid } = await requestPayment(orderNo);
    if (alreadyPaid) {
      useOrderStore().setOrderPayedList(orderNo);
      await getOrdersDetail();
      return Toast('订单已支付');
    }
    isRequest.value = false;
    useOrderStore().setOrderPayedList(orderNo);
    getOrdersDetail();
    // 更新当前订单状态
    handleRefresh(ORDER_STATUS.PENDING_SHIPMENT);
  } catch (err) {
    Toast('支付失败，请联系客服');
  }
};

const verifyTime = () => {
  const completeTime = orderDetail.value ? orderDetail?.value.completeTime : '';

  if (!completeTime) return true;

  const nowTime = new Date().getTime();
  const comTime = new Date(completeTime).getTime() + 7 * 24 * 60 * 60 * 1000;
  console.log('nowTime < comTime: ', nowTime, comTime);

  if (nowTime > comTime) {
    Toast('超过允许退款时间');
    return false;
  }
  return true;
};

const gotoGoodsDetailsPage = item => {
  tarckEvents([{ path, event: IEventsName.GOODS_CL, properties: { goodsId: item.goodsId } }]);
  const url = !isPointsOrder.value
    ? `/packageA/pages/goodsDetail/goodsDetail?id=${item.goodsId}`
    : `/packageA/pages/pointGoodsDetail/pointGoodsDetail?promotionId=${orderDetail.value?.promotionList[0].promotionId}`;
  Taro.navigateTo({
    url,
  });
};

function goComment() {
  onTrack(canComment.value ? '查看评价' : '评价');

  Taro.preload({ goodsData: orderDetail.value?.orderItems });
  Taro.navigateTo({
    url: `/packageA/pages/order/orderReview/orderReview?orderNo=${orderDetail.value?.orderNo}&type=${orderDetail.value?.commentStatus}`,
  });
}

function handleCancel() {
  onTrack('取消订单');
  showCancelBox.value = true;
}

const onTrack = (buttonName: '去支付' | '申请售后' | '评价' | '查看评价' | '取消订单') => {
  if (!linkflow) return;
  linkflow.track({
    event: ELinkflowEventsName.OrderDetail_Click,
    props: { buttonName, orderId: orderNo } as ILinkflowEventsProps,
  });
};
</script>

<style lang="scss" module>
.main {
  height: 100%;
  padding: 14px 15px;
  box-sizing: border-box;
  .parcel {
    box-sizing: border-box;
  }
  .center {
    .order_item {
      padding-bottom: 10px;
    }
    .list {
      width: 100%;
      margin-bottom: 12px;
    }
    .info {
      .info_item {
        border-radius: 8px;
      }
      .order-info {
        color: $Primary;
        font-family: 'FZLanTingHei-R-GBK';
      }
    }
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  height: 88px;
  background: #fff;
  padding: 8px;
  border-radius: 28px 28px 0px 0px;
  background: var(--bottom, rgba(165, 165, 165, 0.08));
  box-shadow: 0px 0px 16px 16px rgba(165, 165, 165, 0.15) inset;
  backdrop-filter: blur(8px);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .btn {
    width: 175px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid $Tertiary;
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    background: transparent;
  }
  .btn_pay {
    margin-left: 8px;
    background: $Primary;
    border-radius: 20px;
    color: $white;
    border: none;
  }
  .btn_service {
    width: 120px;
    height: 40px;
    margin-left: 16px;
    background: transparent;
    border: 1px solid $Tertiary;
  }
  .btn_comment {
    width: 120px;
    height: 40px;
    border-radius: 20px;
    font-family: 'FZLanTingHei-R-GBK';
    &-can {
      background: transparent;
    }
  }
}

.header_tips {
  color: #f00;
  font-family: PingFang SC;
  margin-top: 8px;
  &_countdown {
    margin: 0 4px;
    color: #f00;
    font-size: 12px;
  }
}
.main_placeholder {
  height: 73px;
}
</style>
