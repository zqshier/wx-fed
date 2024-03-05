<template>
  <BackgroundImage>
    <scroll-view
      class="container"
      :scroll-y="touchStat.enableScroll"
      :class="$style.layout"
      :enhanced="true"
      :enable-passive="false"
      :scroll-with-animation="false"
      :show-scrollbar="false"
      :upper-threshold="10"
      :scroll-top="touchStat.scrollViewTop"
      :bounces="touchStat.scrollBounces"
      id="scroll-view"
    >
      <CustomBar :isPlaceholder="false" :backIconSlot="true" bg-color="transparent" :logo-color="LogoColorType.WHITE">
        <template v-slot:barLeft>
          <CustomNavBack
            :modes="[TYPE_PAGE.BACK, TYPE_PAGE.CUSTOMER]"
            line-color="white"
            icon-color="#fff"
            bg-color="rgba(0, 0, 0, 0.36)"
          />
        </template>
      </CustomBar>

      <block v-if="infoLoaded">
        <view id="content-view" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
          <view :class="$style.main" v-if="!isPageStatus">
            <view
              v-if="goodsBanners && goodsBanners.length > 0"
              :animation="touchStat.animateData"
              :style="{ height: touchStat.maxHeight + 'px' }"
            >
              <CustomSwiper
                :class="$style.swiper"
                :isAutoPlayHasV="false"
                :autoplay="false"
                :height="'100%'"
                :current="swiperCurrent"
                :isTransition="false"
                :imgMode="imgMode"
                bgColor="#fff"
                videoName="gDetail"
                :list="goodsBanners"
                @change="swiperChange"
                :use-image-bg="true"
              />
            </view>

            <!-- 商品信息 -->
            <view :class="$style['info-warp']" class="nut-flex-col nut-col-center nut-row-center">
              <!-- 预约 -->
              <GoodsStep v-if="goodsStepInfo" :current="goodsStepInfo.current" :steps="goodsStepInfo.steps" />
              <!-- 商品信息 -->
              <GoodsInfo
                :SKUData="saleSkuData"
                v-model:showSharePop="showSharePop"
                v-model:showPosterPop="showPosterPop"
              />

              <!-- sku -->
              <SKUSelector
                ref="skuSelector"
                v-show="isGoods"
                @handleShop="handleShop"
                @on-enter-track="onEnterPageTrack"
                @on-leave-track="onLeavePageTrack"
              />

              <!-- 优惠券信息 -->
              <CouponInfo v-show="!isGoods" :data="couponsInfo" />

              <!-- 购买提示 -->
              <BuyingTips />
            </view>
            <GoodsDetails v-if="detailLoaded" :contents="details" />
            <!-- <view :style="{ height: touchStat.bottomHeight + 'px' }"></view> -->
          </view>
        </view>
        <FooterBtn v-if="!isPageStatus" :pionBalance="pionBalance" @addToShopping="addToShopping" ref="footerBtn" />

        <!-- 数据为空或商品下架 -->
        <!-- <PageStatus v-if="isPageStatus">
          <template v-slot:content>
            <view :class="$style['no-data']" class="nut-flex-col nut-col-center nut-row-center">
              <image :class="$style['no-data_icon']" src="../../../static/icon/sold-out.png" mode="scaleToFill" />
              <view :class="$style['no-data_title']" class="f_s-14 f_w-400">该商品已下架，看看其他商品吧</view>
              <view :class="$style['no-data_btn']" class="nut-flex nut-row-center f_s-14 f_w-400" @tap="goShopPage"
                >去逛逛</view
              >
            </view>
          </template>
        </PageStatus> -->
        <view :class="$style['no-data']" class="nut-flex-col nut-col-center nut-row-center" v-if="isPageStatus">
          <image :class="$style['no-data_icon']" src="../../../static/icon/sold-out.png" mode="scaleToFill" />
          <view :class="$style['no-data_title']" class="f_s-14 f_w-400">该商品已下架，看看其他商品吧</view>
          <view :class="$style['no-data_btn']" class="nut-flex nut-row-center f_s-14 f_w-400" @tap="goShopPage"
            >去逛逛</view
          >
        </view>
      </block>

      <Loading :show="!infoLoaded || !detailLoaded" />
      <PopLogin v-model:isShow="showLoginPop" :target="loginTarget" />
      <GoodsShare v-model:show="showSharePop" v-model:showPoster="showPosterPop" @track="onShareTrack" />
      <!-- <PopPoster v-model:show="showPosterPop" :price="priceStr" :guidePrice="guidePriceStr" /> -->
    </scroll-view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import Taro, { eventCenter, getApp, useDidHide, useDidShow, useRouter, useShareAppMessage } from '@tarojs/taro';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
