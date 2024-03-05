<template>
  <BackgroundImage :class="$style.layout" :image-url="imageProcess(pondData?.image || '', 'L')">
    <CustomBar :fixed="true" :logo-color="LogoColorType.BLACK" bg-color="transparent" />

    <view v-if="!pondData" :class="$style.loading" class="nut-flex nut-row-center">
      <Loading1 />
    </view>
    <view v-if="pondData?.code" class="nut-flex-col nut-flex-1 nut-row-top" :class="$style.main">
      <!-- 奖池 -->
      <Prizes
        :tickets="lotteryNum"
        :data="pondData"
        :id="id"
        :isOut="activityOut"
        @prize-click="handlePrizeClick"
        @rule-click="popRules = true"
      />
      <!-- 任务 -->
      <Task v-if="showTask" :metaData="pondData?.missions" :isOut="activityOut" />
      <!-- 奖品列表 -->
      <PrizesList v-if="pondData?.awards && pondData.awards.length > 0" :list="pondData.awards" />
    </view>

    <!-- 抽奖规则 -->
    <PopRules v-model:isShow="popRules" :code="`lottery-rule-${id}`"></PopRules>
    <!-- 中奖 -->
    <PopWinPrize
      v-if="prizeData.show"
      v-model:isShow="prizeData.show"
      :awardData="prizeData.awardData"
      :come-data="prizeData.comeData"
    />
    <!-- 用户授权 -->
    <PopLogin v-model:isShow="showLoginPop" :target="loginTarget" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getPond } from '@/api/prizes';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import { MISSIONS_CODE, RECEIVE_CALLBACK } from '@/constants';
import { IAwardsItem, IPondInfo } from '@/dto/prizes';
import { UserInfo } from '@/dto/user';
import useLoginPop from '@/hook/useLoginPop';
import { useUserStore } from '@/stores';
import { Toast, imageProcess, shareOptions } from '@/utils';
import { Loading1 } from '@nutui/icons-vue-taro';
import Taro, { eventCenter, useDidHide, useDidShow, useRouter, useShareAppMessage } from '@tarojs/taro';
import { computed, onMounted, onUnmounted, provide, reactive, ref } from 'vue';
import PopLogin from './components/PopLogin.vue';
import PopRules from './components/PopRules.vue';
import PopWinPrize from './components/PopWinPrize.vue';
import Prizes from './components/Prizes.vue';
import PrizesList from './components/PrizesList.vue';
import Task from './components/Task.vue';

const router = useRouter();
const userStore = useUserStore();
const { visible: showLoginPop, target: loginTarget, onRegisterEvent, offRegisterEvent } = useLoginPop();

const popRules = ref<boolean>(false);
const pondData = ref<IPondInfo>();
const prizeData = reactive<{ show: boolean; awardData: IAwardsItem | null; comeData: any }>({
  show: false,
  awardData: null,
  // awardData: {
  //   createdAt: '2024-01-12T07:38:54.987Z',
  //   id: 84536,
  //   image: 'https://res.dev.center.ugrow.cn/app-zippo/2024/01/d292c9485b004b348d04bc6eb51285da.png',
  //   image2: 'https://res.dev.center.ugrow.cn/app-zippo/2023/12/3fdd94455cf2496187dfdf03a7ed03f0.png',
  //   name: '1000小火苗',
  //   position: 6,
  //   result: '',
  //   state: 'pending',
  //   tips: '',
  //   type: 'point',
  // },
  comeData: {},
});

/** 奖池编码 */
const id = ref<string>(router.params.id || '');
/** 抽奖资格编码 */
const code = ref<string>(router.params.code || '');
/** 抽奖次数 */
const lotteryNum = ref<number>(0);
/** 活动下架 */
const activityOut = ref<boolean>(false);

const isOnMounted = ref<boolean>(true);

/** 中奖后查看详情跳转需要的参数 ljwilghi-q6q sYpIVPPmIzInthUZR3fM j5afyke5l_3v eSfJXkOnlxPymbEVBY0H */
provide('id', id);

