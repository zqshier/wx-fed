<template>
  <BackgroundImage :class="$style.layout">
    <!-- <view class="container" :class="$style.layout"> -->
    <PopLogin
      v-model:is-show="showLoginPop"
      :target="loginTarget"
      :close-on-click-overlay="false"
      :closeable="false"
      z-index="1999"
    />

    <CustomBar title="防伪验真" />

    <view :class="$style.main" class="nut-flex-col nut-row-center nut-col-top" v-if="isLoaded">
      <view :class="$style.title" class="nut-flex-col nut-row-center nut-col-center">
        <LottieView
          key="verifySuccess"
          :class="$style.icon_success"
          :autoplay="true"
          :loop="false"
          assets-path="static/success3.json"
          :config="{ width: 48, height: 48 }"
        />

        <text class="f_s-20">ZIPPO 官方正品防伪码</text>
      </view>

      <view v-if="qrData?.product" :class="$style.goods" class="nut-flex-col nut-row-center nut-col-center">
        <text>{{ qrData.product.name }}</text>
        <image v-if="qrData.product.qrPhoto" :class="$style.image" :src="qrData.product.qrPhoto"></image>
      </view>

      <view :class="$style.info">
        <view :class="$style.title">{{ verifyMessage }}</view>
        <view v-if="isExceedMaxLen" :class="[$style.title, $style.warn_tips]" class="f_s-14"
          >此防伪码已被验证超过5次，请您留意！</view
        >

        <view v-if="!isFirstQr" :class="$style.time">
          <block v-for="(item, index) in records" :key="item.id">
            <view>第{{ index + 1 }}次验证时间：{{ format(new Date(item.createdAt), 'yyyy年MM月dd日 HH:mm') }}</view>
          </block>
        </view>

        <view v-if="firstTimeMission" :class="$style.tips">{{
          `首次扫描防伪码已奖励${firstTimeMission.points}小火苗`
        }}</view>
      </view>
    </view>

    <view :class="$style.footer" class="nut-flex-col nut-col-center nut-row-top" v-if="isLoaded">
      <!-- <view :class="$style.tips">{{ tips }}</view> -->
      <view :class="$style.task" class="nut-flex-col nut-col-center nut-row-center">
        <view :class="$style.list" class="nut-flex nut-row-between" v-for="item in taskList" :key="item.id">
          <view :class="$style.left" class="nut-flex nut-flex-1">
            <image :class="$style.icon" :src="item.icon"></image>
            <text class="f_s-16">{{ item.name }}</text>
            <view
              v-if="(item.code && item.code === MISSIONS_CODE.userinfo) || item.name === '填写购买目的'"
              :class="[$style.tip, !item.status && $style.tip_none]"
              class="nut-flex-1 f_s-12 f_w-600"
              >+{{ item.rewardValue }} 小火苗</view
            >
          </view>
          <nut-button
            :class="$style.btn"
            size="small"
            type="primary"
            :disabled="!item.status"
            :plain="!item.status"
            :loading="item.btnText === '领取' && btnLoading"
            :open-type="item.name === '联系客服获取更多小火苗' ? 'contact' : ''"
            @click="gotoPage(item)"
            >{{ item.btnText }}
          </nut-button>
        </view>
      </view>
    </view>
    <!-- </view> -->
  </BackgroundImage>
</template>
<script setup lang="ts">
import { getMissionsRewardsApi } from '@/api/missions';
import { IUiCodeVerifyResp, uicodeVerify } from '@/api/uicode';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import LottieView from '@/components/LottieView/LottieView.vue';
import PopLogin from '@/components/PopLogin/PopLogin.vue';
import { EMissionCode, IUicodeTaskItem, LOGIN_TARGET, MISSIONS_CODE, TARGET_VERIFY_FINISH } from '@/constants';
import { ELinkflowEventsName, ILinkflowEventsProps, ILinkflowTaskStatus } from '@/dto/events';
import useLoginPop from '@/hook/useLoginPop';
import { useMissionsStore, usePointStore, useUserStore } from '@/stores';
import { LinkType, Toast, handleLink, openCustomerServiceChat } from '@/utils';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp, useDidShow, useRouter } from '@tarojs/taro';
import { format } from 'date-fns';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const router = useRouter();
const missionsStore = useMissionsStore();

const {
  visible: showLoginPop,
  target: loginTarget,
  onRegisterEvent,
  offRegisterEvent,
  checkMemberLevel,
} = useLoginPop();

