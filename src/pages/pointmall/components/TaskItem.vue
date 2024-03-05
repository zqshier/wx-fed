<template>
  <view :class="$style.layout_list" class="nut-flex">
    <view :class="$style.item_box" class="nut-flex-1 nut-flex nut-row-left nut-col-center">
      <image :class="$style.icon" :src="missionsData.image"></image>
      <view :class="$style.title" class="nut-flex-col nut-row-left nut-col-center f_s-16"
        ><text :class="$style.title_name">{{ missionsData.name }}</text>
        <text :class="$style.title_desc" class="nut-flex-1 f_s-12" v-if="missionsData.desc">{{
          missionsData.desc
        }}</text>
      </view>
      <view :class="[$style.tips, { [$style.tips_none]: isDisabled }]" class="f_s-12" v-if="showReward"
        >+{{ missionsData.rewardValue }} 小火苗</view
      >
    </view>
    <nut-button v-if="!useUserStore().isMemberLevel" :class="$style.btn" size="small" type="primary" @click="handleBtn"
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
      >{{ !btnLoading ? btnText : '' }}
    </nut-button>
  </view>
</template>
<script setup lang="ts">
import { getMissionsRewardsApi } from '@/api/missions';
import { LOGIN_TARGET } from '@/constants';
import { MISSIONS_CODE, MISSIONS_CODE_BTN_TEXT, MISSIONS_CODE_URL } from '@/constants/missions';
import { ELinkflowEventsName, ILinkflowEventsProps, ILinkflowTaskStatus } from '@/dto/events';
import { IMissions } from '@/dto/missions';
import useLoginPop from '@/hook/useLoginPop';
import { useDocumentStore, usePointStore, useUserStore } from '@/stores';
import { LinkType, Toast, handleLink, isUrl } from '@/utils';
import { getRefererPath } from '@/utils/track/config';
import { getApp } from '@tarojs/taro';
import { PropType, computed, onMounted, ref, watchEffect } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const { checkMemberLevel } = useLoginPop();

const props = defineProps({
  task: {
    type: Object as PropType<IMissions>,
    default: () => {},
  },
});

// const emits = defineEmits(['update:showLoginPop']);
const emits = defineEmits(['update:showLoginPop', 'siginIn']);

const missionsData = ref<IMissions>(props.task);
const hideRewards = ref([MISSIONS_CODE.uploadorder, MISSIONS_CODE.signin]);
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

  return MISSIONS_CODE_BTN_TEXT[data.code];
});

const isDisabled = computed((): boolean => {
  return btnText.value === '已领取' ? true : false;
});

const showReward = computed((): boolean => {
  return !hideRewards.value.includes(missionsData.value.code);
});

const isComplete = computed((): boolean => {
  return btnText.value.indexOf('领取') !== -1 ? true : false;
});

const handleBtn = async () => {
  checkMemberLevel(LOGIN_TARGET.missionPointMallPage);
  if (isDisabled.value) return;

  // 签到直接领取
  if (missionsData.value.code === MISSIONS_CODE.signin) return emits('siginIn', missionsData.value);

  if (isComplete.value) {
    await handleRewards();
    return;
  }

  // 走去完成逻辑
  await handleGoComplete();
};

// 跳转完成
const handleGoComplete = () => {
  const { code, link, meta } = missionsData.value;
  let type = isUrl(link) ? LinkType.h5 : LinkType.path;
  // 如果有配置跳转路径 直接跳转
  onTaskClickTrack('待完成');
  if (link) return handleLink(type, link);
  // 没有配置跳转路径 设置默认配置 跳转
  let url = MISSIONS_CODE_URL[code];
  if (code === MISSIONS_CODE.question) url = `${MISSIONS_CODE_URL[code]}?id=${meta?.targetId}`;
  if (code === MISSIONS_CODE.subwxoa) url = article.value;

  handleLink(type, url);
  // switch (code) {
  //   case MISSIONS_CODE.goodsfav:
  //     Taro.switchTab({ url });
  //     return;
  //   case MISSIONS_CODE.goodsrate:
  //     Taro.switchTab({ url });
  //     return;
  //   case MISSIONS_CODE.invitemember:
  //     // 邀请好友
  //     Taro.navigateTo({ url: `${url}?code=${code}` });
  //     return;
  //   case MISSIONS_CODE.pageview:
  //     // 浏览商城
  //     if (link?.startsWith('/')) {
  //       handleLink(LinkType.path, link);
  //       return;
  //     }
  //     Taro.switchTab({ url });
  //     return;
  //   case MISSIONS_CODE.share:
  //     // 分享商品
  //     Taro.switchTab({ url });
  //     return;
  //   case MISSIONS_CODE.uploadorder:
  //     // 上传订单
  //     if (link?.startsWith('/')) {
  //       handleLink(LinkType.path, link);
  //       return;
  //     }

  //     Taro.navigateTo({ url });
  //     return;
  //   case MISSIONS_CODE.question:
  //     Taro.navigateTo({ url: `${url}?id=${meta?.targetId}` });
  //     return;
  //   case MISSIONS_CODE.subwxoa:
  //     handleLink(LinkType.h5, article.value);
  //     return;
  //   default:
  //     Taro.navigateTo({ url });
  //     return;
  // }
};

// 领取奖励
const handleRewards = async () => {
  const { id } = missionsData.value;
  if (!id) return;

  btnLoading.value = true;

  try {
    const result = await getMissionsRewardsApi(id);
    console.debug('handleRewards: ', result);
    missionsData.value.receives += 1;

    await usePointStore().load(); // 实时更新积分

    Toast(`领取成功，小火苗+${result.rewardValue}`);

    onTaskClickCompleteTrack();
    onTaskClickTrack('已完成');
  } catch (error) {
    Toast(error.message);
  } finally {
    btnLoading.value = false;
  }
  // Taro.eventCenter.trigger(RECEIVE_CALLBACK, { missionId: id, data: res });
};

// function handleShowLoginPop() {
//   emits('update:showLoginPop', true);
// }

const onTaskClickTrack = (taskStatus: ILinkflowTaskStatus) => {
  // 埋点 互动任务_点击
  if (!linkflow) return;
  const { id, name } = missionsData.value;
  linkflow.track({
    event: ELinkflowEventsName.InteractiveTask_Click,
    props: { taskName: name, taskId: `${id}`, taskStatus, triggerPagePath } as ILinkflowEventsProps,
  });
};

const onTaskClickCompleteTrack = () => {
  // 埋点 互动任务_完成_领取奖励
  if (!linkflow) return;
  const { id, name } = missionsData.value;
  linkflow.track({
    event: ELinkflowEventsName.InteractiveTask_Complete_ReceiveAward,
    props: { taskName: name, taskId: `${id}`, receiveWay: '手动领取', triggerPagePath } as ILinkflowEventsProps,
  });
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
  width: 327px;
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
    width: 128px;
    &_name {
      width: 100%;
      margin-bottom: 2px;
    }
    &_desc {
      width: 100%;
      color: $Tertiary;
      font-family: 'FZLanTingHei-R-GBK';
    }
  }
  .tips {
    color: $Brand;
    text-align: right;
    padding-right: 10px;
    font-family: 'FZLanTingHei-R-GBK';
    width: 81px;
    overflow: hidden;
    &_none {
      color: $Tertiary;
    }
  }
  .btn {
    min-width: 86px;
  }
  .btn_width {
    padding: 0 20px;
  }
}
.layout_list:first-child {
  border-top: 0.5px solid $Divide;
}
</style>
