<template>
  <BackgroundImage :class="$style.container">
    <CustomBar title="" bg-color="transparent" :logo-color="LogoColorType.BLACK" />
    <view :class="$style.main" v-if="isLoading">
      <block v-if="!showStatus">
        <view :class="$style.main_content">
          <block v-for="(item, index) in cardsInfo?.questions" :key="item.id">
            <QuizCard
              v-show="index >= questionIndex"
              :info="item"
              :index="index"
              :active="index === currentQuestionIndex"
              :questionIndex="questionIndex"
              :isNextItem="index === currentQuestionIndex + 1"
              :listLength="cardsInfo?.questions.length"
              @answerSelected="handleAnswerSelection"
              @next="currentQuestionIndex += 1"
              ref="quizCard"
            ></QuizCard>
          </block>
        </view>
        <view :class="$style.footer">
          <nut-button
            :class="[$style.btn, { [$style['btn-submit']]: canSubmit }]"
            :disabled="!canSubmit"
            type="default"
            plain
            :loading="loadingSubmit"
            @click="submitAnswers"
            >提交</nut-button
          >
        </view>
      </block>

      <!-- 状态 -->
      <QuestionnaireStatus
        v-if="showStatus"
        :title="statusText.title"
        :tips="statusText.tips"
        :isAnimated="statusText.isAnimated"
      />
    </view>

    <Loading :show="!isLoading" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { getQuestionnaire, submitQuestionnaire } from '@/api/survey';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import Loading from '@/components/Loading/Loading.vue';
import { ISubmitContent, ISurveyList } from '@/dto/survey';
import { Toast, goBack } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import Taro, { getApp, useRouter, useUnload } from '@tarojs/taro';
import { computed, onMounted, provide, ref } from 'vue';
import QuestionnaireStatus from './components/QuestionnaireStatus.vue';
import QuizCard from './components/QuizCard.vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();
// const bgImg = `url(${cdnurl('static/event_list_bg.png')})`;

const router = useRouter();
const activityId = ref(Number(router.params.id)); // 问卷调查id

const isLoading = ref<boolean>(false);
const canSubmit = ref<boolean>(false);
const cardsInfo = ref<ISurveyList>(); // 问卷信息
const currentQuestionIndex = ref(0); // 获取当前激活的卡片索引
const questionIndex = ref(0); // 当前问题的下标
const quizCard = ref();

const selectedAnswers = ref<ISubmitContent[]>([]);
const loadingSubmit = ref(false);

const storageKey = `questionState_${activityId.value}`;

const showStatus = computed(() => {
  return isLoading.value && (cardsInfo.value?.isComplete || !cardsInfo.value?.isCan);
});

const statusText = computed(() => {
  const text = {
    title: '',
    tips: '',
    isAnimated: false,
  };

  if (cardsInfo.value?.isComplete) {
    text.title = '提交成功';
    text.tips = '感谢您百忙之中完成问答';
    text.isAnimated = true;
  }

  if (!cardsInfo.value?.isCan) {
    text.title = '提示';
    text.tips = '此问卷处于停止状态，无法填写';
    text.isAnimated = false;
  }

  return text;
});

const fetchQuestions = async () => {
  try {
    let result: ISurveyList = await getQuestionnaire(activityId.value);
    // console.debug('result', result);
    // result = {
    //   title: '调查问卷3.1',
    //   questions: [
    //     {
    //       id: 8,
    //       questionnaireId: 5,
    //       title: '1.小程序升级后是否带来更好的体验',
    //       type: 0,
    //       image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/10/1f7bcc9d143a4cca81c18c92f5e01de8.png',
    //       options: [
    //         { ext: '', key: 1, value: '没有感觉' },
    //         { ext: '', key: 2, value: '感觉一般' },
    //         { ext: '', key: 3, value: '体险非营好' },
    //       ],
    //       sort: 1,
    //       createdAt: '2023-10-28T10:02:05.903Z',
    //     },
    //     {
    //       id: 9,
    //       questionnaireId: 5,
    //       title: '2.积分商品是否喜欢',
    //       type: 0,
    //       image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/10/4d73a5c5c2b54301abeaa3f27d005d0f.png',
    //       options: [
    //         { ext: '', key: 1, value: '不喜欢' },
    //         { ext: '', key: 2, value: '一般' },
    //         { ext: '', key: 3, value: '非常喜欢' },
    //       ],
    //       sort: 2,
    //       createdAt: '2023-10-28T10:02:05.906Z',
    //     },
    //     {
    //       id: 10,
    //       questionnaireId: 5,
    //       title: '3.认为目前商品存在什么问题',
    //       type: 0,
    //       image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/10/eb3a0cdc97f742b3860e06a59152a4ac.png',
    //       options: [
    //         { ext: '', key: 1, value: '质量问题' },
    //         { ext: '', key: 2, value: '小问题还能接受 没有问题' },
    //         { ext: '', key: 3, value: '整体非常好' },
    //       ],
    //       sort: 3,
    //       createdAt: '2023-10-28T10:02:05.909Z',
    //     },
    //   ],
    //   isCan: true,
    //   isComplete: false,
    // };

    cardsInfo.value = result;

    isLoading.value = true;
  } catch (err) {
    Toast('加载失败', 2000, 'none', true, () => {
      setTimeout(() => {
        goBack();
      }, 1500);
    });
    console.error('pointOrderList load err=', err);
  }
};

