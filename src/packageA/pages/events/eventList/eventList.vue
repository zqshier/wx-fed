<template>
  <BackgroundImage :class="$style.container">
    <CustomBar title="" :logo-color="LogoColorType.BLACK" />
    <view :class="$style.main" v-if="isLoaded">
      <EventItem v-for="item in activityList" :key="item.id" :data="item" />
    </view>

    <Loading :show="!isLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
// import { cdnurl } from '@/utils';
import { useDidShow, useReachBottom } from '@tarojs/taro';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import { LogoColorType } from '@/components/CustomBar/props';
import EventItem from './components/EventItem/EventItem.vue';
import { IActListItem } from '@/dto/activity';
import { getActList } from '@/api/activity';
import { Toast } from '@/utils';

// const bgImg = `url(${cdnurl('static/event_list_bg.png')})`;

const listParams = reactive({
  page: 1,
  perPage: 20,
});
const finished = ref(false);
const isLoaded = ref<boolean>(false);
const activityList = ref<IActListItem[]>();

const loadList = async () => {
  if (finished.value) return;
  try {
    const { list } = await getActList(listParams);

    if (list.length < listParams.perPage!) {
      finished.value = true;
    }

    if (listParams.page === 1) {
      activityList.value = list;
    } else {
      activityList.value = activityList.value?.concat(list);
    }

    listParams.page! += 1;
    isLoaded.value = true;
  } catch (error) {
    Toast(error.message);
    console.error('loadList error=', error);
  }
};

useReachBottom(() => {
  loadList();
});

// 初始化页面的数据
const initPageData = () => {
  finished.value = false;
  listParams.page = 1;
};

const init = async () => {
  initPageData();
  await loadList();
};

useDidShow(async () => {
  await init();
});
</script>

<style lang="scss" module>
.container {
  .main {
    width: 100%;
    padding: 16px;
  }
}
</style>
