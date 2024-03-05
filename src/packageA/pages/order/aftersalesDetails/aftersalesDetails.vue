<template>
  <BackgroundImage>
    <CustomBar title="退款详情" />
    <block v-if="infoLoaded">
      <view :class="[$style.main, $style.mg_bottom]">
        <view :class="$style.top" class="box mg-bottom-14">
          <view
            v-if="afterSaleStatusData"
            :class="$style['top-item']"
            class="nut-flex nut-flex-col nut-row-center nut-col-center"
          >
            <view :class="$style['title']" class="f_s-20 f_w-600 nut-flex nut-col-center nut-row-left mg-bottom-4">
              {{ afterSaleStatusData.title }}
            </view>
            <text :class="$style.tips" class="f_s-14 f_w-400">{{ afterSaleStatusData.tips }}</text>
          </view>
        </view>

        <view class="box nut-flex-col nut-col-top mg-bottom-16" v-if="showReturnInfo">
          <view :class="$style['category-title']" class="f_s-12 f_w-400 mg-bottom-16">退货信息</view>
          <!-- 填写物流倒计时 -->
          <Countdown v-if="showCountdown && showSalesReturn" :end-time="countdownTime" @refresh="getOrdersDetail" />

          <block v-if="showSalesReturn || orderDetail?.fillUpTime">
            <!-- 退货地址 -->
            <ReturnAddress :class="$style.box_width" />

            <!-- 物流信息 -->
            <Logistics
              :class="$style.box_width"
              :afterSaleNo="orderDetail?.afterSaleNo"
              :logisticInfo="logisticInfo"
              :isFillUpTime="!!orderDetail?.fillUpTime"
              @refresh="refreshData"
            />
          </block>
        </view>

        <view :class="$style.center" class="box mg-bottom-80">
          <view :class="$style['category-title']" class="f_s-12 f_w-400 mg-bottom-12">退款信息</view>
          <view v-if="orderItems" :class="[$style.order_item, $style.mg_bottom]">
            <OrderItem :data="orderItems" />
          </view>
          <view v-if="orderDetail" :class="[$style.info_item]">
            <OrderInfo :data="orderDetail" />
          </view>
        </view>
      </view>

      <view :class="$style.navigation" class="f_s-14 nut-flex nut-col-center nut-row-between">
        <nut-button
          shape="square"
          type="primary"
          plain
          open-type="contact"
          :class="[$style.btn, { [$style.btn_width]: !showFooter }]"
          @click="openService()"
          >联系客服</nut-button
        >

        <nut-button
          :class="[$style.btn]"
          shape="square"
          type="primary"
          plain
          v-if="showFooter === 'CANCEL'"
          @click="handleCancel"
          >取消申请</nut-button
        >
        <nut-button
          :class="[$style.btn]"
          shape="square"
          type="primary"
          plain
          @click="handleReapply"
          v-if="showFooter === 'REAPPLY'"
          >再次申请</nut-button
        >
        <!-- <view :class="$style.safe" class="iphone-end"></view> -->
      </view>
    </block>

    <Loading :show="!infoLoaded" />

    <Notice v-model:show="showDelPop" @close="showDelPop = false" title="" @submit="handleDelComfirm">
      <view class="f_s-14 f_w-400 nut-flex nut-col-center nut-row-center">
        <view>确定撤销申请退款吗？</view>
      </view>
    </Notice>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { useDidShow, useRouter } from '@tarojs/taro';
