<template>
  <BackgroundImage>
    <CustomBar title="活动详情" />

    <view :class="$style.main" v-if="isLoaded">
      <view :class="$style.swiper">
        <CustomSwiper :height="toPx(320)" :list="detailBanners" :autoplay="false" />
      </view>

      <view :class="$style.item_img" v-for="(item, index) in detailInfo?.detail.detailImage" :key="index">
        <image
          :class="$style.image"
          :data-id="imageProcess(item, 'L', 'png')"
          :src="imageProcess(item, 'L', 'png')"
          mode="widthFix"
          :lazy-load="true"
          :show-menu-by-longpress="true"
        />
      </view>

      <view v-if="detailInfo && startTime" :class="$style.start_time" class="f_s-14 f_w-400"
        >{{ format(new Date(detailInfo.detail.start), 'yyyy-MM-dd HH:mm') }} 报名开始</view
      >
      <view :class="$style.footer" class="nut-flex nut-row-between nut-col-center">
        <nut-button class="nut-flex-1" :disabled="endTime" type="primary" @click="handleShowPop">{{
          butText
        }}</nut-button>
      </view>
    </view>
    <Loading :show="!isLoaded" />

    <PopUserPhone v-model:isShow="showLoginPop" :target="loginTarget"></PopUserPhone>
    <PopUserDetails
      v-model:isShow="showUserDetailsPop"
      :detailsData="detailInfo"
      @refresh="getDetailData"
    ></PopUserDetails>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { actSubscribe, getActInfo } from '@/api/activity';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import CustomSwiper from '@/components/CustomSwiper/CustomSwiper.vue';
import Loading from '@/components/Loading/Loading.vue';
import PopUserPhone from '@/components/PopLogin/PopLogin.vue';
import { toPx } from '@/components/PosterBuilder/utils/tools';
import { LOGIN_TARGET, TARGET_LOCATION_CHANGE } from '@/constants/base';
import { IActInfo } from '@/dto/activity';
import { IBanner } from '@/dto/banner';
import useLoginPop from '@/hook/useLoginPop';
import { LinkType, Toast, imageProcess, shareOptions, subscribeMessage } from '@/utils';
import Taro, { useRouter, useShareAppMessage } from '@tarojs/taro';
import { format } from 'date-fns';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import PopUserDetails from './components/PopUserDetails/PopUserDetails.vue';

const router = useRouter();

const {
  visible: showLoginPop,
  target: loginTarget,
  onRegisterEvent,
  offRegisterEvent,
  checkMemberLevel,
} = useLoginPop();

const detailId = ref(Number(router.params.id));

const detailInfo = ref<IActInfo>();
const showUserDetailsPop = ref<boolean>(false);
const isLoaded = ref<boolean>(false);
const isClick = ref<boolean>(true);

const detailBanners = computed((): IBanner[] => {
  const banners: IBanner[] = [];
  const banner: IBanner = {
    src: '',
    group: '',
    srcType: 'image',
    link: '',
    linkType: LinkType.none,
    id: 0,
    desc: '',
  };

  detailInfo.value?.detail.mainImage.forEach(item => {
    const bannerObj = { ...banner };
    bannerObj.src = String(item);
    banners.push(bannerObj);
  });

  return banners;
});

/** 开始时间 */
const startTime = computed(() => {
  if (!detailInfo.value?.detail.start) return false;
  return Date.now() < new Date(detailInfo.value?.detail.start).getTime() || false;
});

/** 结束时间 */
const endTime = computed(() => {
  if (!detailInfo.value?.detail.end) return false;
  return Date.now() > new Date(detailInfo.value?.detail.end).getTime() || false;
});

const butText = computed(() => {
  if (startTime.value) {
    if (detailInfo.value?.isSubscribe) return '预约成功';
    return '活动报名开始通知';
  }
  if (endTime.value) return '活动报名已结束';
  if (detailInfo.value?.isSignUp) return '报名成功，请等待通知';
  return '我要报名';
});

function handleShowPop() {
  if (endTime.value || !isClick.value) return;

  checkMemberLevel(LOGIN_TARGET.signupActivity, handleShowPop);

  if (startTime.value) {
    isClick.value = false;
    handleSubscribe();
    return;
  }

  showUserDetailsPop.value = true;
}

// 订阅
const handleSubscribe = async () => {
  if (detailInfo.value?.isSubscribe) return;
  const mid = process.env.ACTIVITY_START_MID as string;

  const params = {
    activityId: detailId.value,
    templateId: mid,
    isSubscribe: true,
  };

  try {
    const res = await subscribeMessage([mid]);
    if (res[mid] === 'reject') {
      params.isSubscribe = false;
    }

    isClick.value = true;

    await actSubscribe(params);
    detailInfo.value!.isSubscribe = true;

    Toast('预约成功');
  } catch (error) {
    console.error('handleSubscribe error', error);
    Toast('预约失败');
  }
};

async function getDetailData() {
  let result;
  try {
    result = await getActInfo({ activityId: detailId.value });
    console.log('result: ', result);
  } catch (error) {
    Toast(error.message);
    console.error('getActInfo: error', error);
  }

  if (!result) return;

  detailInfo.value = result;
  isLoaded.value = true;
}

useShareAppMessage(() => {
  const params = { id: detailId.value };
  const shareReturn = shareOptions({
    page: '/packageA/pages/events/eventDetails/eventDetails',
    params,
    title: detailInfo.value?.detail.title || '',
    imageUrl: detailInfo.value?.detail.shareImage || '',
    useDefaultImage: false,
  });
  console.debug('eventDetails page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});

onMounted(async () => {
  onRegisterEvent();
  await getDetailData();
});

onUnmounted(() => {
  console.debug('settlement onUnmounted');
  Taro.eventCenter.off(TARGET_LOCATION_CHANGE);
  offRegisterEvent();
});
</script>

<style lang="scss" module>
.main {
  margin-bottom: 90px;
  padding: 24px 16px;
  width: 100%;
  z-index: 2;
  .swiper {
    width: 100%;
    height: 160px;
    margin-bottom: 24px;
  }

  .item_img {
    width: 100%;
    text-align: center;
  }
  .image {
    width: 343px;
    display: inline-block;
  }
}
.start_time {
  width: 100%;
  position: fixed;
  bottom: 88px;
  left: 0;
  color: #000;
  text-align: center;
  font-family: 'FZLanTingHeiS-R-GB';
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  min-height: 88px;
  padding: 8px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: 24px 24px 0 0;
  background: rgba($color: $white, $alpha: 0.8);
  backdrop-filter: blur(10px);
  .btn {
    background: #333;
  }
  .btn_end {
    background: rgba($color: #333, $alpha: 0.6);
  }
}
</style>