// const path = router.path; // 'pages/verification/verification';
// const refererName = router.params.refererName || '微信扫码';

// const scene =
//   Taro.getCurrentInstance().preloadData?.scene || '微信扫码小程序验真码进入' || Taro.getLaunchOptionsSync().scene;

const verifyCode = ref('');
const isLoaded = ref(false);
const qrData = ref<IUiCodeVerifyResp>();
const btnLoading = ref<boolean>(false);

const taskList = computed((): IUicodeTaskItem[] => {
  // const list = [
  //   {
  //     icon: require('@/static/icon/mission.png'),
  //     name: '小火苗兑好礼',
  //     type: LinkType.path,
  //     url: '/pages/pointmall/pointmall',
  //     status: 1,
  //     btnText: '去兑换',
  //   },
  //   {
  //     icon: require('@/static/icon/store.png'),
  //     name: '前往ZIPPO微商城',
  //     type: LinkType.path,
  //     url: '/packageA/pages/secondClassify/secondClassify?sonId=181&parId=155&title=ZIPPO火机',
  //     status: 1,
  //     btnText: '去逛逛',
  //   },
  //   {
  //     icon: require('@/static/icon/order-upload.png'),
  //     name: '联系客服获取更多小火苗',
  //     url: '',
  //     status: 1,
  //     btnText: '去联系',
  //   },
  // ];

  const list = missionsStore.missionsUicode;

  // 填写购买目的任务
  // 该任务只针对首个扫描该太阳码的用户开放，其他人扫描该太阳码时，次任务不展示
  if (
    qrData.value?.record &&
    qrData.value.records.length &&
    qrData.value?.record.enUserId === qrData.value.records[0].enUserId &&
    buyPurposeMission
  ) {
    const data = list.find(i => i.name === '填写购买目的');
    if (!data?.name) {
      const index = list.findIndex(i => i.code === MISSIONS_CODE.userinfo);
      list.splice(index <= 0 ? 0 : index + 1, 0, {
        id: EMissionCode.FILL_BUY_PURPOSE,
        icon: require('@/static/icon/mission.png'),
        name: '填写购买目的',
        type: LinkType.path,
        url: '/packageA/pages/verifyFinishInfo/verifyFinishInfo',
        status: buyPurposeMission.value?.completed ? 0 : 1,
        btnText: buyPurposeMission.value?.completed ? '已领取' : '去填写',
        rewardValue: buyPurposeMission.value?.points || 0,
        sort: 0,
      });
    } else {
      data.status = buyPurposeMission.value?.completed ? 0 : 1;
      data.btnText = buyPurposeMission.value?.completed ? '已领取' : '去填写';
    }
  }

  return list;
});

/** 首次扫码 */
const isFirstQr = computed((): boolean =>
  Boolean(
    qrData.value?.record && qrData.value?.records.length && qrData.value?.records[0].id === qrData.value?.record.id,
  ),
);
/** 展示5次扫码记录 */
const records = computed(() => (qrData.value ? qrData.value.records.slice(0, 5) : []));
/** 首扫任务 */
const firstTimeMission = computed(() => {
  if (!isFirstQr.value) return;
  const a = qrData.value?.missions?.find(o => o.code === EMissionCode.VERIFICATION_FIRST && o.completed);
  return a;
});
/** 填写购买目的任务 */
const buyPurposeMission = computed(() => qrData.value?.missions?.find(o => o.code === EMissionCode.FILL_BUY_PURPOSE));
const verifyMessage = computed(
  (): string => `此防伪码${isFirstQr.value ? '首次' : `第 ${qrData.value?.total} 次`}被验证`,
);
const isExceedMaxLen = computed((): boolean => (qrData.value?.records.length || 0) > 5);

const verifyFinishListener = data => {
  console.debug(`${TARGET_VERIFY_FINISH} data=`, data);
  if (!qrData.value?.missions) return;
  for (const m of qrData.value.missions) {
    if (m.code === EMissionCode.FILL_BUY_PURPOSE) {
      m.completed = true;
      break;
    }
  }
  // 填写购买目的 完成埋点
  const item = taskList.value.find(i => i.name === '填写购买目的');
  item?.name && onTaskClickCompleteTrack(item, '系统自动发放');
};

