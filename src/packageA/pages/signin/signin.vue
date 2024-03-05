<template>
  <view class="container" :class="$style.layout">
    <CustomBar :logoColor="LogoColorType.BLACK" />

    <view :class="$style.main" class="nut-flex-1 nut-flex-col nut-row-left nut-col-center">
      <view :class="$style.main_top">
        <view class="f_s-16" :class="$style.tips">本月已连续签到{{ keepDayNum }}天</view>
        <view :class="$style.month_box" class="nut-flex nut-flex-1 nut-col-center">
          <view :class="$style.icon" class="nut-flex nut-col-center nut-row-center" @tap="changeSelectMonth(-1)">
            <image
              :class="$style.image"
              :src="`${require(`@/static/icon/${currentMonthIndex === 0 ? 'arr-r-s.png' : 'arr-l-s.png'}`)}`"
              :style="currentMonthIndex === 0 ? `transform:rotate(180deg)` : ''"
            ></image>
          </view>
          <view :class="$style.date_name" class="f_s-10">{{ monthStr }}</view>
          <view :class="$style.icon" class="nut-flex nut-col-center nut-row-center" @tap="changeSelectMonth(1)">
            <image
              :class="$style.image"
              :src="`${require(`@/static/icon/${
                currentMonthIndex === state.months.length - 1 ? 'arr-r-s.png' : 'arr-l-s.png'
              }`)}`"
              :style="currentMonthIndex === state.months.length - 1 ? '' : `transform:rotate(180deg)`"
            ></image>
          </view>
        </view>
        <view :class="$style.calendar_box" :style="{ height: `${calendarHeight}px` }">
          <view
            :class="$style.calendar_box_item"
            v-for="(month, index) in state.months"
            :key="month.key"
            :style="{ transform: `translate3d(${(index - currentMonthIndex) * 100}% , 0, 0)` }"
          >
            <view :class="$style.week_box" id="week_box" class="nut-flex">
              <view
                :class="$style.week"
                class="nut-flex-1 nut-flex nut-row-center f_s-12 numfnt"
                v-for="key in state.weekNum"
                :key="key.value"
              >
                {{ key.label }}
              </view>
            </view>
            <view :class="$style.day_box" class="nut-flex nut-flex-col nut-row-left">
              <view :class="$style.day" id="day" class="nut-flex" v-for="(item, ind) in month?.list" :key="ind">
                <view
                  class="nut-flex nut-flex-1 nut-row-center nut-flex-wrap f_s-12 numfnt"
                  :class="[$style.day_item, val.select ? $style.select : '']"
                  v-for="(val, index) in item"
                  :key="index"
                >
                  <view v-if="!val.select">{{ val.day }}</view>
                  <image :class="$style.icon_select" v-else src="./../../../static/icon/checkbox_on.png"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view :class="$style.btn">
          <nut-button
            shape="round"
            type="primary"
            :block="true"
            :disabled="isSigin"
            :loading="loadingSignin"
            @click="handleSignin"
            >{{ isSigin ? '已签到' : '立即签到' }}</nut-button
          >
        </view>
      </view>
      <view :class="$style.main_bottom" class="nut-flex-1 nut-flex-col nut-row-left nut-col-center">
        <view
          v-if="continuousRewards?.length"
          :class="$style.award"
          class="nut-flex nut-flex-col nut-row-left nut-col-center"
        >
          <view :class="$style.award_item" class="nut-flex nut-row-left nut-col-center f_s-16"
            >连续签到可获取以下奖励</view
          >
          <view
            :class="$style.award_item"
            class="nut-flex nut-row-between nut-col-center f_s-16"
            v-for="(item, index) in continuousRewards"
            :key="index"
          >
            <view class="nut-flex-1 f_s-16">连续签到{{ item.days }}天</view>
            <view :class="$style.points" class="f_s-12 numfnt">+{{ item.points }}小火苗</view>
          </view>
        </view>
        <view
          v-if="ruleContent?.length"
          :class="$style.rule"
          class="nut-flex-1 nut-flex-col nut-row-left nut-col-center"
        >
          <view :class="$style.title" class="f_s-16">签到规则说明</view>
          <Document :dcontents="ruleContent" :maxWidth="311" format="png" />
        </view>
      </view>
    </view>

    <PopSignInResult v-model:show="showSignInResultPop" :rewards="signinResultData" />
  </view>
</template>
<script setup lang="ts">
import { getDailySigninApi } from '@/api/daily';
import { LogoColorType } from '@/components/CustomBar/props';
import Document from '@/components/Document/Document.vue';
import { IContinuousRewards, ISigninMonthData, ISigninRewardsData } from '@/dto/daily';
import { DocumentContentVo as IContent } from '@/dto/document';
import { useSigninStore } from '@/stores';
import { Toast, getRect } from '@/utils';
import { NodesRef, useReady } from '@tarojs/taro';
import { format, getDate, getDay } from 'date-fns';
import { cloneDeep } from 'lodash';
import { computed, onMounted, reactive, ref } from 'vue';
import PopSignInResult from './components/PopSignInResult.vue';

