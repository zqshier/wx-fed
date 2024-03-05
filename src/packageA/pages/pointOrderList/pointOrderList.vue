<template>
  <BackgroundImage>
    <CustomBar title="积分订单" />

    <view
      :class="$style.main"
      class="iphone-end nut-flex-col nut-col-center nut-row-center"
      v-if="pointOrderList && isLoading"
    >
      <view v-if="pointOrderList.length > 0">
        <view
          v-for="(item, index) in pointOrderList"
          :key="index"
          @tap="goOrderDetail(item.orderInfo.orderNo)"
          :class="$style['product-warp']"
          class="box nut-flex mg-bottom-16"
        >
          <image
            mode="aspectFill"
            :src="item.orderInfo?.orderItems[0].goodsInfo.image || item.image"
            :class="$style.info_img"
            class="border-05px-box-0"
          ></image>
          <view :class="$style['info-warp']" class="nut-flex-col">
            <!-- 商品名称 -->
            <view :class="$style['info-warp_top']" class="nut-flex nut-col-top nut-row-between">
              <text :class="$style['top_title']" class="f_s-16 f_w-600 nut-line-1">{{ item.title }}</text>
              <text :class="$style['top_status']" class="f_s-12 nut-flex-1">{{
                ORDER_STATUS_TEXT[item.orderInfo?.status]
              }}</text>
            </view>

            <!-- 地址 -->
            <view
              :class="$style['info-warp_middle']"
              class="f_s-12"
              v-if="item.orderInfo && item.orderInfo.deliverAddr"
            >
              <view>
                <text :class="$style['middle_name']">{{ item.orderInfo.deliverAddr?.name }}</text>
                <text class="numfnt">{{ item.orderInfo.deliverAddr?.phone }}</text>
              </view>
              <view :class="$style['middle_address']" class="nut-line-1"
                >{{ item.orderInfo.deliverAddr?.provinceName }}{{ item.orderInfo.deliverAddr?.cityName
                }}{{ item.orderInfo.deliverAddr?.districtName }}{{ item.orderInfo.deliverAddr?.address }}</view
              >
            </view>

            <!-- 物流单号 -->
            <view :class="$style['info-warp_end']" class="f_s-10" v-if="item.orderInfo?.parcelItems[0]?.logisticNo">
              <text>运单号：</text><text class="numfnt">{{ item.orderInfo.parcelItems[0]?.logisticNo }}</text>
              <image
                :class="$style.copy_image"
                src="@/static/icon/copy.png"
                @tap.stop="handleCopy(item.orderInfo.parcelItems[0]?.logisticNo)"
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view
        :class="$style.empty_box"
        class="nut-flex nut-flex-1 nut-flex-col nut-col-center nut-row-center"
        v-if="pointOrderList.length === 0"
      >
        <DefaultPage
          imgWidth="48"
          imgHeight="48"
          imgMbottom="24"
          tip="空空如也，快去兑换商品吧"
          :showBtn="true"
          :icon="cdnurl('static/no-order.png')"
          url="/pages/pointmall/pointmall"
        />
      </view>
    </view>

    <Loading :show="!isLoading" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { useDidShow, useReachBottom } from '@tarojs/taro';
import { reactive, ref } from 'vue';
import { Toast, cdnurl } from '@/utils';
import Loading from '@/components/Loading/Loading.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import { IPointGoodsExchange } from '@/dto/point';
import { getExchangeList } from '@/api/points';
import { ORDER_STATUS_TEXT } from '@/constants';
import Taro from '@tarojs/taro';

const isLoading = ref<boolean>(false);
const pointOrderList = ref<IPointGoodsExchange[]>();

const listParams = reactive({
  page: 1,
  perPage: 20,
});
const finished = ref(false);

useDidShow(async () => {
  await init();
});

const loadList = async () => {
  if (finished.value) return;

  let result;

  try {
    result = await getExchangeList(listParams);
  } catch (error) {
    console.error('loadList error=', error);
  }

  if (!result) return;
  const { list } = result;

  if (list.length < listParams.perPage!) {
    finished.value = true;
  }

  if (listParams.page === 1) {
    pointOrderList.value = list;
  } else {
    pointOrderList.value = pointOrderList.value?.concat(list);
  }

  listParams.page! += 1;
  isLoading.value = true;
};

useReachBottom(() => {
  loadList();
});

// 初始化页面的数据
const initPageData = () => {
  finished.value = false;
  listParams.page = 1;
};

const init = async () => {
  initPageData();
  await loadList();
};

function goOrderDetail(orderNo) {
  Taro.navigateTo({
    url: `/packageA/pages/order/orderDetails/orderDetails?orderNo=${orderNo}`,
  });
}

function handleCopy(logisticsId) {
  if (!logisticsId) return;
  Taro.setClipboardData({
    data: logisticsId,
    success() {
      Toast('快递单号已复制');
    },
  });
}
</script>

<style lang="scss" module>
.main {
  padding: 16px;
  .product-warp {
    width: 343px;
    height: 122px;
    box-sizing: border-box;
    background: $white;
    border-radius: 8px;
  }
  .info_img {
    margin-right: 16px;
    width: 90px;
    height: 90px;
    // background: $white;
    background: #d9d9d9;
  }
  .info-warp {
    // width: 100%;
    // height: 74px;
    width: 205px;
    height: 90px;
    &_top {
      margin-bottom: 8px;
      .top_title {
        width: 152px;
        color: $Primary;
        line-height: 24px;
      }
      .top_status {
        color: $Tertiary;
        text-align: right;
        line-height: 18px;
      }
    }
    &_middle {
      .middle_name {
        color: $Primary;
        margin-right: 8px;
        line-height: 18px;
      }
      .middle_address {
        width: 100%;
        color: $Tertiary;
        line-height: 18px;
        margin-bottom: 8px;
      }
    }
    &_end {
      color: $Tertiary;
      line-height: 14px;
      .copy_image {
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }
  }
  .empty_box {
    margin-top: 176px;
    width: 100%;
    height: 100%;
  }
}
</style>
