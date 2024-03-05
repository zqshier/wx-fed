<template>
  <scroll-view class="container" :class="$style.layout" :scroll-y="false">
    <view :class="$style.user">
      <UserInfoItem v-model:show-login-pop="showLoginPop" @track="onTrack" />
    </view>
    <scroll-view
      :class="$style.info"
      :style="{ height: scrollHeight }"
      :scroll-y="true"
      :enhanced="true"
      :enable-passive="true"
      :scroll-with-animation="true"
      :show-scrollbar="false"
    >
      <view :class="$style.info_item" v-for="item in infoData" :key="item.name">
        <view :class="$style.title" class="f_s-16 nut-flex nut-row-between">
          <text>{{ item.name }}</text>
          <view
            v-if="item.name === '我的订单'"
            :class="$style.link"
            class="nut-flex nut-row-between nut-col-center"
            @tap="gotoOrderListPage"
          >
            <text class="f_s-14">全部订单</text>
            <image class="icon-right" src="../../static/icon/arrowLeft.png"></image>
          </view>
        </view>
        <nut-row
          type="flex"
          flex-wrap="wrap"
          :class="[$style.list_box, item.name === '我的服务' ? $style.server_list_box : '']"
          :justify="item.list.length === 5 ? 'space-around' : 'start'"
        >
          <nut-col
            :class="$style.list"
            class="nut-flex-col nut-row-center nut-col-center"
            :span="item.list.length === 5 ? 4 : 6"
            v-for="itm in item.list"
            :key="itm.name"
            @tap="gotoPage(itm, item.name)"
          >
            <block v-if="itm.name !== '专属客服'">
              <view :class="$style.icon_box">
                <image :src="itm.icon" :class="$style.icon"></image>
                <view v-if="itm.redDot" :class="$style.dot"></view>
              </view>
              <text>{{ itm.name }}</text>
            </block>

            <button v-else shape="square" plain open-type="contact" :class="[$style.icon_box, $style.service]">
              <view :class="$style.icon_box">
                <image :src="itm.icon" :class="$style.icon"></image>
                <view v-if="itm.redDot" :class="$style.dot"></view>
              </view>
              <text :class="$style.service_text" class="f_s-12">专属客服</text>
            </button>
          </nut-col>
        </nut-row>
      </view>

      <view :class="$style.info_bottom" class="nut-flex-col nut-row-center nut-col-center" @tap="gotoArticlePage">
        <image :class="$style.logo" src="../../static/icon/logo_circle.png"></image>
        <image :class="$style.icon_up" src="../../static/icon/arr-s.png"></image>
        <text>点击前往微信</text>
        <text>关注 ZIPPO 中国</text>
      </view>
      <view class="tabbar-placeholder"></view>
    </scroll-view>
    <PopLogin v-model:is-show="showLoginPop" :target="loginTarget" />
    <PopSubscribImg v-model:show="showSubscribPop" />
  </scroll-view>
</template>

<script setup lang="ts">
import { getMemberRightsApi } from '@/api/member';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
// import { IGeneralInfo } from '@/dto/order';
import { IMemberRights, IMemberRightsType } from '@/dto/member';
import useLoginPop from '@/hook/useLoginPop';
import { useAppStore, useMissionsStore, useOrderStore, usePointStore, useSigninStore, useUserStore } from '@/stores';
import { LinkType, cdnurl, handleLink, openCustomerServiceChat } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getApp, useDidHide, useDidShow } from '@tarojs/taro';
import { startOfMonth } from 'date-fns';
import { computed, onMounted, ref, watchEffect } from 'vue';
import PopSubscribImg from './components/PopSubscribImg.vue';
import UserInfoItem from './components/UserInfoItem.vue';
import { infoData as data } from './data';

const linkflow = getApp()[`${process.env.APP_ID}`];

const {
  visible: showLoginPop,
  target: loginTarget,
  onRegisterEvent,
  offRegisterEvent,
  checkMemberLevel,
} = useLoginPop();

const missionsStore = useMissionsStore();
const userStore = useUserStore();

const bgImg = `url(${cdnurl('static/member_bg3.png')})`;
const contentImg = `url(${cdnurl('static/event_list_bg.png')})`;