// import { isEmpty } from 'lodash';
import { cdpEventApi } from '@/api/cdp';
import { getCouponQuery } from '@/api/coupons';
import { goodsDetailApi } from '@/api/goods';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import CustomNavBack, { TYPE_PAGE } from '@/components/CustomNavBack/CustomNavBack.vue';
import CustomSwiper from '@/components/CustomSwiper/CustomSwiper.vue';
import Loading from '@/components/Loading/Loading.vue';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import { toPx } from '@/components/PosterBuilder/utils/tools';
import { TARGET_LOCATION_CHANGE_POINT } from '@/constants';
import { IBanner, LinkType } from '@/dto/banner';
import { ICouponsCenterList, ICouponsItem } from '@/dto/coupons';
import { GoodsDetailInfo, GoodsInfoSkusItem, IGoodsSteps } from '@/dto/goods';
import { pointMallTypeTargetType } from '@/dto/point';
import useLoginPop from '@/hook/useLoginPop';
import { useAddressStore, usePointStore, usePointsGoodStore, useUserStore } from '@/stores';
import { goodsBooking, onGoodsDetailClick, shareOptions } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps, ILinkflowShareTarge } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import { format } from 'date-fns';
// import PageStatus from '../../components/PageStatus/PageStatus.vue';
import BuyingTips from './components/BuyingTips/BuyingTips.vue';
import CouponInfo from './components/CouponInfo/CouponInfo.vue';
import GoodsDetails from './components/GoodsDetails/GoodsDetails.vue';
import GoodsInfo from './components/GoodsInfo/GoodsInfo.vue';
import GoodsShare from './components/GoodsShare/GoodsShare.vue';
import GoodsStep from './components/GoodsStep/GoodsStep.vue';
import SKUSelector from './components/SKUSelector/SKUSelector.vue';
import FooterBtn from './components/footerBtn/footerBtn.vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();

const router = useRouter();
const goodsStore = usePointsGoodStore();
const pointStore = usePointStore();
const userStore = useUserStore();

// const goodsId: number = Number(router.params.id || 0);
const promotionId: string = router.params.promotionId || '';
// const skuId: number = Number(router.params.skuId || 0);
const goodsId = ref<number>(0);
const infoLoaded = ref<boolean>(false);
const detailLoaded = ref<boolean>(false);
const goodsInfo = computed(() => goodsStore.goodsInfo);
const details = ref<GoodsDetailInfo[]>([]);
const goodsBanners = ref<IBanner[]>([]);
const isAvailable = ref<boolean>(false); // 商品下架或不存在

const skuSelector = ref(); // sku组件
const footerBtn = ref(); // 底部按钮组件
const swiperCurrent = ref<number>(0); // 轮播图当前所在滑块
let reqCount: number = 0;
let swiperCount: number = 0; // 记录设置轮播图

const showSharePop = ref<boolean>(false);
const showPosterPop = ref<boolean>(false);

const couponsInfo = ref<ICouponsItem>();
// const priceStr = computed((): string => {
//   return saleSkuData.value.price || '0.00';
// });

const isGoods = computed((): boolean => {
  return goodsInfo.value?.pointMallTypeTargetType === pointMallTypeTargetType.goods;
});

