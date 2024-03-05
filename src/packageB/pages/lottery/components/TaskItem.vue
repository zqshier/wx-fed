<template>
  <view :class="$style.layout_list" class="nut-flex">
    <view :class="$style.item_box" class="nut-flex-1 nut-flex nut-row-left nut-col-center">
      <image :class="$style.icon" :src="missionsData.image"></image>
      <view :class="$style.title" class="nut-flex-col nut-flex-1 nut-row-left nut-col-center f_s-16"
        ><text :class="$style.title_name">{{ missionsData.name }}</text>
        <text :class="$style.title_desc" class="nut-flex-1 f_s-12" v-if="missionsData.desc">{{
          missionsData.desc
        }}</text>
      </view>
      <view :class="[$style.tips, { [$style.tips_none]: isDisabled }]" class="f_s-12"
        >+{{ missionsData.rewardValue }} 次</view
      >
    </view>
    <nut-button
      v-if="!useUserStore().isMemberLevel"
      :disabled="isOut"
      :class="$style.btn"
      size="small"
      type="primary"
      @click="handleBtn"
      >登录领取</nut-button
    >
    <nut-button
      v-else
      :class="$style.btn"
      :plain="isDisabled"
      :disabled="isDisabled"
      :loading="btnLoading"
      size="small"
      type="primary"
      @click="handleBtn"
      >{{ btnText }}
    </nut-button>
  </view>
</template>
<script setup lang="ts">
import { getMissionsRewardsApi } from '@/api/missions';
import { LOGIN_TARGET, RECEIVE_CALLBACK } from '@/constants';
import { MISSIONS_CODE, MISSIONS_CODE_BTN_TEXT, MISSIONS_CODE_URL } from '@/constants/missions';
import { IMissions } from '@/dto/missions';
import useLoginPop from '@/hook/useLoginPop';
import { useDocumentStore, useUserStore } from '@/stores';
import { LinkType, Toast, getMissionsRecords, handleLink, isUrl } from '@/utils';
import Taro, { eventCenter } from '@tarojs/taro';
import { PropType, computed, onMounted, ref, watchEffect } from 'vue';

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  task: { type: Object as PropType<IMissions>, default: () => {} },
  isOut: { type: Boolean, default: false },
});

const missionsData = ref<IMissions>(props.task);
const btnLoading = ref<boolean>(false);
const article = ref<string>('');

// 解决props.task中值变化时missionsData响应不到问题
watchEffect(() => {
  missionsData.value = props.task;
});

const btnText = computed(() => {
  const data = missionsData.value;

  if (data.completes > 0 && data.receives < data.completes) {
    return '领取';
  }

  // 当前周期已全部领取，或者总完成次数已达到上限
  if (data.receives >= data.times || (data.timesTotal && data.completesTotal >= data.timesTotal)) {
    return '已领取';
  }

  return data.code === MISSIONS_CODE.signin ? '去领取' : MISSIONS_CODE_BTN_TEXT[data.code];
});

const isDisabled = computed((): boolean => {
  if (props.isOut) return true;
  return btnText.value === '已领取' ? true : false;
});

const isComplete = computed((): boolean => {
  return btnText.value.indexOf('领取') !== -1 ? true : false;
});

const handleBtn = async () => {
  checkMemberLevel(LOGIN_TARGET.missionLotteryPage);
  if (isDisabled.value) return;

  // 签到直接走领取逻辑
  if (missionsData.value.code === MISSIONS_CODE.signin) return handleSignin();

  if (isComplete.value) return await handleRewards();

  // 走去完成逻辑
  await handleGoComplete();
};

const handleSignin = () => {
  const { code, id } = missionsData.value;
  if (!code) return;
  btnLoading.value = true;
  getMissionsRecords({ code, missionId: id })
    .then(() => {
      setTimeout(async () => {
        try {
          const result = await getMissionsRewardsApi(id);
          Toast(`恭喜获得${result.rewardValue || 1}次抽奖机会`);
          missionsData.value.receives += 1;
          eventCenter.trigger(RECEIVE_CALLBACK, { missionId: missionsData.value.id });
        } catch (error) {
          Toast(error.message);
        } finally {
          btnLoading.value = false;
        }
      }, 300);
    })
    .catch(() => {
      btnLoading.value = false;
    });
};

// 跳转完成
const handleGoComplete = () => {
  const { code, link, meta, id } = missionsData.value;
  let type = isUrl(link) ? LinkType.h5 : LinkType.path;
  Taro.preload({ missionParams: { id, code } });
  // 如果有配置跳转路径 直接跳转
  if (link) return handleLink(type, link);

  // 没有配置跳转路径 设置默认配置 跳转
  let url = MISSIONS_CODE_URL[code];
  if (code === MISSIONS_CODE.question) url = `${MISSIONS_CODE_URL[code]}?id=${meta?.targetId}`;
  if (code === MISSIONS_CODE.subwxoa) url = article.value;

  handleLink(type, url);
};

// 领取奖励
const handleRewards = async () => {
  const { id } = missionsData.value;
  if (!id) return;

  btnLoading.value = true;

  let result;
  try {
    result = await getMissionsRewardsApi(id);
    console.debug('handleRewards: ', result);
  } catch (error) {
    Toast(error.message);
  } finally {
    btnLoading.value = false;
  }

  if (!result) return;
  eventCenter.trigger(RECEIVE_CALLBACK, { missionId: id, data: result });
  Toast(`恭喜获得${result.rewardValue}次抽奖机会`);
  missionsData.value.receives += 1;
};

onMounted(() => {
  const { code } = missionsData.value;
  if (code === MISSIONS_CODE.subwxoa) {
    useDocumentStore()
      .loadWxoaArticle()
      .then(link => {
        article.value = link;
      });
  }
});
</script>
<style lang="scss" module>
.layout_list {
  width: 311px;
  min-height: 56px;
  border-bottom: 0.5px solid $Divide;
  .item_box {
    padding: 12px 0;
  }
  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .title {
    // width: 126px;
    &_name {
      width: 100%;
      margin-bottom: 2px;
    }
    &_desc {
      width: 100%;
      color: $Tertiary;
    }
  }
  .tips {
    color: $Brand;
    text-align: right;
    padding-right: 10px;
    width: 50px;
    overflow: hidden;
    &_none {
      color: $Tertiary;
    }
  }
  .btn {
    min-width: 85px !important;
    padding: 0;
  }
}
.layout_list:first-child {
  border-top: 0.5px solid $Divide;
}
</style>