// const userInfo = computed((): UserInfo => userStore.getUserInfo!);
// const getMemberLevel = computed((): Boolean => !!userInfo.value.memberLevel);
const infoData = ref(data);
const scrollHeight = computed((): string => `calc(100vh - 270px)`);
const showSubscribPop = ref(false);
// const generalInfo = computed((): IGeneralInfo => useOrderStore().getOrderGeneralInfo);
const remindeds = computed(() => userStore.getMemberRightsRemindeds);

watchEffect(() => {
  for (const item of infoData.value) {
    // 各状态订单信息
    if (item.name === '我的订单') {
      // const _generalInfo = generalInfo.value;
      // console.debug('mine watchEffect generalInfo=', _generalInfo);
      // for (const l of item.list) {
      //   l.name === '待付款' && (l.redDot = _generalInfo.pendingPaidCount > 0);
      //   l.name === '待评价' && (l.redDot = _generalInfo.pendingCommentCount > 0);
      // }
      item.list = userStore.getOrderList;
    }
    // 今日是否签到
    if (item.name === '我的服务') {
      item.list = missionsStore.missionsInMine;
    }

    // 会员权益小红点
    if (remindeds.value && remindeds.value[item.name]) {
      for (const s of item.list) {
        const hasRemindedItem = remindeds.value[item.name].find(i => i.code === s.code);
        hasRemindedItem?.code && (s.redDot = false);
      }
    }
  }
});

onMounted(async () => {
  missionsStore.load();
  getMemberRights();
});

useDidShow(async () => {
  onRegisterEvent();
  useAppStore().setShowTabbar(true);
  useAppStore().setSelected(4);
  useOrderStore().getGeneralInfoApi();

  usePointStore().load(); // 实时更新积分
  useSigninStore().load(startOfMonth(new Date()).toISOString());
  // documentStore.loadWxoaArticle().then(link => {
  //   article.value = link;
  // });
});

useDidHide(() => {
  useAppStore().sysInfo.platform === 'android' ? useAppStore().setSelected(-1) : '';
  offRegisterEvent();
});

function gotoPage(item, title) {
  if (item.name !== '专属客服') {
    checkMemberLevel(`会员中心${title}`, () => gotoPage(item, title));
  }
  // if (!userStore.isMemberLevel) {
  //   openLoginPop();
  //   return;
  // }

  if (!['我的服务', '我的订单'].includes(title) && item?.redDot)
    userStore.setMemberRightsRemindeds(title, { code: item.code, name: item.name, clickAt: Date.now() });

  onTrack({ modelName: title, buttonName: item.name });

  if (item.name === '专属客服') return openCustomerServiceChat();

  handleLink(item.type, item.url);

  // let desc = `进入${item.name}页面`;
  // if (title === '我的订单') desc = `进入${title}: ${item.name}`;
  // tarckEvents([{ path: 'pages/mine/mine', event: IEventsName.MINE_CL, properties: { desc } }]);
}

function gotoArticlePage() {
  onTrack({ modelName: '关注公众号弹窗', buttonName: '关注公众号' });
  showSubscribPop.value = true;
}

const getMemberRights = async () => {
  try {
    const { list } = await getMemberRightsApi();

    if (!list.length) return;

    for (const l of list) {
      const _list = l.rights.map(i => ({
        code: i.code,
        url: i.path,
        icon: i.image,
        name: i.name,
        type: LinkType.path,
        redDot: handleRightsRemind(l.name, i),
      }));
      const existIdx = infoData.value.findIndex(i => i.name === l.name);
      if (existIdx >= 0) {
        infoData.value[existIdx].list = _list;
      } else {
        infoData.value.push({ name: l.name, list: _list });
      }
    }
  } catch (error) {
    console.debug('getMemberRights error', error);
  }
};

