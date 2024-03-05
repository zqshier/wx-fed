<template>
  <BackgroundImage :class="$style.layout">
    <CustomBar title="任务中心" />
    <view :class="$style.main">
      <view :class="$style.main_imageBox">
        <image :class="$style.image" :src="cdnurl(`static/task_${level}.png`)" mode="aspectFill"></image>
      </view>
      <view :class="$style.main_title" class="f_s-20 f_w-600">Zippo 会员任务中心</view>
      <scroll-view
        :class="$style.main_task"
        :scroll-y="true"
        :enhanced="true"
        :enable-passive="true"
        :scroll-with-animation="true"
        :show-scrollbar="false"
      >
        <view v-if="taskList.length">
          <view :class="$style.task_title" class="f_s-16">会员任务</view>
          <view class="nut-flex-1 nut-flex-col nut-row-left nut-col-top">
            <TaskItem
              v-model:show-login-pop="showLoginPop"
              v-for="task in taskList"
              :key="task.id"
              :task="task"
              @siginIn="handleSignin"
            />
          </view>
        </view>
      </scroll-view>

      <PopSignInResult v-model:show="showSignInResultPop" :rewards="signinResultData" :show-detail-btn="true" />
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import PopSignInResult from '@/packageA/pages/signin/components/PopSignInResult.vue';
import TaskItem from '../../../pages/pointmall/components/TaskItem.vue';
import { useSigninStore, useUserStore, useMissionsStore } from '@/stores';
import useLoginPop from '@/hook/useLoginPop';
import { useDidShow } from '@tarojs/taro';
import { startOfMonth } from 'date-fns';
import { cdnurl, Toast } from '@/utils';
import { getDailySigninApi } from '@/api/daily';
import { ISigninMonthData, ISigninRewardsData } from '@/dto/daily';
import { cloneDeep } from 'lodash';

const { visible: showLoginPop } = useLoginPop();
const missionsStore = useMissionsStore();
const signinStore = useSigninStore();

const level = computed(() => useUserStore().userInfo?.memberLevel);

const taskList = computed(() => missionsStore.missionsInTask);

const showSignInResultPop = ref(false);
const signinResultData = ref<ISigninRewardsData[]>([]);

async function handleSignin() {
  try {
    const result = await getDailySigninApi();
    showSignInResultPop.value = true;
    signinResultData.value = result.rewards;

    // 更新签到记录信息
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0).toISOString();
    const info: ISigninMonthData = cloneDeep(signinStore.getSigninDatas[currentMonth]);
    info.days.push({ signInDate: result.signInDate, isSignIn: true });
    signinStore.setSigninData(currentMonth, info);
  } catch (err) {
    Toast(err.message);
  }
}

useDidShow(async () => {
  missionsStore.load(); // 任务列表
  await useSigninStore().load(startOfMonth(new Date()).toISOString());
});
</script>

<style lang="scss" module>
.layout {
  width: 375px;
}
.main {
  position: relative;
  box-sizing: content-box;

  &_imageBox {
    position: absolute;
    top: 0;
    right: 0;
    .image {
      width: 170px;
      height: 176px;
    }
  }
  &_title {
    color: $Primary;
    margin: 79px 0 24px 20px;
  }
  &_task {
    width: 359px;
    height: 593px;
    margin: 0 auto;
    padding: 16px;
    border-radius: 24px 24px 0px 0px;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0px 4px 10px 0px rgba(165, 165, 165, 0.65);
    backdrop-filter: blur(10px);
    .task_title {
      padding: 8px 0px;
      margin-bottom: 8px;
    }
  }
}
</style>
