<template>
  <view class="container" :class="$style.layout">
    <view :class="$style.header" :style="{ height: pxTransform(headerHeight) }">
      <CustomBar title="会员权益" :bg-color="navSwitch ? '#fff' : 'transparent'" :is-placeholder="false" />

      <view :class="$style.swiper">
        <view :style="{ height: `${fillHeight}px` }"></view>
        <swiper :class="$style.swiper_box" :circular="false" :current="swiperIndex" @change="change">
          <swiper-item :class="$style.swiper_item" v-for="(item, index) in memberRightsData" :key="index">
            <image
              :class="$style.image"
              :src="
                cdnurl(
                  (Number(userInfo.memberLevel?.replace('vip', '')) === swiperIndex + 1 && item.imageSelct) ||
                    item.image,
                )
              "
              :style="{
                left: index === swiperIndex ? pxTransform(index === 0 ? 12 : 24) : pxTransform(36),
              }"
              mode="aspectFill"
            />
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view
      :class="$style.main"
      class="nut-flex-col nut-row-center nut-col-center"
      :scroll-y="true"
      :enhanced="true"
      :show-scrollbar="false"
    >
      <view :class="$style.main_top">
        <view :class="$style.top_item" class="nut-flex nut-flex-col nut-row-center">
          <view :class="$style.title" class="f_s-16">{{ memberRightsData[swiperIndex].levelName }}权益</view>
          <view :class="$style.info" class="nut-flex-1 nut-flex nut-row-between nut-flex-wrap">
            <view
              v-for="(item, i) in memberRightsData[swiperIndex].list"
              :key="i"
              class="nut-flex-col nut-row-between nut-col-center"
              :class="$style.info_item"
            >
              <image :class="$style.icon" :src="item.image"></image>
              <text>{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <block v-for="(item, index) in descInfo" :key="index">
        <view :class="[$style.main_item, index === descInfo.length - 1 ? $style.border_none : '']">
          <view :class="$style.title" class="f_s-16">{{ item.title }}</view>
          <view :class="$style.main_list" v-for="(ctx, idx) in item.content" :key="idx" class="f_s-12">
            <text v-if="typeof ctx === 'string'" :class="$style.name">{{ ctx }}</text>
            <block v-if="typeof ctx === 'object'">
              <view v-for="(val, vIdx) in ctx.values" :key="vIdx" class="nut-flex nut-row-left nut-col-top">
                <text
                  v-if="val.type === 'li'"
                  :style="{
                    width: `${String(ctx.values.length).length * 8 + 8}px`,
                    textAlign: 'right',
                  }"
                  >{{ vIdx }}.&nbsp;</text
                >
                <text class="nut-flex-1" :class="$style.name">{{ val.value }}</text>
              </view>
            </block>
          </view>
        </view>
      </block>
      <view style="height: 32px"></view>
    </view>
  </view>
</template>
<script setup lang="ts">
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { UserInfo } from '@/dto/user';
import { useAppStore, useUserStore } from '@/stores';
import { cdnurl, shareOptions } from '@/utils';
import { pxTransform, usePageScroll, useShareAppMessage } from '@tarojs/taro';
import { computed, ref } from 'vue';
import { descInfo, memberRightsData } from './data';

const userStore = useUserStore();

const navSwitch = ref(false);

const userInfo = computed((): UserInfo => userStore.getUserInfo!);
const fillHeight = computed(() => useAppStore().sysInfo.statusBarHeight!);
const headerHeight = computed(() => fillHeight.value + 300);

const swiperIndex = ref(0);

const change = e => {
  const { current } = e.detail;
  swiperIndex.value = current;
};

usePageScroll(e => {
  const { scrollTop } = e;
  navSwitch.value = scrollTop > headerHeight.value - fillHeight.value - 32;
});

useShareAppMessage(() => {
  const shareReturn = shareOptions({ page: '/packageA/pages/memberRights/memberRights' });
  console.debug('memberRights page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});
</script>
<style lang="scss" module>
.layout {
  width: 375px;
  overflow: hidden;
  .header {
    margin-bottom: -32px;
    .swiper {
      &_box {
        width: 477px;
        height: 297px;

        .swiper_item {
          overflow: initial;
        }
        .image {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .main {
    width: 375px;
    border-radius: 32px 32px 0 0;
    background: rgba($color: $Tertiary, $alpha: 0.08);
    box-shadow: -16px 16px 16px 0 rgba(255, 255, 255, 0.08) inset 16px -16px 16px 0 rgba(165, 165, 165, 0.08) inset;
    backdrop-filter: blur(7.7px);
    &_top {
      .top_item {
        width: 327px;
        padding-top: 32px;
        padding-bottom: 24px;
        margin: 0 auto;
        border-bottom: 0.5px solid $Divide;
        .title {
          margin-bottom: 24px;
        }
        .info {
          width: 100%;
          margin-bottom: -8px;
          &_item {
            min-width: 109px;
            margin-bottom: 24px;
            .icon {
              width: 24px;
              height: 24px;
              margin-bottom: 4px;
            }
          }
        }
      }
    }
    &_item {
      width: 327px;
      padding-top: 24px;
      padding-bottom: 8px;
      margin: 0 auto;
      border-bottom: 0.5px solid $Divide;

      .title {
        width: 327px;
        text-align: center;
        line-height: 24px;
        margin-bottom: 16px;
      }
      .main_list {
        line-height: 18px;
        margin-bottom: 16px;
        .name {
          line-height: 18px;
          letter-spacing: 0.24px;
          word-break: break-all;
        }
      }
    }

    .border_none {
      border: none;
    }
  }
}
</style>
