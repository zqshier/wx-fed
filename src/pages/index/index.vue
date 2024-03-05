<template>
  <scroll-view
    class="container"
    :class="$style.layout"
    :scroll-y="scrollY"
    :enhanced="true"
    :enable-passive="true"
    :scroll-top="scrollTop"
    :scroll-with-animation="true"
    :show-scrollbar="false"
    :upper-threshold="0"
    :lower-threshold="10"
    @scroll="handleScroll"
    @touchstart="startEvent"
    @touchmove="handleTouch"
    @scrolltoupper="handleScrolltoupper"
    @scrolltolower="handleScrolltolower"
  >
    <CustomBar
      fixedType="fixed"
      :backIconSlot="true"
      :bg-color="navSwitch ? '#fff' : 'transparent'"
      :isPlaceholder="false"
      :logo-color="navSwitch ? LogoColorType.BLACK : LogoColorType.WHITE"
    >
      <template v-slot:barLeft>
        <CustomNavBack
          :modes="[TYPE_PAGE.SEARCH, TYPE_PAGE.CART]"
          :line-color="navSwitch ? 'black' : 'white'"
          :icon-color="navSwitch ? '#000' : '#fff'"
        />
      </template>
    </CustomBar>

    <view :class="$style.main">
      <!-- banner轮播 -->
      <CustomSwiper
        v-if="topBanners.length > 0"
        usage="home"
        bg-color="#000"
        interval="5000"
        :height="bannerHeight"
        :list="topBanners"
        :autoplay="bannerAutoplay"
        :isTransition="true"
        :indicator-style="{ bottom: pxTransform(bannerKey ? 40 : 160) }"
        :lazy-load="false"
      />
      <!-- 福利 -->
      <view :class="$style.weal" id="wealBox">
        <WealBox />
      </view>
      <view :class="$style.topic" v-if="!loadingShown">
        <TopicGroup code="home1" :animationKey="navSwitch" />
      </view>
    </view>

    <view v-show="showBannerKey">
      <LottieView
        ref="homeDownRef"
        :class="$style.icon_down"
        :autoplay="true"
        :loop="true"
        assets-path="static/icon_home_down.json"
        :config="{ width: 20, height: 20 }"
        @tap="clickDown"
      />
    </view>

    <view
      class="nut-flex-col nut-row-center nut-col-center"
      :class="$style.backtop"
      @tap="scrollGoTop"
      :style="{ width: showBacktop ? 'auto' : 0 }"
    >
      <LottieView
        ref="homeUpRef"
        :class="$style.icon_backtop"
        :autoplay="true"
        :loop="true"
        assets-path="static/icon_home_up.json"
        :config="{ width: 20, height: 20 }"
      />
      <text class="f_s-12">回到顶部</text>
    </view>

    <view v-if="loadingShown">
      <Loading :show="loadingShown" />
    </view>

    <view
      v-if="isAddedToMyMinProgram.show"
      :class="$style.add_box"
      class="nut-flex nut-row-between"
      :style="{ top: isAddedToMyMinProgram.y, right: isAddedToMyMinProgram.x }"
    >
      <view :class="$style.t" class="nut-flex-1 f_s-10">
        <view class="nut-flex">
          点击“<image :class="$style.circle" src="../../static/icon/Union.png"></image>”添加到我的小程序，
        </view>
        微信首页下拉即可快速访问店铺
      </view>
      <view :class="$style.icon_close" class="nut-flex" @tap="isAddedToMyMinProgram.show = false">
        <image :class="$style.icon" src="../../static/icon/close-s.png"></image>
      </view>
    </view>
  </scroll-view>

  <PopLogin v-model:isShow="showLoginPop" :target="loginTarget" />
  <PopContainer code="shouyetanchuang" :show="isShowContainer" />
  <PopNewGift v-model:show="isShowNewGift" :data="newGiftInfo" @close="() => (showNewGiftPop = false)" />
  <PopBirthdayGift v-model:show="isShowBirthdayGift" :data="birGiftInfo" @close="() => (showBirthdayGiftPop = false)" />
  <PopUpgradeGift
    v-model:show="isShowUpgradeGift"
    :data="memberLevelUpInfo"
    @close="() => (showUpgradeGiftPop = false)"
  />
