<template>
  <view class="container" :class="$style.layout">
    <view :class="$style.user">
      <UserInfoItem v-model:show-login-pop="showLoginPop" />
    </view>
    <scroll-view
      :class="$style.info"
      :style="{ height: scrollHeight }"
      :scroll-y="true"
      :enhanced="true"
      :enable-passive="true"
      :scroll-with-animation="true"
      :show-scrollbar="false"
      @scrolltolower="scrollReachBottom"
    >
      <view :class="$style.main" class="nut-flex-1 nut-flex-col">
        <view :class="$style.main_task" v-if="taskList.length > 0">
          <view :class="$style.title" class="f_s-16">今日任务</view>
          <view class="nut-flex-1 nut-flex-col nut-row-left nut-col-top">
            <TaskItem
              v-model:show-login-pop="showLoginPop"
              v-for="task in taskList"
              :key="task.id"
              :task="task"
              @siginIn="handleSignin"
            />
          </view>
        </view>
        <view :class="$style.tasb" v-if="productList.length > 0">
          <nut-tabs
            class="pointmall_tabs"
            v-model="tabIndex"
            title-scroll
            name="tabName"
            size="large"
            auto-height
            @change="handleChangeTabs"
          >
            <block v-for="(item, index) in productList" :key="index">
              <nut-tab-pane :title="item.className" :pane-key="index">
                <view :class="$style.goods" class="nut-flex nut-flex-wrap nut-row-between nut-col-top">
                  <view
                    :class="$style.goods_list"
                    class="nut-flex-col nut-row-left nut-col-top"
                    v-for="goods in item.list"
                    @tap="gotoGoodsDetailPage(goods)"
                    :key="goods.goodsInfo.id"
                  >
                    <image
                      :class="$style.image"
                      class="border-05px-box-0"
                      :src="goods.goodsInfo.image"
                      mode="aspectFill"
                    ></image>
                    <view class="nut-flex-1 nut-line-1 f_s-14" :class="$style.name">{{ goods.goodsInfo.name }}</view>
                    <view
                      class="nut-flex-1 nut-line-2 nut-flex nut-row-left nut-col-baseline"
                      :class="$style.point_box"
                    >
                      <text class="f_w-500 numfnt-medium" :class="$style.point"
                        >{{ minItem(goods.goodsInfo.skus).pointMallSaleData.point }}
                      </text>
                      <text class="f_s-14">小火苗</text>
                      <block v-if="minItem(goods.goodsInfo.skus).pointMallSaleData.price > 0">
                        <text class="f_w-500 numfnt-medium" :class="$style.point">
                          + {{ minItem(goods.goodsInfo.skus).pointMallSaleData.price }}</text
                        >
                        <text class="f_s-14">元</text>
                      </block>
                    </view>
                  </view>
                </view>
              </nut-tab-pane>
            </block>
          </nut-tabs>
        </view>
        <view class="tabbar-placeholder"></view>
      </view>
    </scroll-view>
    <PopLogin v-model:is-show="showLoginPop" :target="loginTarget" />
    <PopSignInResult v-model:show="showSignInResultPop" :rewards="signinResultData" :show-detail-btn="true" />
  </view>
</template>
<script setup lang="ts">
import { IPointGoodsInfo } from '@/api-old/model/goods';
import { getDailySigninApi } from '@/api/daily';
import { getConfigs, getPointList } from '@/api/points';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import { ISigninMonthData, ISigninRewardsData } from '@/dto/daily';
import { IMissions } from '@/dto/missions';
import { IPointsGoodsInfo } from '@/dto/point'; // pointMallType
import useLoginPop from '@/hook/useLoginPop';
import PopSignInResult from '@/packageA/pages/signin/components/PopSignInResult.vue';
import { useAppStore, useMissionsStore, usePointStore, useSigninStore } from '@/stores';
import { Toast, cdnurl, shareOptions } from '@/utils';
import { ELinkflowEventsName, IEventsName, ILinkflowEventsProps, tarckEvents } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp, useDidHide, useDidShow, useShareAppMessage } from '@tarojs/taro';
import { startOfMonth } from 'date-fns';
import { cloneDeep } from 'lodash';
import { computed, onMounted, ref } from 'vue';
import UserInfoItem from './../mine/components/UserInfoItem.vue';
import TaskItem from './components/TaskItem.vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();

const path = 'packageA/pages/pointmall/pointmall';
const appStore = useAppStore();
const missionsStore = useMissionsStore();
const signinStore = useSigninStore();

const bgImg = `url(${cdnurl('static/member_bg3.png')})`;
const tabIndex = ref<number>(0);
const productList = ref<IPointGoodsInfo[]>([]);

const listParams = ref({ page: 1, perPage: 20, group: '' });
const finished = ref(false);
const showSignInResultPop = ref(false);
const signinResultData = ref<ISigninRewardsData[]>([]);

const scrollHeight = computed((): string => `calc(100vh - 270px)`);
const taskList = computed(() => missionsStore.missionsInPoint);

const minItem = computed(() => {
  return items => {
    return items.reduce(
      (min, current) => (current.pointMallSaleData.point < min.pointMallSaleData.point ? current : min),
      items[0],
    );
  };
});

const scrollReachBottom = () => {
  load();
};

onMounted(async () => {
  await fetchGroups();
});

useDidShow(async () => {
  onRegisterEvent();
  await useSigninStore().load(startOfMonth(new Date()).toISOString());
  missionsStore.load(); // 任务列表
  usePointStore().load(); // 实时更新积分

  appStore.setShowTabbar(true);
  appStore.setSelected(3);
});

