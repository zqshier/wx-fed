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
      <CustomBar
        :isPlaceholder="false"
        :backIconSlot="true"
        bg-color="transparent"
        :logo-color="!saleStatusOut ? LogoColorType.WHITE : LogoColorType.BLACK"
      >
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
                v-model:showSharePop="showSharePop"
                v-model:showPosterPop="showPosterPop"
                :data="goodsInfo"
                :SKUData="saleSkuData"
              />
              <!-- 商品活动 -->
              <GoodsActivity :data="goodsInfo" v-model:activity-infos="activityInfos" />
              <!-- sku -->
              <SKUSelector
                v-model:skuData="cSkuData"
                :id="skuId"
                :data="goodsInfo"
                :activityInfos="activityInfos"
                @on-enter-track="onEnterPageTrack"
                @on-leave-track="onLeavePageTrack"
              />
              <!-- 评分 -->
              <UserRating :goodsId="goodsId" :cSkuData="cSkuData" />
              <!-- 购买提示 -->
              <BuyingTips :data="goodsInfo" />
            </view>
            <RecommendedItems :class="$style.like" :goods="recommendInfo" v-if="recommendInfo.length" />

            <GoodsDetails v-if="detailLoaded" :contents="details" />
            <!-- <view :style="{ height: touchStat.bottomHeight + 'px' }"></view> -->
          </view>
        </view>
        <FooterBtn v-if="!isPageStatus" :data="goodsInfo" :activity-infos="activityInfos" :skus-data="cSkuData" />

        <!-- 数据为空或商品下架 -->
        <!-- <PageStatus v-if="isPageStatus">
          <template v-slot:content>
            <view :class="$style['no-data']" class="nut-flex-col nut-col-center nut-row-center">
              <image :class="$style['no-data_icon']" src="../../../static/icon/sold-out.png" mode="scaleToFill" />
              <view :class="$style['no-data_title']" class="f_s-16 f_w-400">该商品已下架，看看其他商品吧</view>
              <view :class="$style['no-data_btn']" class="nut-flex nut-row-center f_s-14 f_w-400" @tap="goShopPage"
                >去逛逛</view
              >
            </view>
          </template>
        </PageStatus> -->

        <view :class="$style['no-data']" class="nut-flex-col nut-col-center nut-row-center" v-if="isPageStatus">
          <image :class="$style['no-data_icon']" src="../../../static/icon/sold-out.png" mode="scaleToFill" />
          <view :class="$style['no-data_title']" class="f_s-16 f_w-400">该商品已下架，看看其他商品吧</view>
          <view :class="$style['no-data_btn']" class="nut-flex nut-row-center f_s-14 f_w-400" @tap="goShopPage"
            >去逛逛</view
          >
        </view>
      </block>

      <Loading :show="!infoLoaded || !detailLoaded" />
      <PopLogin v-model:isShow="showLoginPop" :target="loginTarget" />
      <GoodsShare
        v-model:show="showSharePop"
        v-model:showPoster="showPosterPop"
        :data="goodsInfo"
        :skus-data="saleSkuData"
        @track="onShareTrack"
      />
      <!-- <PopPoster v-model:show="showPosterPop" :price="priceStr" :guidePrice="guidePriceStr" :goods-data="goodsInfo" /> -->
    </scroll-view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getRecommend, goodsApi, goodsDetailApi } from '@/api/goods';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import CustomNavBack, { TYPE_PAGE } from '@/components/CustomNavBack/CustomNavBack.vue';
import CustomSwiper from '@/components/CustomSwiper/CustomSwiper.vue';
import Loading from '@/components/Loading/Loading.vue';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import RecommendedItems from '@/components/RecommendedItems/RecommendedItems.vue';
import { MISSIONS_CODE, STATUS_SALE_OUT } from '@/constants';
import { IBanner, LinkType } from '@/dto/banner';
import { GoodsDetailInfo, IGoodsSteps } from '@/dto/goods';
import { IRecommendList } from '@/dto/recommend';
import useLoginPop from '@/hook/useLoginPop';
// import PageStatus from '@/packageA/components/PageStatus/PageStatus.vue';
import { useAddressStore, useCartStore, useMissionsStore, useUserStore } from '@/stores';
import { getShareMissionsRecords, goodsBooking, onGoodsDetailClick, shareOptions, unlockMedal } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps, ILinkflowShareTarge } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp, useDidHide, useDidShow, useRouter, useShareAppMessage } from '@tarojs/taro';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import BuyingTips from './components/BuyingTips/BuyingTips.vue';
import GoodsActivity from './components/GoodsActivity/GoodsActivity.vue';
import GoodsDetails from './components/GoodsDetails/GoodsDetails.vue';
import GoodsInfo from './components/GoodsInfo/GoodsInfo.vue';
import GoodsShare from './components/GoodsShare/GoodsShare.vue';
import GoodsStep from './components/GoodsStep/GoodsStep.vue';
// import PopPoster from './components/PopPoster/PopPoster.vue';
import { cdpEventApi } from '@/api/cdp';
import SKUSelector from './components/SKUSelector/SKUSelector.vue';
import UserRating from './components/UserRating/UserRating.vue';
import FooterBtn from './components/footerBtn/footerBtn.vue';
import useData from './hook/useData';
import useTouch from './hook/useTouch';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();
let pageTs: number = 0; // 进入页面时间
// banner图片裁剪、缩放的模式
const imgMode = 'aspectFill'; // computed((): string => (bannerKey.value ? 'aspectFill' : 'aspectFit'));