</template>
<script setup lang="ts">
import {
  birthdayGiftsApi,
  birthdayGiftsMarkApi,
  memberLevelUpApi,
  memberLevelUpMarkApi,
  newcomerGiftsApi,
} from '@/api/user';
import { LogoColorType } from '@/components/CustomBar/props';
import CustomNavBack, { TYPE_PAGE } from '@/components/CustomNavBack/CustomNavBack.vue';
import CustomSwiper from '@/components/CustomSwiper/CustomSwiper.vue';
import Loading from '@/components/Loading/Loading.vue';
import LottieView from '@/components/LottieView/LottieView.vue';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import { toPx } from '@/components/PosterBuilder/utils/tools';
import TopicGroup from '@/components/Topic/TopicGroup.vue';
import { IBirthdayGiftsInfo, IMemberLevelUpsInfo, INewComerGiftsInfo, UserInfo } from '@/dto/user';
import useLoginPop from '@/hook/useLoginPop';
import { useAppStore, useBannerStore, useCartStore, useUserStore } from '@/stores';
import { queryRect, shareOptions } from '@/utils';
import Taro, {
  nextTick,
  pxTransform,
  useDidHide,
  useDidShow,
  useReady,
  useRouter,
  useShareAppMessage,
} from '@tarojs/taro';
import { computed, onMounted, ref, watchEffect } from 'vue';
import PopBirthdayGift from './components/PopBirthdayGift.vue';
import PopContainer from './components/PopContainer.vue';
import PopNewGift from './components/PopNewGift.vue';
import PopUpgradeGift from './components/PopUpgradeGift.vue';
import WealBox from './components/WealBox.vue';

const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();

const bannerStore = useBannerStore();
const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();

let customBarInfo: Taro.getMenuButtonBoundingClientRect.Rect; // 导航栏信息
// const loadedTopBanners = ref(false);
const bannerAutoplay = ref<boolean>(true);
const bannerKey = ref<boolean>(false);
const scrollY = ref(false);
const navSwitch = ref(false);
const loadingShown = ref(true);
const touches = ref<{ startX: number; startY: number }>({ startX: 0, startY: 0 });
const scrollTop = ref<number>(0);
const oldScroll = ref<{ scrollTop: number }>({ scrollTop: 0 });
const showBacktop = ref(false);
const isAddedToMyMinProgram = ref({ x: '0rpx', y: '0rpx', show: false });
// const valiCode = ref(''); // 扫码验证code
const wealBoxInfo = ref<any>({}); // 金刚区信息
const homeUpRef = ref();
const homeDownRef = ref();
const showContainerPop = ref<boolean>(false);
const showNewGiftPop = ref<boolean>(false);
const showBirthdayGiftPop = ref<boolean>(false);
const showUpgradeGiftPop = ref<boolean>(false);
const birGiftInfo = ref<IBirthdayGiftsInfo[]>([]);
const newGiftInfo = ref<INewComerGiftsInfo[]>([]);
const memberLevelUpInfo = ref<IMemberLevelUpsInfo>({
  level: 0, //等级级别
  levelCode: '', //等级英文标识
  isRead: false, //该消息是否已读
  gifts: [],
});

const userInfo = computed((): UserInfo => userStore.getUserInfo!);
const topBanners = computed(() => bannerStore.getBanners('home-top'));
const bannerHeight = computed((): number | string => {
  const tabbarHeight = toPx(112 * 2); // 750尺寸的tabbar高度
  return bannerKey.value
    ? appStore.sysInfo.screenHeight - tabbarHeight - wealBoxInfo.value.height
    : appStore.sysInfo.screenHeight;
});

const isShowNewGift = computed(() => {
  return !showContainerPop.value && !showBirthdayGiftPop.value && showNewGiftPop.value && !showUpgradeGiftPop.value;
});

