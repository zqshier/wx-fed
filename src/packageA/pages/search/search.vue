<template>
  <view class="container" :class="$style.container">
    <view :class="$style.sticky">
      <nut-sticky>
        <SearchBar
          :modelValue="listParams.q"
          :autofocus="isFocus"
          :isSearchBtn="true"
          :showBack="true"
          :logoIcon="false"
          :disabled="false"
          @search="handleSearch"
        />

        <view :class="$style.list_sort" v-show="listData.length > 0">
          <!--排序按钮  -->
          <Sort :showSortMore="false" @handleSort="handleSort" />
        </view>
      </nut-sticky>
    </view>
    <view :class="$style.main" class="nut-flex nut-flex-1 nut-row-between nut-col-top nut-flex-wrap">
      <!-- 商品列表 -->
      <view :class="$style.list_product" v-show="listData.length > 0">
        <block v-if="isLoading">
          <block v-for="item in listData" :key="item.id">
            <ProductItem :item="(item as any)" width="166" imgHeight="184" :showGuidePrice="false" />
          </block>
        </block>
        <view :class="$style.no_data" class="nut-flex nut-row-center" v-if="!isLoading">
          <Loading1 />
        </view>
      </view>
      <view v-show="listParams.q && !hasVal" :class="$style.empty" class="f_s-14">未找到相关商品</view>

      <RecommendedItems
        :class="$style.like"
        :goods="recommendList"
        font-weight="600"
        v-if="recommendList.length && listData.length === 0"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { getRecommendList, goodsSearchApi } from '@/api/goods';
import ProductItem from '@/components/ProductItem/ProductItem.vue';
import RecommendedItems from '@/components/RecommendedItems/RecommendedItems.vue';
import { GoodsListInfo, GoodsSearchParams } from '@/dto/goods';
import { IRecommendList, IRecommendListParam } from '@/dto/recommend';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import { Loading1 } from '@nutui/icons-vue-taro';
import Taro, { getApp, useReachBottom } from '@tarojs/taro';
import { computed, onMounted, provide, reactive, ref } from 'vue';
import Sort from '../secondClassify/components/sort/sort.vue';
import SearchBar from './components/SearchBar/SearchBar.vue';

const linkflow = getApp()[`${process.env.APP_ID}`];
const triggerPagePath = getRefererPath();

const listData = ref<GoodsListInfo[]>([]);
const recommendList = ref<IRecommendList[]>([]);
const isFirst = ref<boolean>(true);
// const finished = ref<boolean>(false); // 是否加载完成
const isSearch = ref<boolean>(false);
const hasVal = ref<boolean>(true);
const isLoading = ref<boolean>(false);

const listParams: GoodsSearchParams = reactive({
  page: 1,
  perPage: 10,
  q: '',
  sort: '',
  finished: false,
});

const recommendListParam: IRecommendListParam = reactive({
  page: 1,
  perPage: 20,
  noPagination: false,
  finished: false,
});

const isFocus = computed((): boolean => {
  return !!isFirst.value;
});

useReachBottom(() => _getList());

const init = async () => {
  _initPageData();
  await _getList();
};

// 初始化页面的数据
const _initPageData = () => {
  // finished.value = false;
  listParams.finished = false;
  listParams.page = 1;
  recommendListParam.finished = false;
  recommendListParam.page = 1;
};

const _getList = async () => {
  // const params: GoodsSearchParams = { page: page.value, perPage: perPage.value, q: searchVal.value, sort: '' };
  if (listParams.finished) return;

  const result = await goodsSearchApi(listParams);

  if (listParams.page === 1) {
    listData.value = result.list;
  } else {
    listData.value = listData.value.concat(result.list);
  }

  isLoading.value = true;

  // 修复搜索商品会先闪文案再显示商品
  hasVal.value = listData.value.length === 0 && result.list.length === 0 ? false : true;

  if (result.list.length < listParams.perPage) {
    listParams.finished = true;
    return;
  }

  listParams.page++;
};

// 猜你喜欢列表
const _getRecommendList = async () => {
  if (recommendListParam.finished) return;

  const result = await getRecommendList(recommendListParam);

  if (recommendListParam.page === 1) {
    recommendList.value = result.list;
  } else {
    recommendList.value = recommendList.value.concat(result.list);
  }

  if (result.list.length < recommendListParam.perPage) {
    recommendListParam.finished = true;
    return;
  }

  recommendListParam.page++;
};
provide('getNextPage', _getRecommendList);

const handleSort = async val => {
  listParams.sort = val;
  isLoading.value = false;
  await init();
};

const handleSearch = async val => {
  // searchVal.value = val;
  listParams.q = val;
  isLoading.value = false;
  // tarckEvents([{ path: 'packageA/pages/search/search', event: IEventsName.CL, properties: { searchKey: val } }]);
  onTrack();
  await init();
  isSearch.value = true;
};

const onTrack = () => {
  if (!linkflow) return;
  const { q: searchtText = '' } = listParams;
  // 埋点 搜索
  linkflow.track({
    event: ELinkflowEventsName.Content_Search,
    props: { searchtText, triggerPagePath } as ILinkflowEventsProps,
  });
};

onMounted(() => {
  isFirst.value = false;
  const data: any = Taro.getCurrentInstance().page?.data;
  data.eventsInfo = listParams;

  _getRecommendList();
});
</script>

<style lang="scss" module>
.container {
  background-color: $white;
  .list_sort {
    padding: 0 16px;
    width: 100%;
    background: white;
  }
  .main {
    width: 100%;
    box-sizing: border-box;
    margin-top: 8px;
    .list_product {
      padding: 0 16px;
      margin-top: 8px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &_list {
      width: 100%;
    }
  }
  .no_data {
    margin: 0 auto;
    margin-top: 200px;
  }
  .empty {
    margin: auto;
    width: 100%;
    text-align: center;
    color: #6b7280;
  }
  .sticky {
    position: relative;
    // position: sticky;
    // left: 0;
    // top: 0;
    // background: #fff;
    // z-index: 2;
  }
  .like {
    margin-top: 12px;
  }
}
</style>