const userStore = useUserStore();
const router = useRouter();

const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();
const { goodsInfo, cSkuData, activityInfos } = useData();
const goodsId: number = Number(router.params.id || 0);
const skuId: number = Number(router.params.skuId || 0);
const infoLoaded = ref<boolean>(false);
const detailLoaded = ref<boolean>(false);
const details = ref<GoodsDetailInfo[]>([]);
const goodsBanners = ref<IBanner[]>([]);
const recommendInfo = ref<IRecommendList[]>([]);
const isAvailable = ref<boolean>(false); // 商品下架或不存在
const swiperCurrent = ref<number>(0); // 轮播图当前所在滑块
let reqCount: number = 0;
let swiperCount: number = 0; // 记录设置轮播图

const showSharePop = ref<boolean>(false);
const showPosterPop = ref<boolean>(false);

// const priceStr = computed((): string => saleSkuData.value.price || '0.00');

// const guidePriceStr = computed((): string => saleSkuData.value.guidePrice || '');

// 预约信息
const goodsStepInfo = computed(() => {
  if (!goodsInfo.value) return null;

  const booking = goodsBooking(goodsInfo.value);
  if (!booking) return null;

  const steps: IGoodsSteps[] = [];
  let current = 0;

  const saleAt = new Date(goodsInfo.value.onSaleAt!);

  // 超过通知时间1小时后，不再显示预约状态
  if (Date.now() > new Date(booking.sendAt).getTime() + 60 * 60 * 1000) return null;

  steps.push({ title: '预约', time: format(new Date(booking.start), 'MM-dd HH:mm') });

  steps.push({ title: '上新', time: format(saleAt, 'MM-dd HH:mm') });

  if (saleAt.getTime() < Date.now()) current = 2;

  return { steps, current };
});

// 商品下架
const saleStatusOut = computed((): boolean => {
  return goodsInfo.value?.saleStatus === STATUS_SALE_OUT;
});

// 选中的suk信息
const saleSkuData = computed(() => cSkuData.value);

const isPageStatus = computed(() => {
  return isAvailable.value || saleStatusOut.value;
});

watch(
  () => saleSkuData.value.image,
  newVal => {
    if (!newVal) return;
    addItemToSlider();
  },
);

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

  goodsInfo.value?.images.forEach(item => {
    const bannerObj = { ...banner };
    bannerObj.src = String(item);
    banners.push(bannerObj);
  });

  const video = goodsInfo.value?.video;
  if (video) {
    const bannerObj = { ...banner };
    bannerObj.src = String(video.url);
    bannerObj.srcType = 'video';
    banners.unshift(bannerObj);
  }
  goodsBanners.value = banners;
};

/** 滑动效果处理 begin */
const { touchStat, handleTouchStart, handleTouchMove, handleTouchEnd, updateScrollInfo, clearUpdateScrollTimer } =
  useTouch();

touchStat.bannerHeight = touchStat.maxHeight;
touchStat.bottomHeight = touchStat.maxHeight - touchStat.minHeight;

/** 滑动效果处理 end */

useShareAppMessage(res => {
  // example: /pages/landing/landing?page=%2FpackageA%2Fpages%2FgoodsDetail%2FgoodsDetail&id=17
  const path = 'packageA/pages/goodsDetail/goodsDetail';
  if (res.from === 'button') {
    onShareTrack('微信好友');
    // tarckEvents([
    //   {
    //     path,
    //     event: IEventsName.SHARE_CL,
    //     properties: { goodsId, desc: '点击"微信好友"' },
    //   },
    // ]);
  }

  const params = { id: goodsId };
  const shareReturn = shareOptions({
    page: `/${path}`,
    params,
    title: goodsInfo.value?.name || '',
    imageUrl: goodsInfo.value?.shareImage || goodsInfo.value?.image || '',
  });
  console.debug('goodsDetail useShareAppMessage path=', shareReturn.path);
  getDotaskApi();
  unlockMedal({ group: 'goodsshare', sn: String(cSkuData.value?.id) });
  return shareReturn;
});