import { computed, onMounted, ref, onUnmounted, reactive } from 'vue';
import { aftersalesCancel, getAftersalesDetailApi } from '@/api/aftersales';
import { IOrderInfoItems } from '@/dto/order';
import { ActionType, AfterSaleOperatorType, IAftersalesInfo, RefundType } from '@/dto/aftersales';
import { useAfterSalesStore, useReversibleStore } from '@/stores';
import { isEmpty } from 'lodash';
import { Toast, openCustomerServiceChat as openService } from '@/utils';
import {
  AFTER_SALE_STATUS,
  AFTER_SALE_STATUS_MONEY_ONLY_TEXT,
  AFTER_SALE_STATUS_MONEY_GOODS_TEXT,
  AFTER_SALE_STATUS_TIPS,
} from '@/constants';
// import variables from '@/scss/variables';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import OrderItem from '@/components/OrderItem/OrderItem.vue';
import OrderInfo from './components/OrderInfo.vue';
import Logistics from './components/Logistics.vue';
import ReturnAddress from './components/ReturnAddress.vue';
import Countdown from './components/Countdown.vue';
import Notice from '@/components/Notice/Notice.vue';
import Taro from '@tarojs/taro';
import Loading from '@/components/Loading/Loading.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';

const router = useRouter();
const useReversible = useReversibleStore();

const afterSaleNo: string = router.params.afterSaleNo || '';
const orderDetail = ref<IAftersalesInfo | null>(null);
const infoLoaded = ref<boolean>(false);

interface IAfterSaleStatusData {
  // icon: string;
  title: string;
  tips: string;
  // color: string;
}

const showDelPop = ref<boolean>(false);

const orderItemInfo = computed((): IAftersalesInfo => useAfterSalesStore().getOrderItemInfo);

// 退货物流
const showSalesReturn = computed(() => {
  if (
    (orderDetail.value?.status === AFTER_SALE_STATUS.PENDING_FILL_UP_LOGISTIC ||
      orderDetail.value?.status === AFTER_SALE_STATUS.PENDING_SHIPMENT) &&
    orderDetail.value?.type === RefundType.MONEY_GOODS
  ) {
    return true;
  }

  return false;
});

const afterSaleStatusData = computed((): IAfterSaleStatusData | null => {
  if (!orderDetail.value) return null;
  let result: IAfterSaleStatusData = {
    title: '',
    tips: '',
  };

  const status = orderDetail.value.status;
  const type = orderDetail.value?.type === RefundType.MONEY_GOODS;
  const logs = orderDetail.value?.logs && orderDetail.value?.logs[orderDetail.value?.logs.length - 1];

  // 状态标题
  result.title = type ? AFTER_SALE_STATUS_MONEY_GOODS_TEXT[status] : AFTER_SALE_STATUS_MONEY_ONLY_TEXT[status];
  result.tips = AFTER_SALE_STATUS_TIPS[status];

  if (status === AFTER_SALE_STATUS.REFUSE) {
    result.tips = orderDetail.value.refuseRemark || AFTER_SALE_STATUS_TIPS[status];
  }

  if (status === AFTER_SALE_STATUS.PENDING_FILL_UP_LOGISTIC) {
    result.title = '退款申请已通过';
  }

  if (logs && logs.operatorType === AfterSaleOperatorType.USER && logs.action === ActionType.CANCEL) {
    result.tips = '已取消';
  }

  if (type) {
    if (showSalesReturn.value && orderDetail.value?.fillUpTime) {
      result.title = '买家已退货待确认收货';
    }

    if (
      logs.operatorType === AfterSaleOperatorType.SYSTEM ||
      (orderDetail.value.status === AFTER_SALE_STATUS.CLOSE && orderDetail.value?.logs.length === 0)
    ) {
      result.title = '已取消';
      result.tips = '未在规定时间内提交物流单号自动拒绝退款';
    }
  }

  return result;
});

const orderItems = computed((): IOrderInfoItems[] => {
  const result: IOrderInfoItems[] = [];
  if (orderDetail.value?.orderItem) result.push(orderDetail.value?.orderItem);
  return result;
});

const showFooter = computed(() => {
  const status = orderDetail.value?.status;
  let result = '';
  if (
    status === AFTER_SALE_STATUS.PENDING ||
    status === AFTER_SALE_STATUS.PENDING_FILL_UP_LOGISTIC ||
    (status === AFTER_SALE_STATUS.PENDING_SHIPMENT && !orderDetail.value?.fillUpTime)
  ) {
    result = 'CANCEL';
  }
  if (status === AFTER_SALE_STATUS.CLOSE || status === AFTER_SALE_STATUS.REFUSE) {
    result = 'REAPPLY';
  }
  return result;
});