// 预约信息
const goodsStepInfo = computed(() => {
  const goods = goodsStore.goodsInfo;

  if (!goods) return null;

  const booking = goodsBooking(goods);
  if (!booking) {
    return null;
  }
  const steps: IGoodsSteps[] = [];
  let current = -1;

  const saleAt = new Date(goods.startTime!);
  const bookingAt = new Date(goods.booking.start!);

  // 超过通知时间1小时后，不再显示预约状态
  if (Date.now() > new Date(booking.sendAt).getTime() + 60 * 60 * 1000) {
    return null;
  }

  steps.push({
    title: '预约',
    time: format(new Date(booking.start), 'MM-dd HH:mm'),
  });

  steps.push({
    title: '上新',
    time: format(saleAt, 'MM-dd HH:mm'),
  });

  // 未到预约开始时间
  if (bookingAt.getTime() < Date.now()) {
    current = 0;
  }

  if (saleAt.getTime() < Date.now()) {
    current = 2;
  }

  return {
    steps,
    current,
  };
});

// 商品下架
const saleStatusOut = computed((): boolean => {
  return goodsInfo.value?.disable || false;
});

// 选中的suk信息
const saleSkuData = computed(() => {
  return goodsStore.skusData;
});

const isPageStatus = computed(() => {
  return isAvailable.value || saleStatusOut.value;
});

const pionBalance = computed((): number => pointStore.balance);

watch(
  () => saleSkuData.value.image,
  newVal => {
    if (!newVal) return;
    addItemToSlider();
  },
);

// banner图片裁剪、缩放的模式
const imgMode = 'aspectFill'; // computed((): string => (bannerKey.value ? 'aspectFill' : 'aspectFit'));

// 设置轮播图
const addItemToSlider = () => {
  const imageUrl = saleSkuData.value.image;
  if (!imageUrl) return;

  const newItem: IBanner = {
    src: imageUrl,
    group: '',
    srcType: 'image',
    link: '',
    id: 0,
    linkType: LinkType.none,
    desc: '',
  };

  if (swiperCount === 0) {
    goodsBanners.value.unshift(newItem);
  } else {
    goodsBanners.value.splice(0, 1, newItem);
  }

  swiperCurrent.value = 0;
  swiperCount += 1;
};

function swiperChange(val) {
  swiperCurrent.value = val;
}

// 加入购物车或购买
const addToShopping = type => {
  skuSelector.value.handleConfirm(type);
};

const handleShop = val => {
  footerBtn.value.setLoadingConfirm(val.type);
};

const getBanners = () => {
  const banners: IBanner[] = [];
  const banner: IBanner = {
    src: '',
    group: '',
    srcType: 'image',
    link: '',
    id: 0,
    linkType: LinkType.none,
    desc: '',
  };

  goodsInfo.value?.goodsInfo.images.forEach(item => {
    const bannerObj = { ...banner };
    bannerObj.src = String(item);
    banners.push(bannerObj);
  });

  const video = goodsInfo.value?.goodsInfo.video;
  if (video) {
    const bannerObj = { ...banner };
    bannerObj.src = String(video.url);
    bannerObj.srcType = 'video';
    banners.unshift(bannerObj);
  }
  goodsBanners.value = banners;
};

const resetSkusData = () => {
  let result: GoodsInfoSkusItem = {
    comb: [],
    combKey: '',
    id: 0,
    image: '',
    isSoldOut: false,
    favorited: false,
    subscribed: false,
    price: '',
    guidePrice: '',
    priceAlias: '',
    sn: '',
    barcode: '',
  };
  goodsStore.setSkusData(result);
};

