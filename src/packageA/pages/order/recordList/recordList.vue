<template>
  <BackgroundImage :class="$style.layout_box">
    <CustomBar title="转换记录" />
    <view :class="$style.page_box" class="nut-flex-1 nut-flex-col" v-if="isLoaded">
      <view :class="$style.list_box" v-if="listData && listData.length > 0">
        <block v-for="item in listData" :key="item.orderNo">
          <view :class="$style.list" class="box border-05px-box-16 mg-bottom-14">
            <RecordItem :data="item" />
          </view>
        </block>
      </view>
      <view :class="$style.empty_box" class="nut-flex nut-flex-1 nut-flex-col nut-col-center nut-row-center" v-else>
        <DefaultPage
          imgWidth="48"
          imgHeight="48"
          imgMbottom="16"
          tip="暂无相关订单"
          :icon="cdnurl('static/no-order.png')"
        />
      </view>

      <view
        :class="$style.footer"
        class="f_s-12 f_w-400 nut-flex nut-col-top nut-row-right"
        @tap="openCustomerServiceChat"
      >
        <nut-button shape="square" plain type="primary" :class="$style.btn" open-type="contact"
          >我有疑问，联系客服</nut-button
        >
      </view>
    </view>
    <Loading :show="!isLoaded" />
  </BackgroundImage>
</template>

<script setup lang="ts">
import { conversionList } from '@/api/order';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import DefaultPage from '@/components/DefaultPage/DefaultPage.vue';
import Loading from '@/components/Loading/Loading.vue';
import { IConversionItem } from '@/dto/order';
import { Toast, cdnurl, openCustomerServiceChat } from '@/utils';
import { useReachBottom } from '@tarojs/taro';
import { cloneDeep } from 'lodash';
import { onMounted, ref } from 'vue';
import RecordItem from './components/RecordItem/RecordItem.vue';

const listParams = ref({
  page: 1,
  perPage: 20,
});
const finished = ref<boolean>(false);
const listData = ref<IConversionItem[] | []>([]);
const isLoaded = ref<boolean>(false);

onMounted(async () => {
  await init();
});

useReachBottom(() => {
  getList();
});

const init = async () => {
  initPageData();
  await getList();
};

// 初始化页面的数据
const initPageData = () => {
  finished.value = false;
  listParams.value.page = 1;
  if (listData.value && listData.value.length === 0) {
    listData.value = [];
  }
};

const getList = async () => {
  if (finished.value) {
    Toast('没有更多了');
    return;
  }

  let result;

  try {
    result = await conversionList(listParams.value);
  } catch (e) {
    Toast(e.message);
    console.error('conversionList e=', e);
  }

  if (!result) return;
  const list = result.list;

  if (list.length < listParams.value.perPage!) {
    finished.value = true;
  }

  if (listParams.value.page > 1) {
    const new_list: IConversionItem[] = cloneDeep(listData.value);
    listData.value = new_list.concat(list);
  } else {
    listData.value = list;
  }

  listParams.value.page! += 1;
  isLoaded.value = true;
};
</script>

<style lang="scss" module>
.layout_box {
  .page_box {
    padding: 14px 15px;
    box-sizing: border-box;
    max-height: 100%;
    .list_box {
      margin-bottom: 90px;
    }
    .list {
      background: #fff;
      border-radius: 8px;
    }
    .empty_box {
      margin-top: -150px;
    }

    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 375px;
      height: 88px;
      background: #fff;
      padding: 8px;
      border-radius: 28px 28px 0px 0px;
      background: var(--bottom, rgba(165, 165, 165, 0.08));
      box-shadow: 0px 0px 16px 16px rgba(165, 165, 165, 0.15) inset;
      backdrop-filter: blur(8px);
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      .btn {
        // width: 175px;
        height: 40px;
        border-radius: 20px;
        border: 1px solid $Tertiary;
        color: $Primary;
        font-family: 'FZLanTingHei-R-GBK';
        background: transparent;
      }
    }
  }
}
</style>
