<template>
  <BackgroundImage :class="$style['layout']">
    <CustomBar title="我的礼券" />

    <view class="nut-flex nut-row-between nut-col-center" :class="$style.box">
      <block v-for="(item, index) in tabDatas" :key="item.name">
        <view
          class="nut-flex-col nut-col-center nut-row-center f_s-12 f_w-400"
          :class="$style.item"
          @tap="handleItem(index)"
        >
          <text :class="[$style['item_name'], { [$style['item_name-selected']]: swiperCurrent === index }]">{{
            item.name
          }}</text>
        </view>
      </block>
    </view>

    <swiper :class="$style.swiper_box" class="nut-flex-1" :current="swiperCurrent" @change="swiperChange">
      <view
        v-if="showGetCoupon"
        :class="$style.couponCenter"
        class="border-05px-box-16 rounded_corners-8 nut-flex nut-row-center"
        @tap="goCouponCenter"
      >
        <image :class="$style.couponCenter_icon" src="@/static/icon/coupon.png" />
        <text :class="$style.couponCenter_title" class="f_s-16">领券中心</text>
        <image :class="$style['couponCenter_icon-right']" src="@/static/icon/chevron-right.png" />
      </view>

      <block v-for="(item, index) in tabDatas" :key="index">
        <swiper-item :class="$style.swiper_item">
          <scroll-view
            :class="[$style['swiper_item-view'], { [$style['swiper_item-height']]: !showGetCoupon }]"
            :scroll-y="true"
            :scroll-top="scrollTop"
            @scroll="handleScroll"
            @scrolltolower="scrollReachBottom"
          >
            <block v-if="item.loaded && isLoading">
              <view v-if="item.list.length > 0" :class="$style.main">
                <block v-for="cop in item.list" :key="cop.code">
                  <CouponBox :itemData="cop" :status="item.params.status" :isShowBtn="true" />
                </block>
              </view>
              <view v-else class="nut-flex nut-flex-1 nut-col-center nut-row-center" :class="$style.no_data">
                <DefaultPage
                  imgWidth="48"
                  imgHeight="48"
                  imgMbottom="20"
                  :icon="require('@/static/icon/no-coupon.png')"
                  tip="暂无优惠券"
                />
              </view>
            </block>
            <view v-if="!item.loaded && !isLoading" :class="$style.load" class="nut-flex nut-row-center">
              <Loading1 />
            </view>
          </scroll-view>
        </swiper-item>
      </block>
    </swiper>
  </BackgroundImage>
</template>

<script setup lang="ts">
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CouponBox from '@/components/CouponBox/CouponBox.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import { useCouponStore } from '@/stores';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import { Loading1 } from '@nutui/icons-vue-taro';
import Taro, { getApp, nextTick, useDidHide, useDidShow } from '@tarojs/taro';
import { computed, onMounted, ref } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();
const couponStore = useCouponStore();
// const curIndex = ref<number>(0);
const swiperCurrent = ref<number>(0);
const scrollTop = ref<number>(0);
const oldScroll = ref<{ scrollTop: number }>({ scrollTop: 0 });
const isLoading = ref<boolean>(false);

const tabDatas = computed(() => couponStore.datas);
const couponCenterList = computed(() => {
  return couponStore.couponCenterList;
});

const showGetCoupon = computed(() => {
  return couponCenterList.value.length > 0 && swiperCurrent.value === 0;
});

useDidShow(async () => {
  tabDatas.value[swiperCurrent.value].loaded = false;
  isLoading.value = false;

  await init();
});

// 跳转领券中心,提前充值页面数据,避免返回时页面闪烁
useDidHide(() => {
  couponStore.$reset();
});

onMounted(() => {
  couponStore.$reset();
});

const init = async () => {
  await fetchList();
  await couponStore.getCouponCenterList();

  isLoading.value = true;
};

const fetchList = async () => {
  const data = tabDatas.value[swiperCurrent.value];
  return couponStore.load(data.type);
};

const goCouponCenter = () => {
  linkflow &&
    linkflow.track({
      event: ELinkflowEventsName.CouponCenter_View,
      props: { triggerPagePath } as ILinkflowEventsProps,
    });

  Taro.navigateTo({
    url: `/packageA/pages/coupon/couponCenter/couponCenter`,
  });
};

// tabs通知swiper切换
const handleItem = (index: number) => {
  swiperCurrent.value = index;
  // curIndex.value = index;
  scrollGoTop();
};

const swiperChange = e => {
  const current = e.detail.current;
  swiperCurrent.value = current;
  fetchList();
};

// 回到顶部
const scrollGoTop = () => {
  scrollTop.value = oldScroll.value.scrollTop;
  nextTick(() => {
    scrollTop.value = 0;
  });
};

const scrollReachBottom = () => {
  fetchList();
};

const handleScroll = e => {
  oldScroll.value.scrollTop = e.detail.scrollTop;
};
</script>

<style lang="scss" module>
.layout {
  height: 100vh;
  .box {
    width: 375px;
    padding: 24px 16px 8px 16px;
    box-sizing: border-box;
    background: $white;
    border-bottom: 0.5px solid var(--divide, #d9d9d9);
    z-index: 2;
    .item {
      position: relative;
      width: 114px;
      font-family: 'FZLanTingHei-R-GBK';
      .item_name {
        color: $Tertiary;
        z-index: 2;
        &-selected {
          color: $Primary;
          font-weight: 600;
        }
      }
      // .item_active {
      //   position: absolute;
      //   top: 14px;
      //   left: 0;
      //   width: 100%;
      //   height: 6px;
      //   background: $Primary;
      //   z-index: 1;
      //   opacity: 0;
      //   &-selected {
      //     opacity: 1;
      //   }
      // }
    }
  }
  .no_data {
    padding-top: 160px;
  }

  .swiper_box {
    max-height: 100%;
    .swiper_item {
      height: 100%;
      .swiper_item-view {
        width: 100%;
        height: 91%;
        .main {
          width: 100%;
          padding: 16px;
          .main_item {
            margin-bottom: 12px;
          }
        }
      }
      .swiper_item-height {
        height: 100%;
      }
    }
  }

  .couponCenter {
    margin: 0 auto;
    margin-top: 16px;
    padding: 16px;
    width: 343px;
    height: 48px;
    background: #fff;

    &_icon {
      width: 24px;
      height: 24px;
    }
    &_title {
      width: 259px;
      margin: 0 8px;
      color: var(--primary, #333);
      font-family: 'FZLanTingHei-R-GBK';
    }
    &_icon-right {
      width: 12px;
      height: 12px;
    }
  }
}
.load {
  width: 100%;
  height: 100%;
}
</style>