/** 滑动效果处理 begin */
const touchStat = reactive<{
  startX: number;
  startY: number;
  lastY: number;
  maxHeight: number;
  minHeight: number;
  bannerHeight: number;
  moveDistance: number;
  animateData: any;
  isMoving: boolean;
  startHeight: number;
  startTop: number;
  scrollTop: number;
  scrollViewTop: number;
  contentHeight: number;
  contentAnimation: any;
  windowHeight: number;
  bottomHeight: number;
  enableScroll: boolean;
  enableTouchFollow: boolean;
  scrollBounces: boolean;
  direction: number;
  baseAnimateTime: number;
  easeAnimateTime: number;
  fixBottom: number;
  currentScrollTop: number;
  lastScrollTop: number;
  isIos: boolean;
  moveRecord: number[];
}>({
  startX: 0,
  startY: 0,
  lastY: 0,
  maxHeight: toPx(562 * 2),
  minHeight: toPx(375 * 2),
  bannerHeight: 0,
  moveDistance: 0,
  animateData: {},
  isMoving: false,
  startHeight: 0,
  startTop: 0,
  scrollTop: 0,
  contentHeight: 0,
  contentAnimation: {},
  windowHeight: Taro.getSystemInfoSync().windowHeight,
  bottomHeight: 0,
  enableScroll: false,
  scrollViewTop: 0,
  enableTouchFollow: true,
  scrollBounces: false,
  direction: 0,
  baseAnimateTime: 10,
  easeAnimateTime: 300,
  fixBottom: 0,
  currentScrollTop: 0,
  lastScrollTop: 0,
  isIos: Taro.getSystemInfoSync().system.indexOf('iOS') > -1,
  moveRecord: [],
});

touchStat.bannerHeight = touchStat.maxHeight;
touchStat.bottomHeight = touchStat.maxHeight - touchStat.minHeight;

function getAnimate(duration: number, timingFunction = 'ease-in-out') {
  return Taro.createAnimation({
    transformOrigin: '50% 50%',
    duration,
    timingFunction: timingFunction as any,
    delay: 0,
  });
}

async function handleTouchStart(event) {
  touchStat.startX = event.changedTouches[0].pageX || 0;
  touchStat.startY = event.changedTouches[0].pageY || 0;
  touchStat.lastY = touchStat.startY;
  touchStat.moveDistance = 0;
  touchStat.startHeight = touchStat.bannerHeight;
  touchStat.startTop = touchStat.scrollTop;
  touchStat.isMoving = false;
  touchStat.moveRecord = [];
  touchStat.direction = 0;
  console.log('startHeight', touchStat.startHeight);
}

function setBannerHeight(moveY: number, time: number, forceHeight = 0) {
  let bannerHeight = touchStat.startHeight - moveY;

  if (forceHeight) {
    bannerHeight = forceHeight;
  } else {
    if (bannerHeight < touchStat.minHeight) {
      bannerHeight = touchStat.minHeight;
    } else if (bannerHeight > touchStat.maxHeight) {
      bannerHeight = touchStat.maxHeight;
    }
  }

  if (bannerHeight <= touchStat.minHeight) {
    touchStat.enableScroll = true;
  }

  touchStat.bannerHeight = bannerHeight;
  const ani = getAnimate(time);
  ani.height(bannerHeight).step();
  touchStat.animateData = ani.export();
}

function checkDirection(lastMove: number) {
  touchStat.moveRecord.push(lastMove);
  if (touchStat.moveRecord.length > 6) {
    touchStat.moveRecord.shift();
  }
  const moveSum = touchStat.moveRecord.reduce((a, b) => a + b, 0);
  return moveSum;
}

function handleTouchMove(event) {
  const endY = event.changedTouches[0].pageY || 0;
  const { startY } = touchStat;
  const moveY = startY - endY;
  touchStat.direction = checkDirection(touchStat.lastY - endY);
  touchStat.lastY = endY;

  console.log('move', touchStat.direction, touchStat.scrollTop, touchStat.startTop, touchStat.isMoving);

  if (!touchStat.isMoving && Math.abs(moveY) < 10) return;
  if (touchStat.scrollTop > 1) return;

  touchStat.isMoving = true;
  touchStat.moveDistance = moveY;
  touchStat.enableScroll = false;

  if (touchStat.enableTouchFollow) {
    if (moveY > 0) {
      setBannerHeight(moveY, 0);
    } else {
      if (touchStat.isIos) {
        setBannerHeight(0, 500, touchStat.maxHeight);
      } else {
        setBannerHeight(moveY, 0);
      }
    }
  } else {
    if (moveY > 0) {
      setBannerHeight(0, 500, touchStat.minHeight);
    } else {
      setBannerHeight(0, 500, touchStat.maxHeight);
    }
  }

  console.log('moveY', moveY);
}