const isShowBirthdayGift = computed(() => {
  return !showContainerPop.value && showBirthdayGiftPop.value && !showUpgradeGiftPop.value;
});

const isShowContainer = computed(() => {
  return !showNewGiftPop.value && !showBirthdayGiftPop.value && !showUpgradeGiftPop.value;
});

const isShowUpgradeGift = computed(() => {
  return !showContainerPop.value && showUpgradeGiftPop.value;
});

const showBannerKey = computed(() => {
  return (
    !bannerKey.value &&
    !showLoginPop.value &&
    !showContainerPop.value &&
    !showUpgradeGiftPop.value &&
    !isShowBirthdayGift.value
  );
});

watchEffect(() => {
  Taro.setNavigationBarColor({
    frontColor: navSwitch.value ? '#000000' : '#ffffff',
    backgroundColor: '#ffffff',
  });

  bannerKey.value ? homeDownRef.value?.stop() : homeDownRef.value?.play();
  showBacktop.value ? homeUpRef.value?.play() : homeUpRef.value?.stop();
});

onMounted(async () => {
  // 处理扫码小程序验真码进入首页逻辑
  // handleQrcodeScene();

  customBarInfo = Taro.getMenuButtonBoundingClientRect();
  loadingShown.value = !bannerStore.homeBannersLoaded;
  if (!bannerStore.homeBannersLoaded) {
    bannerStore
      .loadHomeBanners()
      .then(() => {
        loadingShown.value = false;
      })
      .catch(err => console.error(err));
  }

  getMemberLevelUpApi();
  getNewcomerGifts();
  getBirthdayGifts();

  useCartStore().getCartInfo();

  checkIsAddedToMyMiniProgram();
});

useDidShow(async () => {
  appStore.setShowTabbar(true);
  appStore.setSelected(0);
  bannerAutoplay.value = true;
  onRegisterEvent();
});

useReady(() => {
  getWealBoxInfo();
});

useDidHide(() => {
  appStore.sysInfo.platform === 'android' ? appStore.setSelected(-1) : '';
  bannerAutoplay.value = false;
  isAddedToMyMinProgram.value.show = false;
  offRegisterEvent();
});

