<template>
  <view class="container">
    <CustomBar title="我的订单" />

    <view :class="$style.tabs_layout" class="nut-flex nut-flex-col nut-col-top nut-row-left">
      <view :class="$style.tabs" class="nut-flex nut-row-between">
        <block v-for="(item, index) in tabsList" :key="item.id">
          <view :class="$style.tabs_item" class="nut-flex-col nut-row-center nut-col-center" @tap="tabsChange(index)">
            <view :class="[$style.item_name, curIndex === index ? $style['item_name-on'] : '']" class="f_s-12">{{
              item.name
            }}</view>
          </view>
        </block>
      </view>
      <swiper
        :class="$style.swiper_box"
        :current="swiperCurrent"
        @change="swiperChange"
        @animationfinish="animationfinish"
      >
        <block v-for="item in tabsList" :key="item.id">
          <swiper-item :class="$style.swiper_item" class="">
            <scroll-view
              :class="$style['swiper_item-view']"
              :scroll-y="true"
              :scroll-top="scrollTop"
              :enhanced="true"
              :enable-passive="true"
              :show-scrollbar="false"
              @scroll="handleScroll"
              @scrolltolower="scrollReachBottom"
            >
              <view :class="$style.empty_box" class="nut-flex nut-row-center" v-if="!isLoading">
                <Loading1 />
              </view>
              <!-- 列表 -->
              <view :class="$style.page_box" v-if="isLoading && listData && listData[item.id]?.length > 0">
                <block v-for="itm in listData[item.id]" :key="itm.id">
                  <view :class="$style['page_box-item']">
                    <ProductItem :data="itm" :tabsId="item.id" />
                  </view>
                </block>
              </view>
              <view
                :class="$style.empty_box"
                class="nut-flex nut-flex-col nut-col-center"
                v-if="isLoading && listData && listData[item.id]?.length === 0"
              >
                <DefaultPage
                  imgWidth="48"
                  imgHeight="48"
                  imgMbottom="16"
                  tip="暂无相关订单"
                  :icon="cdnurl('static/no-order.png')"
                />
              </view>
            </scroll-view>
          </swiper-item>
        </block>
      </swiper>
    </view>
  </view>

  <PopOrderCancelBox v-model:show="showCancelBox" :orderNo="orderCdata.orderNo" @refresh="handleRefresh" />
</template>
<script setup lang="ts">
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { ref, nextTick, computed, onMounted, onUnmounted, reactive } from 'vue';
import { isEmpty, cloneDeep } from 'lodash';
import { useOrderStore } from '@/stores';
import { IOrderListParams, IOrderInfo } from '@/dto/order';
import { Toast, cdnurl } from '@/utils';
import { ORDER_STATUS, TARGET_ORDER_CANCEL_POP } from '@/constants';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import { Loading1 } from '@nutui/icons-vue-taro';
import ProductItem from './components/ProductItem/ProductItem.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';

const router = useRouter();
const orderStore = useOrderStore();
const buttonRes = Taro.getMenuButtonBoundingClientRect();
const nabbarHeight = `${buttonRes.bottom + 8}px`;

const tabsList = ref([
  { name: '全部', id: 'all' },
  { name: '待付款', id: ORDER_STATUS.PENDING_PAID },
  { name: '待发货', id: ORDER_STATUS.PENDING_SHIPMENT },
  { name: '待收货', id: ORDER_STATUS.PENDING_RECEIPT },
  { name: '待评价', id: ORDER_STATUS.PENDING_COMMENT },
]);
const feedStatus = ref(router.params.feedStatus || '');
const curIndex = ref<number>(0);
const swiperCurrent = ref<number>(0);
const scrollTop = ref<number>(0);
const old = ref<{ scrollTop: number }>({ scrollTop: 0 });
const page = ref<number>(0);
const perPage = ref<number>(10);
// const showLoading = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const showCancelBox = ref<boolean>(false);
const finished = ref<boolean>(false);
const orderCdata = reactive<{ orderNo: string }>({ orderNo: '' });

const listData = computed(() => {
  return orderStore.getOrdersList;
});

onMounted(() => {
  handleFeedStatus();
  initMount();
});

useDidShow(async () => {
  // 如果页面从新进入，page>0,需要拉 page * 10的数据
  if (page.value > 0) {
    perPage.value = page.value * perPage.value;
    await init();
    perPage.value = 10;
  } else {
    await init();
  }
});

onUnmounted(() => {
  // 卸载监听事件
  Taro.eventCenter.off(TARGET_ORDER_CANCEL_POP);
});

const handleFeedStatus = () => {
  if (!feedStatus.value) return;
  tabsList.value.forEach((item, index) => {
    if (item.id === feedStatus.value) {
      swiperCurrent.value = index;
      curIndex.value = index;
    }
  });
};