onMounted(async () => {
  isLoaded.value = false;
  const sceneCode = handleQrcodeScene();
  verifyCode.value = Taro.getCurrentInstance().preloadData?.code || sceneCode || '';
  // verifyCode.value = 'd23ca198017e03a60fade31228741890';

  onRegisterEvent();
  // 非会员走注册逻辑
  if (!useUserStore().isMemberLevel || !useUserStore().isPhone) {
    checkMemberLevel(LOGIN_TARGET.verificationCode, load);
  } else {
    await load();
  }

  Taro.eventCenter.on(TARGET_VERIFY_FINISH, verifyFinishListener);
});

useDidShow(() => {
  missionsStore.load();
});

onUnmounted(() => {
  Taro.preload({});
  Taro.eventCenter.off(TARGET_VERIFY_FINISH, verifyFinishListener);
  offRegisterEvent();
});

async function load() {
  const code = verifyCode.value;

  if (code) {
    try {
      qrData.value = await uicodeVerify({ cipher: code });
      isLoaded.value = true;
      onTrack();
    } catch (err) {
      console.error(err);
    }
  }

  if (!qrData.value) {
    const duration = 5000;
    Toast({ title: '请扫描正确的二维码', duration });
    setTimeout(() => Taro.switchTab({ url: '/pages/index/index' }), duration);
  }
}

function handleQrcodeScene() {
  const { scene = '', q: qrcodeContent = '' } = router.params;
  let sceneCode = '';
  if (scene) sceneCode = decodeURIComponent(scene);

  if (qrcodeContent) {
    const scene = ((qrcodeContent.split('?') || [])[1] || '').split('=')[1] || '';
    if (scene) sceneCode = decodeURIComponent(scene);
  }

  if (!sceneCode) return;

  return sceneCode;
}

// 领取奖励
const handleRewards = async (data: IUicodeTaskItem) => {
  const { id } = data;
  if (!id) return;

  btnLoading.value = true;

  try {
    const result = await getMissionsRewardsApi(id as unknown as number);
    console.debug('handleRewards: ', result);
    data.status = 0;
    data.btnText = '已领取';

    await usePointStore().load(); // 实时更新积分

    Toast(`领取成功，小火苗+${result.rewardValue}`);

    onTaskClickCompleteTrack(data);
    onTaskClickTrack(data, '已完成');
  } catch (error) {
    Toast(error.message);
  } finally {
    btnLoading.value = false;
  }
};

function gotoPage(item: IUicodeTaskItem) {
  // tarckEvents([{ path, event: IEventsName.MISSION_CL, properties: { name: `点击${item.name}` } }]);

  if (item.name === '联系客服获取更多小火苗') return openCustomerServiceChat();

  if (item.btnText === '领取') return handleRewards(item);
  onTaskClickTrack(item, '待完成');

  if (item.url) {
    if (item.name === '填写购买目的') {
      item.url = `${item.url}?cipher=${verifyCode.value}&product=${encodeURIComponent(
        JSON.stringify(qrData.value?.product),
      )}`;
    }
    handleLink(item.type, item.url);
  }
}

const onTrack = () => {
  if (!linkflow) return;
  // 埋点 扫码验真
  linkflow.track({
    event: ELinkflowEventsName.QRCodeVerification_Submit,
    props: {
      skuId: qrData.value?.product?.barcode,
      outerSkuId: qrData.value?.product?.code,
      channelId: qrData.value?.distributor.code,
      isFirstVerify: isFirstQr.value,
      isFirstVerifyUser: isFirstQr.value,
      verifyId: verifyCode.value,
      triggerPagePath,
    } as ILinkflowEventsProps,
  });
};

const onTaskClickTrack = (item: IUicodeTaskItem, taskStatus: ILinkflowTaskStatus) => {
  // 埋点 互动任务_点击
  if (!linkflow) return;
  linkflow.track({
    event: ELinkflowEventsName.InteractiveTask_Click,
    props: { taskName: item.name, taskId: item.id, taskStatus, triggerPagePath } as ILinkflowEventsProps,
  });
};

const onTaskClickCompleteTrack = (item: IUicodeTaskItem, receiveWay: '手动领取' | '系统自动发放' = '手动领取') => {
  // 埋点 互动任务_完成_领取奖励
  if (!linkflow) return;
  linkflow.track({
    event: ELinkflowEventsName.InteractiveTask_Complete_ReceiveAward,
    props: { taskName: item.name, taskId: item.id, receiveWay, triggerPagePath } as ILinkflowEventsProps,
  });
};
</script>
<style lang="scss" module>
@import './verification.scss';
</style>