useShareAppMessage(() => {
  const shareReturn = shareOptions({ page: '/pages/index/index' });
  console.debug('index page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});

// async function getCustomBarInfo() {
//   try {
//     customBarInfo.value = await queryRect('customBar111', true);
//     console.debug('customBarInfo queryRectInfo', customBarInfo.value);
//   } catch (e) {
//     console.debug('customBarInfo error=', e);
//   }
// }

async function getWealBoxInfo() {
  try {
    wealBoxInfo.value = await queryRect('wealBox', false);
    console.debug('wealBoxInfo queryRectInfo', wealBoxInfo.value);
  } catch (e) {
    console.debug('wealBoxInfo error=', e);
  }
}

function handleScroll(e) {
  oldScroll.value.scrollTop = e.detail.scrollTop;
  const scrollTop = Math.floor(e.detail?.scrollTop);

  // 隐藏回到顶部
  if (showBacktop.value) {
    const bottomBoxHeight = toPx(817 * 2);
    const hideScrollTop = e.detail.scrollHeight - bottomBoxHeight - toPx(100);
    if (scrollTop <= hideScrollTop) showBacktop.value = false;
  }

  navSwitch.value = scrollTop > (bannerHeight.value as number) - customBarInfo.bottom;
}

function handleScrolltoupper() {
  console.log('到顶部了------');
  // if (oldScroll.value.scrollTop === 0) return;
  bannerKey.value = false;
  scrollY.value = false;
}

function handleScrolltolower() {
  console.log('到底部了------');
  showBacktop.value = true;
}

// 滑动手势开始事件
function handleTouch(event) {
  if (scrollY.value) return;
  const endY = event.changedTouches[0].pageY || 0;
  const { startY } = touches.value;
  const moveY = startY - endY;
  if (moveY < 20) return;

  clickDown();
}

const startEvent = event => {
  if (scrollY.value) return;
  touches.value.startX = event.changedTouches[0].pageX || 0;
  touches.value.startY = event.changedTouches[0].pageY || 0;
};

function clickDown() {
  bannerKey.value = true;
  setTimeout(() => (scrollY.value = true), 100);
}

const scrollGoTop = () => {
  showBacktop.value = false;
  scrollTop.value = oldScroll.value.scrollTop;
  nextTick(() => {
    scrollTop.value = 0;
  });
};

function checkIsAddedToMyMiniProgram() {
  if (!Taro.canIUse('checkIsAddedToMyMiniProgram')) return;
  Taro.checkIsAddedToMyMiniProgram({
    success: async res => {
      console.debug('checkIsAddedToMyMiniProgram res=', res);
      if (res.added) return;
      // const buttonRes = Taro.getMenuButtonBoundingClientRect();
      isAddedToMyMinProgram.value = {
        y: `${customBarInfo.bottom + 8}Px` || '0',
        x: '8px',
        show: !res.added,
      };
    },
  });
}

// const handleRefreshNewGift = (result: MemberInfo) => {
//   newGiftInfo.value = result.gifts;
// };

const getNewcomerGifts = async () => {
  if (userStore.isMemberLevel) return;
  try {
    const result = await newcomerGiftsApi();

    // result = {
    //   gifts: [
    //     { type: 'point', value: '100' },
    //     {
    //       type: 'coupon',
    //       value: {
    //         couponId: 147,
    //         name: '全场可用',
    //         type: '1',
    //         value: '9.90',
    //         threshold: '10.00',
    //         expiration: { days: 30, after: 1, __type: 'delay' },
    //         itemId: 0,
    //         rules: '全部商品可用',
    //         limit: 2,
    //       },
    //     },
    //     {
    //       type: 'coupon',
    //       value: {
    //         couponId: 138,
    //         name: '部分商品可用',
    //         type: '1',
    //         value: '50.00',
    //         threshold: '300.00',
    //         expiration: { days: 8, after: 0, __type: 'delay' },
    //         itemId: 99999999,
    //         rules: '',
    //         limit: 2,
    //       },
    //     },
    //   ],
    // };

    newGiftInfo.value = sortedItems(result.gifts);
    showNewGiftPop.value = newGiftInfo.value.length > 0;
  } catch (error) {
    console.error('getNewcomerGifts error', error);
  }
};

const getBirthdayGifts = async () => {
  if (!userInfo.value.birthday) return;
  const mustGet = router.params.from === 'birthdaygifts' || false;
  if (!mustGet) {
    const briDay = `${new Date(userInfo.value.birthday).getMonth() + 1}-${new Date(userInfo.value.birthday).getDate()}`;
    const curDay = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
    if (briDay !== curDay) return;
  }
  try {
    const result = await birthdayGiftsApi();
    // result = {
    //   gifts: [
    //     { type: 'point', value: '99' },
    //     {
    //       type: 'coupon',
    //       value: {
    //         couponId: 149,
    //         name: '全场可用',
    //         type: '1',
    //         value: '300.00',
    //         threshold: '400.00',
    //         expiration: { days: 30, after: 0, __type: 'delay' },
    //         itemId: 0,
    //         rules: '',
    //         limit: 2,
    //       },
    //     },
    //   ],
    // };

    birGiftInfo.value = sortedItems(result.gifts);
    showBirthdayGiftPop.value = birGiftInfo.value.length > 0;
    if (showBirthdayGiftPop.value) await getBirthdayGiftMark();
  } catch (error) {
    console.error('getBirthdayGifts error', error);
  }
};

const getBirthdayGiftMark = async () => {
  try {
    await birthdayGiftsMarkApi();
  } catch (error) {
    console.error('getBirthdayGiftMark error', error);
  }
};

const getMemberLevelUpApi = async () => {
  if (!userStore.isMemberLevel) return;

  let result;
  try {
    result = await memberLevelUpApi();
  } catch (error) {
    console.error('getMemberLevelUpApi error', error);
  }

  if (!result) return;
  // result = {
  //   level: 2,
  //   levelCode: 'vip2',
  //   isRead: false,
  //   gifts: [
  //     {
  //       type: 'point',
  //       value: '10',
  //     },
  //     {
  //       type: 'coupon',
  //       value: {
  //         code: 'wet21gwl2r',
  //         status: 'active',
  //         start: '2023-07-20T16:00:00.000Z',
  //         end: '2024-07-31T15:59:59.000Z',
  //         couponId: 119,
  //         name: '部分商品可用',
  //         type: '1',
  //         value: '200.00',
  //         threshold: '1000.00',
  //         expiration: { end: '2024-07-31T15:59:59.000Z', start: '2023-07-20T16:00:00.000Z', __type: 'exact' },
  //         itemId: 0,
  //         rules: '仅限ZIPPO户外商品可用',
  //         limit: 2,
  //       },
  //     },
  //   ],
  // };

  memberLevelUpInfo.value = result;

  memberLevelUpInfo.value.gifts = sortedItems(result.gifts);
  showUpgradeGiftPop.value = !result.isRead;
  if (showUpgradeGiftPop.value) await getMemberLevelUpApiMark();
};

const getMemberLevelUpApiMark = async () => {
  try {
    await memberLevelUpMarkApi();
  } catch (error) {
    console.error('getMemberLevelUpApiMark error', error);
  }
};

function sortedItems(arr) {
  return arr.sort((a, b) => {
    if (a.type === 'coupon' && b.type !== 'coupon') {
      return -1; // 将type为coupon的项排在前面
    } else if (a.type !== 'point' && b.type === 'point') {
      return 1; // 将type为point的项排在最尾
    } else {
      return 0; // 其他情况保持不变
    }
  });
}

// function handleQrcodeScene() {
//   const { scene = '', q: qrcodeContent = '' } = router.params;
//   let sceneCode = '';
//   if (scene) sceneCode = decodeURIComponent(scene);

//   if (qrcodeContent) {
//     const scene = ((qrcodeContent.split('?') || [])[1] || '').split('=')[1] || '';
//     if (scene) sceneCode = decodeURIComponent(scene);
//   }

//   if (!sceneCode) return;

//   valiCode.value = sceneCode;
//   gotoVerification();
// }

// function gotoVerification() {
//   Taro.preload({ code: valiCode.value, scene: '微信扫码小程序验真码进入首页' });
//   Taro.navigateTo({
//     url: '/pages/verification/verification',
//     complete() {
//       valiCode.value = '';
//     },
//   });
// }
</script>

<style lang="scss" module>
.layout {
  height: 100vh;
  background-color: transparent;
  .icon_down {
    position: absolute;
    bottom: 124px;
    left: 50%;
    width: 20px;
    height: 20px;
    transform: translateX(-50%);
    z-index: 999;
  }

  .topic {
    width: 375px;
  }

  .backtop {
    position: fixed;
    bottom: 130px;
    left: 50%;
    width: 48px;
    height: 46px;
    transform: translateX(-50%);
    color: $white;
    overflow: hidden;
    z-index: 99;
    .icon_backtop {
      width: 20px;
      height: 20px;
      margin-bottom: 8px;
    }
  }

  .add_box {
    position: fixed;
    top: 91px;
    right: 8px;
    width: 184px;
    height: 52px;
    background-color: $white;
    border-radius: 4px;
    box-shadow: 0 4px 12px 4px rgba($color: $black, $alpha: 0.15);
    z-index: 1000;
    &::before {
      content: '';
      position: absolute;
      top: -4px;
      right: 56px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8px 4px 8px;
      border-color: transparent transparent $white transparent;
    }
    .t {
      padding: 12px 0 12px 16px;
      line-height: 14px;
      .circle {
        display: inline-block;
        vertical-align: baseline;
        width: 16px;
        height: 7px;
      }
    }
    .icon_close {
      width: 20px;
      height: 52px;
      .icon {
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>
