<template>
  <BackgroundImage>
    <CustomBar title="" bg-color="transparent" :logo-color="LogoColorType.BLACK" />
    <view
      :class="$style.main"
      class="medalDetails_main nut-flex-col nut-row-center nut-col-center f_s-12"
      v-if="medalInfo && isLoaded"
    >
      <view :class="$style.main_title" class="f_s-24 f_w-600">{{ medalInfo.name }}</view>
      <view :class="$style.main_ratio">{{ ratio }}</view>
      <image
        mode="aspectFill"
        :src="hasOwnership ? medalInfo.image1 : medalInfo.image2"
        :lazy-load="true"
        :class="$style.main_image"
        @tap="handleSubscribe"
      ></image>
      <view :class="$style.main_finish" v-if="hasOwnership">
        <text>{{ medalInfo.greetings }}</text></view
      >

      <view :class="$style.main_description"
        ><text>{{ medalInfo.description }}</text>
        <text v-if="medalInfo.progress && medalInfo.progress[1] !== 0"
          >（{{ medalInfo.progress[0] }}/{{ medalInfo.progress[1] }}）</text
        >
      </view>
      <view :class="$style.main_progress" v-if="medalInfo.progress && medalInfo.progress[1] !== 0">
        <nut-progress :percentage="medalPercentage" :show-text="false" stroke-color="#787878" size="small" />
      </view>

      <nut-button
        shape="round"
        type="primary"
        :disabled="medalInfo.selected"
        :class="[$style.main_btn]"
        @click="wearMedal"
        v-if="hasOwnership"
      >
        {{ medalInfo.selected ? '已佩戴' : '佩戴勋章' }}
      </nut-button>
      <nut-button
        shape="round"
        type="primary"
        plain
        :class="[$style.main_btn, [$style['main_btn-no']]]"
        @click="goPage"
        v-else
      >
        {{ medalInfo.grantTips }}
      </nut-button>
    </view>

    <Loading :show="!isLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed, onMounted, ref } from 'vue';

import { medalsDetail, medalsSubscribe, medalsWear } from '@/api/medal';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import Loading from '@/components/Loading/Loading.vue';

import { LinkType } from '@/dto/banner';
import { IMedalsDetail } from '@/dto/medail';
import { useMedailStore } from '@/stores';
import { Toast, handleLink, isUrl, subscribeMessage } from '@/utils';

const routerInfo = Taro.getCurrentInstance().preloadData || {};

const medalId = routerInfo.data.medalId || null;
const medalInfo = ref<IMedalsDetail>(routerInfo.data || {});
const isLoaded = ref(false);
const loadingSubscribe = ref(false);

// 是否拥有勋章
const hasOwnership = computed(() => medalInfo.value?.createdAt);
const ratio = computed(() => `${(Number(medalInfo.value?.ratio) * 100).toFixed(2)}%用户拥有该勋章`);
// 进度条
const medalPercentage = computed(() => {
  if (!medalInfo.value.progress) return 0;
  return Number((medalInfo.value.progress[0] / medalInfo.value.progress[1]).toFixed(2)) * 100 || 0;
});

const goPage = () => {
  const link = medalInfo.value.link;
  if (!link) return;

  let type = isUrl(link) ? LinkType.h5 : LinkType.path;
  handleLink(type, link);
};

// 佩戴勋章
const wearMedal = async () => {
  if (!hasOwnership.value) return;

  try {
    await medalsWear(medalId);
    useMedailStore().selectedInfo = medalInfo.value;

    medalInfo.value.selected = true;
    Toast('佩戴成功，可在勋章列表查看');
  } catch (error) {
    console.log('wearMedal error: ', error);
    Toast('佩戴失败');
  }
};

const getMedalsDetail = async () => {
  let result;
  try {
    result = await medalsDetail(medalId);
  } catch (error) {
    console.log('error: ', error);
    Toast(error.message);
  } finally {
    isLoaded.value = true;
  }

  if (!result) return;
  medalInfo.value = result;
};

// 订阅
const handleSubscribe = async () => {
  if (hasOwnership.value || medalInfo.value.subscribed || loadingSubscribe.value) return;
  loadingSubscribe.value = true;

  const mid = process.env.MEDALS_MID as string;

  try {
    const res = await subscribeMessage([mid]);
    console.log('res: ', res);
    if (res[mid] === 'reject') throw new Error('订阅失败');
    if (res[mid] !== 'accept') return;

    await medalsSubscribe(medalId, {
      tplId: mid,
      page: 'pages/landing/landing?page=packageA/pages/medal/medalList/medalList',
    });

    medalInfo.value.subscribed = true;
    Toast('订阅成功');
  } catch (error) {
    console.error('handleSubscribe error', error);
    Toast('订阅失败');
  } finally {
    loadingSubscribe.value = false;
  }
};

onMounted(async () => {
  await getMedalsDetail();
});
</script>

<style lang="scss">
.medalDetails_main {
  .nut-progress-inner {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }
}
:root,
page {
  --nut-progress-small-height: 2px;
}
</style>
<style lang="scss" module>
.main {
  color: $Primary;

  &_title {
    width: 240px;
    line-height: 32px;
    text-align: center;
    margin-top: 56px;
  }
  &_ratio {
    margin-top: 8px;
    color: $Tertiary;
  }
  &_image {
    margin: 32px 0 32px 18px;
    width: 169px;
    height: 208px;
    // background: $Tertiary;
  }
  &_finish {
    max-width: 300px;
    text-align: center;
    color: $Tertiary;
    line-height: 18px;
  }
  &_description {
    margin: 32px 0 15px 0;
  }
  &_progress {
    width: 165px;
  }
  &_btn {
    margin-top: 56px;
    width: 222px;
    height: 44px;
    &-no {
      background: transparent;
      color: $Primary;
      border: 1px solid $Primary;
    }
  }
}
</style>
