<template>
  <BackgroundImage :class="$style.layout_box">
    <CustomBar title="售后" />
    <view :class="$style.page_box" class="nut-flex-1 nut-flex-col" v-if="isLoaded">
      <block v-if="listData && listData.length > 0">
        <block v-for="itm in listData" :key="itm.id">
          <view :class="$style.item_box" class="box mg-bottom-14">
            <OrderboxItem :data="itm" />
          </view>
        </block>
      </block>
      <view :class="$style.empty_box" class="nut-flex nut-flex-1 nut-flex-col nut-col-center nut-row-center" v-else>
        <DefaultPage
          imgWidth="48"
          imgHeight="48"
          imgMbottom="16"
          tip="暂无相关订单"
          :icon="cdnurl('static/no-order.png')"
        />
      </view>
    </view>
    <Loading :show="!isLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { useDidShow, useReachBottom } from '@tarojs/taro';
import { onMounted, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { IAftersalesListParams, IAftersalesInfo } from '@/dto/aftersales';
import { getAftersalesListApi } from '@/api/aftersales';
import { Toast, cdnurl } from '@/utils';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import OrderboxItem from './components/OrderboxItem/OrderboxItem.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import Loading from '@/components/Loading/Loading.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';

const page = ref<number>(0);
const perPage = ref<number>(10);
const finished = ref<boolean>(false);
const listData = ref<IAftersalesInfo[] | []>([]);
const isLoaded = ref<boolean>(false);

onMounted(() => {
  isLoaded.value = false;
});

useDidShow(async () => {
  await init();
});

useReachBottom(() => {
  getListFactory();
});

const init = async () => {
  initPageData();
  await getListFactory();
};

// 初始化页面的数据
const initPageData = () => {
  finished.value = false;
  page.value = 0;
  if (listData.value && listData.value.length === 0) {
    listData.value = [];
  }
};

const getListFactory = async () => {
  // 如果已经全部加载完成直接终止执行
  if (finished.value) {
    Toast('没有更多了');
    return;
  }
  page.value++;
  await getList();
};

const getList = async () => {
  try {
    const _page: number = page.value;
    const params: IAftersalesListParams = {
      page: _page,
      perPage: perPage.value,
    };
    const { list, total = 0 } = await getAftersalesListApi(params);
    if (_page > 1) {
      const new_list: IAftersalesInfo[] = cloneDeep(listData.value);
      listData.value = new_list.concat(list);
    } else {
      listData.value = list;
    }
    if (listData.value.length === total) {
      finished.value = true;
      return;
    }
  } catch (e) {
    console.error('_getList e=', e);
  } finally {
    if (!isLoaded.value) isLoaded.value = true;
  }
};
</script>

<style lang="scss" module>
.layout_box {
  .page_box {
    padding: 14px 15px;
    box-sizing: border-box;
    max-height: 100%;
    .item_box {
      border-radius: 8px;
    }
    .empty_box {
      margin-top: -150px;
    }
  }
}
</style>