const showReturnInfo = computed(() => {
  return (showCountdown.value && showSalesReturn.value) || showSalesReturn.value || orderDetail.value?.fillUpTime;
});

/** 倒计时 */
const countdownTime = ref<any>('');
const logisticInfo = reactive({
  logisticCode: '',
  logisticNo: '',
});

const showCountdown = ref<boolean>(false);

onMounted(async () => {
  initData();
});

useDidShow(() => {
  getOrdersDetail();
});

onUnmounted(() => {
  useAfterSalesStore().setOrderItemInfo(null);
});

const initData = () => {
  if (isEmpty(orderItemInfo.value)) return;
  orderDetail.value = Object.assign({}, orderDetail.value, orderItemInfo.value);
};

const getOrdersDetail = async () => {
  try {
    const result = await getAftersalesDetailApi(afterSaleNo);
    orderDetail.value = result;

    logisticInfo.logisticCode = result.logisticCode;
    logisticInfo.logisticNo = result.logisticNo;

    infoLoaded.value = true;

    if (showSalesReturn.value && !result.fillUpTime) {
      hasCountdown();
    }
  } catch (error) {
    console.error('getOrdersDetail error=', error);
  }
};

const handleCancel = () => {
  showDelPop.value = true;
};

const handleReapply = async () => {
  const orderNo = orderDetail.value?.orderNo || '';
  // 设置订单状态(申请退款中使用)
  await useReversible.getOrderStatus(orderNo);
  await useReversible.getAfterSalesStatus(orderNo);

  Taro.redirectTo({
    url: `/packageA/pages/order/refund/refund?data=${JSON.stringify(orderItems.value)}`,
  });
};

const handleDelComfirm = async () => {
  showCountdown.value = false;
  try {
    const result = await aftersalesCancel(afterSaleNo);
    console.log('result: ', result);

    if (!result) return;
    Toast('取消成功');
    showDelPop.value = false;

    getOrdersDetail();
  } catch (error) {
    Toast('取消失败');
    console.error('aftersalesCancel error=', error);
  }
};

const hasCountdown = () => {
  const arr: any = orderDetail.value?.logs.find(item => item.action === ActionType.APPROVE);
  countdownTime.value = arr?.createdAt || '';
  showCountdown.value = arr?.createdAt ? true : false;
};

const refreshData = () => {
  showCountdown.value = false;
  getOrdersDetail();
};
</script>

<style lang="scss" module>
.main {
  padding: 14px 15px;
  box-sizing: border-box;
  .top {
    border-radius: 8px;
    .top-item {
      .title {
        color: $Primary;
        font-family: 'FZLanTingHei-R-GBK';
      }
      .tips {
        font-size: 14px;
        font-weight: 400;
        color: $Tertiary;
      }
    }
  }
  .mg_bottom {
    margin-bottom: 12px;
  }
  .center {
    border-radius: 8px;
  }
  .category-title {
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    line-height: 18px;
  }
  .box_width {
    width: 100%;
  }
}
.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  min-height: 60px;
  background: #fff;
  z-index: 100;
  padding: 10px 8px 7px 8px;
  border-radius: 28px 28px 0px 0px;
  background: var(--bottom, rgba(165, 165, 165, 0.08));
  box-shadow: 0px 0px 16px 16px rgba(165, 165, 165, 0.15) inset;
  backdrop-filter: blur(8px);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .btn {
    // margin-top: 10px;
    width: 175.5px;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    border-radius: 20px;
    border: 1px solid var(--tertiary, #a5a5a5);
    background: transparent;
    &_width {
      width: 359px;
    }
  }

  .safe {
    width: 100%;
    height: 10px;
  }
}
</style>