function handleTouchEnd(event) {
  if (!touchStat.isMoving) {
    if (touchStat.direction < 0) {
      if (touchStat.scrollTop > 1) {
        setTimeout(() => {
          if (touchStat.scrollTop > 1) return;
          touchStat.isMoving = true;
          handleTouchEnd(event);
        }, 200);
        return;
      }
    } else {
      return;
    }
  }
  touchStat.isMoving = false;

  const endY = event.changedTouches[0].pageY || 0;
  const { startY } = touchStat;
  const moveY = startY - endY;

  console.log('endY', touchStat.direction, moveY);
  if (Math.abs(touchStat.direction) < 5) {
    touchStat.direction = moveY;
  }

  if (touchStat.direction > 0) {
    setBannerHeight(0, 300, touchStat.minHeight);
    touchStat.enableScroll = true;
    touchStat.scrollViewTop = 0;
  } else {
    setBannerHeight(0, 300, touchStat.maxHeight);
    touchStat.enableScroll = false;
    touchStat.scrollViewTop = 0;
  }
}

function setScrollTop(top: number) {
  touchStat.scrollViewTop = touchStat.scrollTop;
  nextTick(() => {
    touchStat.scrollViewTop = top;
  });
}

let updateScrollTimer;
let scrollSameCount = 0;
function updateScrollInfo() {
  const query = Taro.createSelectorQuery();
  query.select('#scroll-view').scrollOffset();
  query.exec(res => {
    if (res && res[0]) {
      let { scrollTop } = res[0];
      // console.log('scrollTop', scrollTop);
      if (touchStat.isMoving) {
        if (touchStat.scrollTop === scrollTop) {
          scrollSameCount += 1;
        } else {
          scrollSameCount = 0;
        }
        if (scrollSameCount > 3) {
          scrollTop = 0;
          scrollSameCount = 0;
          setScrollTop(0);
        }
      }
      touchStat.scrollTop = scrollTop;
    }
  });

  updateScrollTimer = setTimeout(() => {
    updateScrollInfo();
  }, 100);
}

// 定义刷新函数
let refreshInterval;
function refreshDetails() {
  const currentTime = new Date().getTime();
  const startTime = goodsInfo.value?.startTime || '';
  // const startTime = '2023-12-21 11:13:00';
  const saleStartTime = new Date(startTime).getTime(); // 开售时间
  const timeUntilSale = saleStartTime - currentTime;

  // 如果距离开售时间小于等于2分钟，每200毫秒刷新一次
  if (timeUntilSale > 0 && timeUntilSale <= 2 * 60 * 1000) {
    refreshInterval = setInterval(() => {
      getGoodsInfo();
      console.log('刷新获取详情接口');

      // 检查是否已经超过开售时间，如果是则停止刷新
      if (currentTime >= saleStartTime) {
        console.log('已超过开售时间，停止刷新');
        clearInterval(refreshInterval);
      }
    }, 300);
  } else if (timeUntilSale > 2 * 60 * 1000) {
    // 如果距离开售时间大于2分钟，每一分钟刷新一次
    refreshInterval = setInterval(() => {
      getGoodsInfo();
      console.log('每一分钟刷新获取详情接口');
    }, 60 * 1000);
  } else {
    // 如果距离开售时间小于等于0，说明已经超过开售时间
    console.log('已超过开售时间，不做刷新');
  }
}

/** 滑动效果处理 end */

