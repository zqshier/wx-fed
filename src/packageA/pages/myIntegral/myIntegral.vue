<template>
  <view class="container" :class="$style.integral_layout">
    <CustomBar title="小火苗明细" />

    <view :class="$style.main">
      <!-- 积分 -->
      <view :class="$style.content" class="border-05px-box-16 nut-flex nut-row-between nut-col-center">
        <view :class="$style.info" class="f_w-400 f_s-12 nut-flex nut-row-center">
          <text :class="$style.num" class="numfnt-medium nut-line-1 f_w-500 f_s-20">{{ poinStore.balance }}</text>
          小火苗
        </view>
        <view :class="$style.tips" class="nut-flex nut-row-center nut-col-center" @tap="goHelp">
          <text class="f_s-12">小火苗攻略</text>
          <image :class="$style.icon_right" src="../../../static/icon/arr-s.png"></image>
        </view>
      </view>
      <!-- 列表 -->
      <IntegralList :list="pointsList" :loading="showLoading"></IntegralList>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useReachBottom } from '@tarojs/taro';
import { onMounted, ref, reactive } from 'vue';
import { IPointItem, IPointsParams } from '@/dto/point';
import { usePointStore } from '@/stores';
import { DOCUMENTS } from '@/constants';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import IntegralList from './components/IntegralList/IntegralList.vue';

const poinStore = usePointStore();
const listParams = reactive<IPointsParams>({
  page: 1,
  perPage: 20,
  withoutList: 0,
});
const pointsList = ref<IPointItem[]>([]);
const finished = ref(false);
const showLoading = ref<boolean>(false);

const loadList = async () => {
  if (finished.value) return;
  try {
    const { list } = await poinStore.load(listParams);

    if (list.length < listParams.perPage!) {
      finished.value = true;
    }

    for (const row of list) {
      if (pointsList.value.find(o => o.sn === row.sn)) continue;
      pointsList.value.push(row);
    }

    listParams.page! += 1;
  } catch (error) {
    console.error('loadList error=', error);
  } finally {
    showLoading.value = false;
  }
};

const goHelp = () => {
  Taro.navigateTo({
    url: `/packageA/pages/help/help?title=${DOCUMENTS.GONGLUE.title}&code=${DOCUMENTS.GONGLUE.code}`,
  });
};

onMounted(async () => {
  showLoading.value = true;
  await loadList();
});

useReachBottom(() => loadList());
</script>

<style lang="scss" module>
@import './myIntegral.scss';
</style>