async function getDotaskApi() {
  const hasPageview = useMissionsStore().list.find(item => item.code === MISSIONS_CODE.share);
  if (!hasPageview) return;

  const params = {
    code: MISSIONS_CODE.share,
  };

  getShareMissionsRecords(params);
}

onMounted(async () => {
  // await getGoodsInfo();

  onRegisterEvent();
  getCartInfo();
  getRecommendInfo();
  //预加载地址数据
  useAddressStore().preload();

  // updateScrollInfo();
});

onUnmounted(() => {
  // useGoodsStore().resetActivityInfo(goodsId);
  onLeavePageTrack();
  offRegisterEvent();
  // clearUpdateScrollTimer();
});

useDidShow(async () => {
  await getGoodsInfo();
  getGoodsDetailInfo();
  onEnterPageTrack();
  onSharingOpenTrack();
  updateScrollInfo();
});

useDidHide(() => {
  onLeavePageTrack();
  clearUpdateScrollTimer();
});

const onEnterPageTrack = () => {
  pageTs = Date.now();
  if (!linkflow) return;
  if (!cSkuData.value) return;
  onGoodsDetailClick(
    {
      barcode: cSkuData.value?.barcode || '',
      sn: cSkuData.value?.sn || '',
      id: `${cSkuData.value?.id}` || '',
      price: (cSkuData.value?.price && +cSkuData.value?.price) || 0,
      name: goodsInfo.value?.name || '',
      type: '商品',
    },
    '浏览',
  );
};

const onLeavePageTrack = () => {
  if (!pageTs) return;
  const ts = (Date.now() - pageTs) / 1000;
  console.debug(`页面停留时间 ts=${ts}秒`);
  if (!cSkuData.value) return;
  if (!linkflow) return;
  // 埋点 离开浏览商品详情
  linkflow.track({
    event: ELinkflowEventsName.PrductDetailLeave_View,
    props: {
      skuId: cSkuData.value?.barcode || '',
      outerSkuId: cSkuData.value?.sn || '',
      miniSkuId: `${cSkuData.value?.id || ''}`,
      productName: goodsInfo.value?.name || '',
      currentPrice: (cSkuData.value?.price && +cSkuData.value?.price) || cSkuData.value?.price,
      isPointProduct: false,
      s_pageStayTime: ts,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
  pageTs = 0;
};

const onSharingOpenTrack = () => {
  if (!linkflow || !userStore.isShareToGoodsDetail || !cSkuData.value) return;
  const props = {
    skuId: cSkuData.value?.barcode || '',
    outerSkuId: cSkuData.value?.sn || '',
    miniSkuId: `${cSkuData.value?.id || ''}`,
    currentPrice: (cSkuData.value?.price && +cSkuData.value?.price) || cSkuData.value?.price,
    isPointProduct: false,
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

// 猜你喜欢
const getRecommendInfo = async () => {
  let result;
  try {
    result = await getRecommend(goodsId);
  } catch (error) {
    console.log(error);
  }

  if (!result) return;
  recommendInfo.value = result.list;
};

const getGoodsInfo = async () => {
  try {
    const result = await goodsApi(goodsId);
    goodsInfo.value = result;
    if (reqCount < 1) {
      getBanners();
    }

    // infoLoaded.value = true;
    reqCount += 1;
  } catch (err) {
    isAvailable.value = true;
    console.error('getGoodsInfo err=', err);
  } finally {
    infoLoaded.value = true;
  }
};

const getGoodsDetailInfo = async () => {
  if (detailLoaded.value) return;
  try {
    const res = await goodsDetailApi(goodsId);
    details.value = res;
    detailLoaded.value = true;
  } catch (err) {
    console.error('getGoodsDetailInfo err=', err);
  }
};

const getCartInfo = async () => {
  if (isEmpty(useCartStore().cartInfo)) {
    useCartStore().getCartInfo();
  }
};

const goShopPage = () => {
  Taro.reLaunch({
    url: '/pages/shop/shop',
  });
};

const onShareTrack = (shareTarge: ILinkflowShareTarge) => {
  if (!linkflow || !cSkuData.value) return;
  linkflow.track({
    event: ELinkflowEventsName.PrductDetail_Share,
    props: {
      skuId: cSkuData.value?.barcode || '',
      outerSkuId: cSkuData.value?.sn || '',
      miniSkuId: `${cSkuData.value?.id}`,
      currentPrice: (cSkuData.value?.price && +cSkuData.value?.price) || cSkuData.value?.price,
      shareTarge,
      shareStatus: '分享成功',
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};
</script>

<style lang="scss" module>
@import './goodsDetail.scss';
</style>