useShareAppMessage(res => {
  const path = 'packageA/pages/pointGoodsDetail/pointGoodsDetail';
  if (res.from === 'button') {
    onShareTrack('微信好友');
    // tarckEvents([
    //   {
    //     path,
    //     event: IEventsName.SHARE_CL,
    //     properties: { id: goodsId.value, desc: '点击"微信好友"' },
    //   },
    // ]);
  }

  const params = { id: goodsId.value, promotionId };
  const shareReturn = shareOptions({
    page: `/${path}`,
    params,
    title: goodsInfo.value?.goodsInfo.name || '',
    imageUrl: goodsInfo.value?.shareImage || goodsInfo.value?.image || '',
  });
  console.debug('pointGoodsDetail useShareAppMessage path=', shareReturn.path);
  // getDotaskApi();
  return shareReturn;
});

// async function getDotaskApi() {
//   const hasPageview = useMissionsStore().list.find(item => item.code === MISSIONS_CODE.share);
//   if (!hasPageview) return;

//   const params = {
//     code: MISSIONS_CODE.share,
//     missionId: hasPageview?.id,
//   };

//   getShareMissionsRecords(params);
// }

onMounted(() => {
  onRegisterEvent();
  // getCartInfo();
  // 积分
  pointStore.load();
  //预加载地址数据
  useAddressStore().preload();

  updateScrollInfo();
});

onUnmounted(() => {
  onLeavePageTrack();
  resetSkusData();
  offRegisterEvent();
  eventCenter.off(TARGET_LOCATION_CHANGE_POINT);
  clearTimeout(updateScrollTimer);
  clearInterval(refreshInterval);
});

let pageTs: number = 0; // 进入页面时间
useDidShow(async () => {
  await getGoodsInfo();
  getGoodsDetailInfo();
  refreshDetails();
  onEnterPageTrack();
  onSharingOpenTrack();
});

useDidHide(() => {
  onLeavePageTrack();
  clearInterval(refreshInterval);
});

const onEnterPageTrack = () => {
  pageTs = Date.now();
  if (!linkflow) return;
  const cSkuData = goodsStore.getCurrentSkusData;
  onGoodsDetailClick(
    {
      barcode: cSkuData?.barcode || '',
      sn: cSkuData?.sn || '',
      id: `${cSkuData?.id}` || '',
      price: cSkuData?.pointMallSaleData.price || 0,
      point: cSkuData?.pointMallSaleData.point || 0,
      name: goodsInfo.value?.goodsInfo.name || '',
      type: '积分商品',
    },
    '浏览',
  );
};