interface IDataListMonth {
  d: number | string;
  day: number | string;
  week: string;
  select: boolean;
}

interface IWeekNum {
  label: string;
  value: number;
  fullName: string;
}
const state = reactive<{
  weekNum: IWeekNum[];
  months: { key: string; list: IDataListMonth[][] }[];
  currentMonth: string;
  selectMonth: string;
}>({
  currentMonth: '', // 当前月份展示
  selectMonth: '', // 选择查看月份
  months: [],
  weekNum: [
    { label: '日', value: 0, fullName: '星期日' },
    { label: '一', value: 1, fullName: '星期一' },
    { label: '二', value: 2, fullName: '星期二' },
    { label: '三', value: 3, fullName: '星期三' },
    { label: '四', value: 4, fullName: '星期四' },
    { label: '五', value: 5, fullName: '星期五' },
    { label: '六', value: 6, fullName: '星期六' },
  ],
});
const signinStore = useSigninStore();

const loadingSignin = ref(false);
const calendarRectInfo = ref<{ weekHeight: number; dayHeight: number }>({ weekHeight: 0, dayHeight: 0 });
const showSignInResultPop = ref(false);
const signinResultData = ref<ISigninRewardsData[]>([]);

const signInfo = computed(() => signinStore.getSigninDatas);

const currentMonthIndex = computed(() => state.months.findIndex(i => i.key === state.selectMonth));

const isSigin = computed((): boolean => {
  let data = {} as IDataListMonth;
  state.months[state.months.length - 1]?.list.forEach(item => {
    const info = item.find(itm => itm.d === getDate(new Date()));
    if (info) data = info;
  });
  return data.select;
});

const keepDayNum = computed((): number => {
  // 连续签到天数
  let num = 0;
  const days = state.months[state.months.length - 1]?.list;
  if (!days) return 0;
  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < days[i].length; j++) {
      const data = days[i][j];
      if (!data.day) continue;
      const nowDate = new Date().getDate();
      if (+data.day <= nowDate) {
        data.select ? num++ : data.day !== nowDate ? (num = 0) : '';
      }
    }
  }
  return num;
});

const monthStr = computed((): string => state.selectMonth && format(new Date(state.selectMonth), 'yyyy / MM'));

const calendarHeight = computed((): number => {
  let height = 0;
  const { weekHeight, dayHeight } = calendarRectInfo.value;
  if (weekHeight && dayHeight) height = state.months[currentMonthIndex.value].list.length * dayHeight + weekHeight;
  return height;
});

const continuousRewards = computed((): IContinuousRewards[] => {
  const config = signInfo.value[state.selectMonth]?.configs || signInfo.value[state.currentMonth]?.configs;
  return config?.continuousRewards || [];
});

const ruleContent = computed((): IContent[] => {
  const config = signInfo.value[state.selectMonth]?.configs || signInfo.value[state.currentMonth]?.configs;
  return config?.rules.map(item => ({ type: 'image', content: item } as IContent)) || [];
});

onMounted(async () => {
  state.months = [];
  showSignInResultPop.value = false;
  signinResultData.value = [];

  await getCalendarData();
  state.selectMonth = state.currentMonth;
  await load();
  // 今天没签到 自动签到
  if (!isSigin.value) handleSignin();
});

useReady(async () => {
  await getCalendarHeight();
});

async function load() {
  await signinStore.load(state.selectMonth);
  await handleGrounpData();
}

async function getCalendarHeight() {
  try {
    const weekItem = (await getRect('#week_box', false)) as NodesRef.BoundingClientRectCallbackResult;
    const dayItem = (await getRect('#day', false)) as NodesRef.BoundingClientRectCallbackResult;
    console.debug('getCalendarHeight weekItem queryRectInfo', weekItem);
    console.debug('wealBoxInfo dayItem queryRectInfo', dayItem);
    calendarRectInfo.value.weekHeight = weekItem?.height || 0;
    calendarRectInfo.value.dayHeight = dayItem?.height || 0;
  } catch (e) {
    console.debug('wealBoxInfo error=', e);
  }
}

function getCalendarData() {
  // 获取本月以及前两个月时间
  const date = new Date();
  let year = date.getFullYear(); //获取完整的年份(4位)
  let cMonth = date.getMonth();
  state.currentMonth = new Date(year, cMonth, 1, 0, 0, 0).toISOString();
  for (let i = 0; i < 3; i++) {
    if (cMonth - i < 0) {
      year = year - 1;
      cMonth = 11 + i;
    }
    let month = cMonth - i; //获取当前月份(0-11,0代表1月)
    const key = new Date(year, month, 1, 0, 0, 0).toISOString();
    state.months.unshift({ key, list: getCurrentMonth(year, month) });
  }
}