const userInfo = computed((): UserInfo => userStore.getUserInfo!);
const showTask = computed(() => !!pondData.value?.missions?.length && !activityOut.value);

/** 获取奖池信息 */
const getPondInfo = async () => {
  if (!id.value) return;

  let result = null as unknown as IPondInfo;
  try {
    result = await getPond(id.value, code.value);
  } catch (err) {
    console.error('err', err);
  }

  if (!result?.id) return;

  result.awards.sort((a, b) => b.position - a.position);

  const missionsImgMap = {
    [MISSIONS_CODE.subwxoa]: require('../../image/icon_subwxoa.png'),
    [MISSIONS_CODE.invitemember]: require('@/static/icon/invite.png'),
    [MISSIONS_CODE.signin]: require('@/static/icon/sign.png'),
    [MISSIONS_CODE.pageview]: require('@/static/icon/gift.png'),
  };

  result.missions = result.missions
    .map(i => ({ ...i, image: missionsImgMap[i.code] }))
    .sort((a, b) => b.position - a.position);

  if (result.valid === true) {
    Toast('恭喜你获得一次抽奖机会', 2000);
  } else if (result.valid && isOnMounted.value) {
    Toast(result.valid, 2000);
  }

  pondData.value = result;

  lotteryNum.value = result.tickets;

  // 奖池已下架;
  if (result.disabled) return (activityOut.value = true);
  timeVerify();
};

const timeVerify = () => {
  const nowTime = new Date().getTime();
  const endTime = new Date(pondData.value!.end).getTime();

  if (nowTime < endTime) return;
  activityOut.value = true;
};

// const authFlow = () => {
//   if (!userStore.isMemberLevel) {
//     showLoginPop.value = true;
//     return false;
//   } else {
//     const { isRecommend, sid } = router.params;
//     if (isRecommend && sid !== userInfo.value.sid) return true;
//   }
// };

const taskOnReceived = async (arg: { missionId: number }) => {
  if (!pondData.value?.missions?.find(o => o.id === arg.missionId)) return;
  await getPondInfo();
};

const receiveCb = () => {
  eventCenter.on(RECEIVE_CALLBACK, taskOnReceived);
};

// const registerMemberCb = () => {
//   loginTarget.value = 'lottery';
//   Taro.eventCenter.off(TARGET_PHOME_AUTH_CALLBACK);
//   Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, async (arg, res) => {
//     console.log('arg:----- ', arg, res);
//     await getPondInfo();

//     if (res.missionRewards.length === 0) return;
//     Toast(`助力成功，获得${res.missionRewards[0].rewardValue}次抽奖机会`, 2000);
//   });
// };

const handlePrizeClick = e => {
  prizeData.show = e.show || false;
  prizeData.awardData = e.awardData || {};
  prizeData.comeData = e.comeData || {};
};

useShareAppMessage(() => {
  const params = { id: id.value, isRecommend: true, sid: userInfo.value.sid };
  const title = pondData.value?.shareTitle || '';
  const imageUrl = pondData.value?.shareImage || '';
  const shareReturn = shareOptions({ page: '/packageB/pages/lottery/lottery', params, title, imageUrl });
  console.debug('lottery: useShareAppMessage path=', shareReturn.path);
  return { ...shareReturn };
});

useDidShow(async () => {
  // userStore.getInintNoMembers(); // 测试非会员注册
  onRegisterEvent();
  await getPondInfo();
  isOnMounted.value = false;
});

useDidHide(() => {
  offRegisterEvent();
});

onMounted(async () => {
  if (!id.value) Taro.reLaunch({ url: '/pages/index/index' });

  receiveCb();
  // registerMemberCb();
  // const res = await authFlow();
  // if (res) return Toast(`助力失败，您不满足新用户要求`, 2000);
});

onUnmounted(() => {
  // clearTimeout(pollingSetting.timer);
  eventCenter.off(RECEIVE_CALLBACK, taskOnReceived);
});
</script>

<style lang="scss" module>
@import './lottery.scss';
</style>