const initMount = () => {
  Taro.eventCenter.on(TARGET_ORDER_CANCEL_POP, arg => {
    showCancelBox.value = true;
    orderCdata.orderNo = arg.orderNo;
  });
};

const init = async () => {
  initPageData();
  // useOrderStore().getGeneralInfoApi();
  await getListFactory();
};

// 初始化页面的数据
const initPageData = () => {
  finished.value = false;
  page.value = 0;

  if (isEmpty(listData.value[tabsList.value[swiperCurrent.value].id])) {
    isLoading.value = false;
    orderStore.setOrderList(tabsList.value[swiperCurrent.value].id, []);
  } else {
    isLoading.value = true;
  }
};

const getListFactory = async () => {
  // 如果已经全部加载完成直接终止执行
  if (finished.value) {
    Toast('没有更多了');
    return;
  }
  page.value++;
  await getList();
};

const getList = async () => {
  // if (showLoading.value) Taro.showLoading({ title: '正在加载' });
  try {
    const _index: number = swiperCurrent.value;
    const _page: number = page.value;
    const orderStatus: string = tabsList.value[_index].id;
    const params: IOrderListParams = {
      orderStatus: orderStatus === 'all' ? '' : orderStatus,
      page: _page,
      perPage: perPage.value,
      source: '',
      orderNo: '',
      serveStatus: '',
    };
    const { list, total = 0 } = await orderStore.getOrdersListApi(params);

    const orderPayedList = orderStore.getOrderPayedList;
    if (orderStatus === ORDER_STATUS.PENDING_PAID && orderPayedList?.length) {
      // 待付款情况下，判断已存已付款订单是否数据状态未更新
      list.splice(
        list.findIndex(item => orderPayedList.indexOf(item.orderNo) > -1),
        1,
      );
    }

    if (_page > 1) {
      const new_list: IOrderInfo[] = cloneDeep(listData.value[orderStatus]);
      orderStore.setOrderList(orderStatus, new_list.concat(list) || []);
    } else {
      orderStore.setOrderList(orderStatus, list);
    }

    isLoading.value = true;

    if (listData.value[orderStatus].length === total) {
      finished.value = true;
      return;
    }
  } catch (e) {
    console.error('_getList e=', e);
    // if (showLoading.value) Taro.hideLoading();
  }
  //  finally {
  //   if (showLoading.value) showLoading.value = false;
  // }
};

const handleRefresh = (status: string) => {
  listData.value[tabsList.value[swiperCurrent.value].id].forEach((item, index) => {
    if (item.orderNo === orderCdata.orderNo) {
      if (tabsList.value[swiperCurrent.value].id === 'all') {
        item.status = status;
      } else {
        listData.value[tabsList.value[swiperCurrent.value].id].splice(index, 1);
      }
    }
  });
  orderCdata.orderNo = '';
};

// tabs通知swiper切换
const tabsChange = (index: number) => {
  // isLoading.value = false;
  swiperCurrent.value = index;
  curIndex.value = index;
  scrollGoTop();
};

const swiperChange = e => {
  // isLoading.value = false;
  const current = e.detail.current;
  swiperCurrent.value = current;
  init();
};

// const gotoAftersalesPage = () => {
//   Taro.navigateTo({ url: '/packageA/pages/order/aftersales/aftersales' });
// };

// 回到顶部
const scrollGoTop = () => {
  scrollTop.value = old.value.scrollTop;
  nextTick(() => {
    scrollTop.value = 0;
  });
};

const scrollReachBottom = () => {
  getListFactory();
};

const handleScroll = e => {
  old.value.scrollTop = e.detail.scrollTop;
};

const animationfinish = e => {
  const current: number = e.detail.current;
  swiperCurrent.value = current;
  curIndex.value = current;
};

// defineExpose({ load });
</script>
<style lang="scss" module>
.tabs_layout {
  height: calc(100vh - v-bind(nabbarHeight));
  margin-top: 12px;
  .tabs {
    width: 343px;
    margin: 12px auto;
    margin-top: 0;
    border-bottom: 0.5px solid var(--divide, #d9d9d9);
    z-index: 2;
    &_item {
      width: 68px;
      height: 18px;
      padding: 12px 0 8px 0;
      box-sizing: content-box;
      // .img_box {
      //   position: relative;
      //   width: 32px;
      //   height: 32px;
      //   .image {
      //     width: 32px;
      //     height: 32px;
      //   }
      // }
      .item_name {
        color: $Tertiary;
        font-family: 'FZLanTingHei-R-GBK';
        &-on {
          color: $Primary;
          font-weight: 700;
        }
      }
    }
  }
  .swiper_box {
    width: 375px;
    flex: 1;
    max-height: 100%;
    .swiper_item {
      color: $Tertiary;
      height: 100%;
      &-view {
        width: 100%;
        height: 100%;
      }
      .page_box {
        &-item {
          padding-bottom: 18px;
        }
      }
      .empty_box {
        padding-top: 176px;
      }
    }
  }
}
</style>