function handleAnswerSelection({ answer, questionId }) {
  console.debug('handleAnswerSelection event=', { answer, questionId });
  // 将选择的答案和题目ID添加到答案数组中
  selectedAnswers.value[currentQuestionIndex.value] = { questionId, answer };
  nextCard();
}

async function submitAnswers() {
  const params = { questionnaireId: activityId.value, content: selectedAnswers.value };
  console.debug('params: =====', params);

  // return;
  let result;
  loadingSubmit.value = true;
  try {
    result = await submitQuestionnaire({ questionnaireId: activityId.value, content: selectedAnswers.value });

    if (cardsInfo.value) {
      cardsInfo.value.isComplete = true;
    }
  } catch (err) {
    console.error('pointOrderList load err=', err);
  } finally {
    loadingSubmit.value = false;
  }

  if (result && linkflow) {
    linkflow.track({
      event: ELinkflowEventsName.InteractiveTask_Questionnaire_Submit,
      props: {
        s_questionnaireId: `${activityId.value || ''}`,
        s_questionnaireName: cardsInfo.value?.title || '',
        triggerPagePath,
      } as ILinkflowEventsProps,
    });
    selectedAnswers.value.forEach((item, idx) => {
      linkflow.track({
        event: ELinkflowEventsName.InteractiveTask_Questionnaire_Answer,
        props: {
          s_questionnaireId: `${activityId.value || ''}`,
          s_questionnaireName: cardsInfo.value?.title || '',
          s_question: cardsInfo.value?.questions.find(i => i.id === item.questionId)?.title || '',
          s_questionNumber: `${idx + 1}`,
          s_answer: item.answer[0].value || '',
          triggerPagePath,
        } as ILinkflowEventsProps,
      });
    });
  }
}

// 切换到下一题
const nextCard = () => {
  if (cardsInfo.value?.questions.length && cardsInfo.value?.questions.length - 1 === currentQuestionIndex.value)
    return (canSubmit.value = true);

  quizCard.value[currentQuestionIndex.value].showAnimations();
  // 重置按钮状态
  canSubmit.value = false;
};

const goShopPage = () => {
  Taro.reLaunch({
    url: '/pages/pointmall/pointmall',
  });
};
provide('back', goShopPage);

useUnload(() => {
  Taro.setStorageSync(storageKey, {
    questionIndex: currentQuestionIndex.value,
    answers: selectedAnswers.value,
  });
});

function getStorage() {
  const questionState = Taro.getStorageSync(storageKey);
  if (questionState) {
    currentQuestionIndex.value = questionState.questionIndex;
    questionIndex.value = questionState.questionIndex - 1;
    selectedAnswers.value = questionState.answers;
  }
}

onMounted(async () => {
  getStorage();
  fetchQuestions(); // 获取题目数组
});
</script>

<style lang="scss" module>
.container {
  .main {
    width: 100%;
    height: 100%;
    padding: 48px 0 40px;
    box-sizing: border-box;
    &_content {
      width: 100%;
      height: 556px;
      padding: 0 12px;
      margin-bottom: 40px;
    }
  }
  .footer {
    text-align: center;
    .btn {
      width: 343px;
      height: 40px;
      color: $Tertiary;
      border-radius: 20px;
      border: 1px solid $Tertiary;
      background: transparent;
      &-submit {
        color: White;
        border: 1px solid $Primary;
        background: $Primary;
      }
    }
  }
}
</style>