useDidHide(() => {
  appStore.sysInfo.platform === 'android' ? appStore.setSelected(-1) : '';
  offRegisterEvent();
});

useShareAppMessage(() => {
  const shareReturn = shareOptions({ page: '/pages/pointmall/pointmall' });
  console.debug('pointmall page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});

// 获取分组
async function fetchGroups() {
  let result;

  try {
    result = await getConfigs();
  } catch (e) {
    console.error('getConfigs err=', e);
  }

  const groups = result.groups;
  listParams.value.group = groups[0].name;

  if (groups.length < 1) return;
  init();

  for (const iterator of groups) {
    const obj = { className: iterator.name, id: iterator.id, list: [] };
    productList.value.push(obj);
  }
}

// 获取积分商品列表
async function load() {
  if (finished.value) return;

  let result;

  try {
    result = await getPointList(listParams.value);
  } catch (e) {
    console.error('getPointList page load err=', e);
  }

  if (!result) return;

  const list = result.list || [];
  if (list.length < listParams.value.perPage) {
    finished.value = true;
  }

  const data = productList.value[tabIndex.value];

  if (listParams.value.page === 1) {
    data.list = list;
  } else {
    data.list = data.list.concat(list);
  }

  listParams.value.page! += 1;
  // isLoading.value = true;
}

// 初始化页面的数据
async function initPageData() {
  finished.value = false;
  listParams.value.page = 1;
}

async function init() {
  initPageData();
  await load();
}

function handleChangeTabs() {
  // const { title = '' } = event;
  // tarckEvents([{ path, event: IEventsName.GOODS_CL, properties: { name: `${title}`, desc: '点击积分商品系列' } }]);
  onTrack();

  listParams.value.group = productList.value[tabIndex.value].className;
  init();
}

function gotoGoodsDetailPage(item: IPointsGoodsInfo) {
  tarckEvents([
    {
      path,
      event: IEventsName.GOODS_CL,
      properties: { name: item.goodsInfo.name, goodsId: +item.goodsInfo.id, desc: '进入积分商详' },
    },
  ]);
  Taro.navigateTo({
    url: `/packageA/pages/pointGoodsDetail/pointGoodsDetail?id=${item.goodsInfo.id}&promotionId=${item.promotion}`,
  });
}

const onTrack = () => {
  if (!linkflow) return;
  if (!productList.value[tabIndex.value]) return;
  const { className: productSubdivide = '', id: productSubdivideId = '' } = productList.value[tabIndex.value];
  linkflow.track({
    event: ELinkflowEventsName.ProductDetail_Sort,
    props: {
      productSort: 'Zippo积分商品',
      productSubdivide,
      productSubdivideId,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};

async function handleSignin(data) {
  try {
    const result = await getDailySigninApi();
    showSignInResultPop.value = true;
    signinResultData.value = result.rewards;

    onTaskSignInTrack(data);
    // 更新签到记录信息
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0).toISOString();
    const info: ISigninMonthData = cloneDeep(signinStore.getSigninDatas[currentMonth]);
    info.days.push({ signInDate: result.signInDate, isSignIn: true });
    signinStore.setSigninData(currentMonth, info);
  } catch (err) {
    Toast(err.message);
  }
}

const onTaskSignInTrack = (data: IMissions) => {
  if (!linkflow) return;
  const { id, name } = data;
  linkflow.track({
    event: ELinkflowEventsName.InteractiveTask_Click,
    props: { taskName: name, taskId: `${id}`, taskStatus: '已完成', triggerPagePath } as ILinkflowEventsProps,
  });

  linkflow.track({
    event: ELinkflowEventsName.InteractiveTask_Complete_ReceiveAward,
    props: { taskName: name, taskId: `${id}`, receiveWay: '手动领取', triggerPagePath } as ILinkflowEventsProps,
  });
};
</script>
<style lang="scss">
.pointmall_tabs {
  width: 327px;

  .nut-tabs__titles {
    background-color: $white;
    border-bottom: 0.5px solid $Divide;
  }

  .nut-tabs__titles.scrollable .nut-tabs__titles-item {
    width: 82px;
    &:last-child {
      width: 0;
    }
  }
  .nut-tabs__titles-item {
    color: $Tertiary;
    padding: 24px 0 8px;
    &.active {
      color: $Primary;
      .nut-tabs__titles-item__line {
        width: 0;
        height: 0;
      }
    }
    .nut-tabs__titles-item__text {
      font-size: 12px;
      z-index: 1;
    }
  }

  .nut-tabs__content {
    .nut-tab-pane {
      padding: 0;
    }
  }
}
</style>
<style lang="scss" module>
.layout {
  background: v-bind(bgImg);
  background-size: 375px 812px;
  background-repeat: no-repeat;
  .user {
    width: 375px;
    height: 262px;
    padding: 116px 32px 32px;
    margin-bottom: 8px;
  }
  .info {
    width: 359px;
    padding: 16px;
    background: $white;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 4px 10px 0 rgba(165, 165, 165, 0.65);
    margin: 0 auto;
  }
  .main {
    width: 100%;
    &_task {
      .title {
        width: 327px;
        height: 40px;
        line-height: 40px;
        margin-bottom: 8px;
      }
    }
    .goods {
      width: 327px;
      min-height: 233px;
      &_list {
        width: 159px;
        min-height: 231px;
        margin: 8px 0 16px;
        .point_box {
          width: 159px;
        }
        .image {
          width: 159px;
          height: 177px;
          margin-bottom: 12px;
        }
        .name {
          line-height: 20px;
          margin-bottom: 4px;
        }

        .point {
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