async function handleGrounpData() {
  if (!signInfo.value || !signInfo.value[state.selectMonth]?.days) return;
  for (const item of state.months[currentMonthIndex.value].list) {
    for (const itm of item) {
      for (const days of signInfo.value[state.selectMonth].days) {
        days.signInDate && getDate(new Date(days.signInDate)) === itm.d ? (itm.select = days.isSignIn) : '';
      }
    }
  }
}
async function handleSignin() {
  loadingSignin.value = true;
  try {
    const result = await getDailySigninApi();
    showSignInResultPop.value = true;
    signinResultData.value = result.rewards;
    const info: ISigninMonthData = cloneDeep(signInfo.value[state.selectMonth]);
    info.days.push({ signInDate: result.signInDate, isSignIn: true });
    signinStore.setSigninData(state.selectMonth, info);
    await handleGrounpData();
  } catch (err) {
    Toast(err.message);
  } finally {
    loadingSignin.value = false;
  }
}

const changeSelectMonth = index => {
  const oIndex = currentMonthIndex.value;
  let nIndex = 0;
  if (oIndex + index < 0) {
    nIndex = 0;
  } else if (oIndex + index > state.months.length - 1) {
    nIndex = state.months.length - 1;
  } else {
    nIndex = oIndex + index;
  }

  state.selectMonth = state.months[nIndex].key;
  load();
};

// 获取本月的时间数据
const getCurrentMonth = (year: number, month: number) => {
  const stratDate = new Date(year, month, 1).getTime(),
    endData = new Date(year, month + 1, 1).getTime();
  const days = (endData - stratDate) / (1000 * 60 * 60 * 24);
  const list: IDataListMonth[] = [];
  for (let i = 1; i <= days; i++) {
    const d = i;
    const day = d;
    const weekArr = ['日', '一', '二', '三', '四', '五', '六'];
    const week = weekArr[getDay(new Date(`${month}/${i}/${year}`))];
    list.push({ day, week, d, select: false });
  }
  // 获取某月第一天对应的星期几
  const currentIndex = state.weekNum.findIndex((item: any) => item.label == list[0].week);
  // 往总天数中添加currentIndex个对象用于错位
  const addList = Array.from({ length: currentIndex }).map(() => ({ d: '', day: '', week: '', select: false }));
  // 合并
  const mergeArr: IDataListMonth[] = [...addList, ...list];
  let resultList: IDataListMonth[][] = [];
  let index = 0;
  // 将数组分为长度为7的数组方便页面循环
  while (index < days + currentIndex) {
    resultList.push(mergeArr.slice(index, (index += 7)));
  }
  if (resultList[resultList.length - 1].length < 7) {
    do {
      resultList[resultList.length - 1].push({ d: '', day: '', week: '', select: false });
    } while (resultList[resultList.length - 1].length < 7);
  }
  return resultList;
};
</script>
<style lang="scss" module>
.layout {
  .main {
    &_top {
      width: 375px;
      padding: 16px;
      .tips {
        line-height: 24px;
        padding: 0 16px;
      }
      .month_box {
        width: 100%;
        height: 34px;
        padding: 0 6px;
        margin-bottom: 12px;
        .icon {
          width: 26px;
          height: 34px;
          .image {
            width: 6px;
            height: 10px;
          }
        }
        .date_name {
          padding: 0 6px;
          color: $Tertiary;
        }
      }
      .calendar_box {
        position: relative;
        width: 311px;
        min-height: 154px;
        padding: 0 16px;
        margin-bottom: 24px;
        transition: height 0.2s;
        overflow: hidden;
        &_item {
          position: absolute;
          width: 311px;
          height: 100%;
          // min-height: 154px;
          transition: all 0.3s;
        }
        .week_box {
          .week {
            padding-bottom: 8px;
          }
        }
        .day_box {
          width: 100%;
          .day {
            width: 100%;
            .day_item {
              line-height: 18px;
              padding-bottom: 8px;
              .select {
                line-height: normal;
              }
              .icon_select {
                width: 12px;
                height: 12px;
              }
            }
          }
        }
      }
      .btn {
        padding: 0 16px;
      }
    }
    &_bottom {
      width: 375px;
      height: auto;
      padding: 16px 0 24px;
      border-radius: 32px 32px 0 0;
      background: rgba(165, 165, 165, 0.08);
      box-shadow: -16.16667px 16.16667px 16.16667px 0 rgba(255, 255, 255, 0.08) inset,
        16.16667px -16.16667px 16.16667px 0 rgba(165, 165, 165, 0.08) inset;
      backdrop-filter: blur(7.760000228881836px);
      .title {
        padding: 16px 0;
        color: $Tertiary;
      }

      .award {
        width: 311px;
        margin-bottom: 16px;
        &_item {
          width: 100%;
          min-height: 48px;
          border-bottom: 0.5px solid $Divide;
          .points {
            color: $Brand;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