const handleRightsRemind = (name: string, item: IMemberRights): boolean => {
  if (!item.remind) return false; // 设置为不提醒

  let remind = false;
  const clickedData = remindeds.value && remindeds.value[name] && remindeds.value[name].find(i => i.code === item.code); // 被点击过的数据
  const isClicked = !!clickedData?.code;

  const nowTime = Date.now();
  const [startAt, endAt] = item?.remindAt || [];
  // 红点类型 只亮一次
  if (item?.remindType && item.remindType === IMemberRightsType.once) {
    // 判断当前时间在提醒时间范围内 没有被点击过
    if (!isClicked && new Date(startAt).getTime() < nowTime && nowTime < new Date(endAt).getTime()) remind = true;
  }

  // 红点类型 每天一次
  if (item?.remindType && item.remindType === IMemberRightsType.daily) {
    // 判断当前时间在提醒时间范围内 没有被点击过
    if (!isClicked && new Date(startAt).getTime() < nowTime && nowTime < new Date(endAt).getTime()) remind = true;
    // 每日更新 00:00:00 重新出现红点 判断记录时间小于0点且现在时间大于0点 来确定已过0点
    if (clickedData?.clickAt) {
      const Time24 = new Date().setHours(0, 0, 0, 0);
      if (Time24 > clickedData.clickAt && nowTime >= Time24) remind = true;
    }
  }

  // 缓存存在已被点击过 并且当前允许提示 清除缓存点击记录
  // console.debug('handleRightsRemind item=', item);
  // console.debug('handleRightsRemind clickedData=', clickedData);
  // console.debug('handleRightsRemind remind=', remind);
  if (isClicked && remind) {
    const values = remindeds.value![name].filter(n => n.code !== item.code);
    console.debug('updateMemberRightsRemindeds values=', values);
    userStore.updateMemberRightsRemindeds(name, values);
  }

  return remind;
};

const onTrack = (item: { modelName: string; buttonName: string }) => {
  if (!linkflow) return;
  const { modelName = '', buttonName = '' } = item;
  // 埋点 会员中心_页面点击
  linkflow.track({
    event: ELinkflowEventsName.MemberCenter_Page_Click,
    props: { modelName, buttonName } as ILinkflowEventsProps,
  });
};

const gotoOrderListPage = () => {
  checkMemberLevel(`我的订单`, () => {
    onTrack({ modelName: '我的订单', buttonName: '全部订单' });
    handleLink(LinkType.path, '/packageA/pages/order/orderList/orderList');
  });
};
</script>
<style lang="scss" module>
.layout {
  position: relative;
  height: 100vh;
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
    padding: 16px 16px 0 16px;
    border-radius: 24px 24px 0px 0px;
    box-shadow: 0px 4px 10px 0px rgba(165, 165, 165, 0.65);
    margin: 0 auto;
    background: v-bind(contentImg) no-repeat;
    background-position: left top;
    background-size: 100% 100%;
    background-attachment: fixed;
    &_item {
      width: 100%;
      border-bottom: 0.5px solid $Divide;
      margin-bottom: 8px;
      .title {
        width: 100%;
        height: 40px;
        margin-bottom: 8px;
        .link {
          color: $Tertiary;
        }
      }
      .list_box {
        width: 100%;
        min-height: 62px;
        .list {
          margin-bottom: 16px;
          .icon_box {
            position: relative;

            .icon {
              width: 24px;
              height: 24px;
              margin-bottom: 4px;
            }
            .dot {
              position: absolute;
              top: -2px;
              right: -2px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: $Brand;
            }
          }
          .service {
            padding: 0;
            margin: 0;
            background-color: transparent;
            box-shadow: none;
            color: $Primary;
            font-size: 12px;
            font-family: 'FZLanTingHei-R-GBK';
            font-style: normal;
            font-weight: 400;
            display: flex;
            flex-flow: column;
            align-items: center;
            overflow: initial;
            height: 46px;
            line-height: initial;
            &::after {
              border: none;
            }
            &_text {
              line-height: initial;
            }
          }
        }
      }
      .server_list_box {
        margin-bottom: -8px;
        .list {
          margin-bottom: 24px;
        }
      }
    }

    &_bottom {
      width: 100%;
      height: 156px;
      line-height: 18px;
      margin-top: 8px;
      .logo {
        width: 48px;
        height: 48px;
        border: 1px solid $Primary;
        border-radius: 50%;
        margin-bottom: 8px;
      }
      .icon_up {
        width: 12px;
        height: 12px;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