const onLeavePageTrack = () => {
  if (!pageTs) return;
  const ts = (Date.now() - pageTs) / 1000;
  console.debug(`页面停留时间 ts=${ts}秒`);
  const cSkuData = goodsStore.getCurrentSkusData;
  if (!linkflow) return;
  // 埋点 离开浏览商品详情
  linkflow.track({
    event: ELinkflowEventsName.PrductDetailLeave_View,
    props: {
      skuId: cSkuData?.barcode || '',
      outerSkuId: cSkuData?.sn || '',
      miniSkuId: cSkuData?.id || '',
      productName: goodsInfo.value?.goodsInfo.name || '',
      currentPrice: cSkuData?.pointMallSaleData.price,
      currentPoint: cSkuData?.pointMallSaleData.point || 0,
      isPointProduct: true,
      s_pageStayTime: ts,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
  pageTs = 0;
};

const onSharingOpenTrack = () => {
  const cSkuData = goodsStore.getCurrentSkusData;
  if (!linkflow || !userStore.isShareToGoodsDetail || !cSkuData) return;
  const props = {
    skuId: cSkuData?.barcode || '',
    outerSkuId: cSkuData?.sn || '',
    miniSkuId: `${cSkuData?.id || ''}`,
    currentPoint: cSkuData?.pointMallSaleData.point || 0,
    currentPrice: cSkuData?.pointMallSaleData.price,
    isPointProduct: true,
    triggerPagePath,
  } as ILinkflowEventsProps;

  // 埋点 产品详情_打开分享页
  linkflow.track({
    event: ELinkflowEventsName.PrductDetail_Open,
    props: { ...props, shareEncodeMiniUserId: userStore.introducer },
  });

  // 埋点 产品详情_分享被打开
  if (userStore.introducer) {
    props.inviteeOpenId = userStore.userInfo?.openid || '';
    props.inviteeUnionId = userStore.userInfo?.unionid || '';
    props.inviteeNickname = userStore.userInfo?.nickname || '';
    console.debug('产品详情_分享被打开 埋点 推荐人=', userStore.introducer);
    cdpEventApi({
      sid: userStore.introducer,
      messages: [{ data: { event: ELinkflowEventsName.PrductDetail_SharingOpened, props } }],
    });
  }
};

async function getCouponList(codes) {
  if (!codes) return;
  let result: ICouponsCenterList = await getCouponQuery(codes);
  if (!result) return;
  couponsInfo.value = result.list[0];
}

const getGoodsInfo = async () => {
  let result;
  try {
    result = await goodsStore.getGoodsInfo(promotionId);
  } catch (err) {
    isAvailable.value = true;
    console.error('getGoodsInfo err=', err);
  } finally {
    infoLoaded.value = true;
  }

  goodsId.value = result.goodsInfo.id;

  if (reqCount < 1) {
    getBanners();
  }

  if (!couponsInfo.value && result.pointMallTypeTargetType === pointMallTypeTargetType.coupon) {
    getCouponList(result.goodsInfo.skus[0].meta.couponCode);
  }

  reqCount += 1;
};

const getGoodsDetailInfo = async () => {
  if (detailLoaded.value) return;
  try {
    const res = await goodsDetailApi(goodsId.value);
    details.value = res;
    detailLoaded.value = true;
  } catch (err) {
    console.error('getGoodsDetailInfo err=', err);
  }
};

// const getCartInfo = async () => {
//   if (isEmpty(useCartStore().cartInfo)) {
//     useCartStore().getCartInfo();
//   }
// };

const goShopPage = () => {
  Taro.reLaunch({
    url: '/pages/pointmall/pointmall',
  });
};

const onShareTrack = (shareTarge: ILinkflowShareTarge) => {
  if (!linkflow) return;
  const cSkuData = goodsStore.getCurrentSkusData;
  linkflow.track({
    event: ELinkflowEventsName.PrductDetail_Share,
    props: {
      skuId: cSkuData?.barcode || '',
      outerSkuId: cSkuData?.sn || '',
      miniSkuId: cSkuData?.id || '',
      productName: goodsInfo.value?.goodsInfo.name || '',
      currentPrice: cSkuData?.pointMallSaleData.price,
      isPointProduct: true,
      shareTarge,
      shareStatus: '分享成功',
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};
</script>

<style lang="scss" module>
.layout {
  height: 100vh;
  background-color: transparent;
  overflow: hidden;
}
.main {
  width: 375px;
  .info-warp {
    padding: 16px;
  }
}

.hideContent {
  height: 100vh;
  overflow: hidden;
}

.no-data {
  position: absolute;
  left: 50%;
  top: 245px;
  transform: translateX(-50%);
  width: 224px;
  &_icon {
    width: 48px;
    height: 48px;
  }
  &_title {
    font-family: 'FZLanTingHei-R-GBK';
    margin: 24px 0;
    color: $Tertiary;
  }
  &_btn {
    width: 90px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid $Tertiary;
  }
}

.indicator-row {
  position: absolute;
  left: 0;
  bottom: 0;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  width: 100%;
  height: 5px;
  z-index: 2;
  .indicator-dot {
    width: 5px;
    height: 5px;
    background: $Tertiary;
    border-radius: 50%;
    margin: 0 5px;

    &_active {
      background: $Brand;
    }
  }
}
</style>
