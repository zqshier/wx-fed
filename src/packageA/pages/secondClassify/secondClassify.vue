<template>
  <view class="container" :class="$style.container">
    <view id="sticky">
      <CustomBar :title="title" />

      <ClassifyScroll v-if="catalogData" :list="catalogData?.children" :selectedId="sonId" @tabsChange="tabsChange" />
    </view>

    <view :class="$style.main">
      <view :class="$style['sort-wrap']" class="nut-flex nut-row-between">
        <image src="../../../static/icon/search.png" :class="$style['sort-search']" @tap="goSearch" />
        <!--排序按钮  -->
        <Sort
          :filterOptions="filterOptionsList"
          :filteredItems="filteredNum"
          :sonId="Number(sonId)"
          :title="sortTitle"
          @handleSort="handleSort"
        />
      </view>
      <block v-if="isLoading && goodsList[tabIndex]?.length > 0">
        <scroll-view
          :scroll-y="true"
          :enhanced="true"
          :show-scrollbar="false"
          :scroll-top="scrollTop"
          lower-threshold="30"
          @scroll="handleScroll"
          @scrolltolower="getGoodsList"
          :style="{ height: scrollHeight, padding: '0 16px' }"
        >
          <view class="iphone-end nut-flex nut-flex-wrap nut-row-between" :class="$style.productList">
            <ProductItem :item="item" width="166" imgHeight="184" v-for="item in goodsList[tabIndex]" :key="item.id" />
          </view>
        </scroll-view>
      </block>
      <view
        v-if="isLoading && goodsList[tabIndex]?.length === 0"
        class="nut-flex nut-flex-1 nut-col-center nut-row-center"
        :class="$style.no_data"
        :catch-move="true"
      >
        <DefaultPage
          imgWidth="48"
          imgHeight="48"
          imgMbottom="20"
          :icon="cdnurl('static/no-order.png')"
          tip="暂无数据"
        />
      </view>
      <view :class="$style.loading" class="nut-flex nut-row-center" v-if="!isLoading && !isError">
        <Loading1 />
      </view>

      <view :class="$style['no-data']" class="nut-flex-col nut-col-center nut-row-center" v-if="isError">
        <image :class="$style['no-data_icon']" src="../../../static/icon/sold-out.png" mode="scaleToFill" />
        <view :class="$style['no-data_title']" class="f_s-14 f_w-400">加载失败</view>
        <view :class="$style['no-data_btn']" class="nut-flex nut-row-center f_s-14 f_w-400" @tap="goIndexPage"
          >返回首页</view
        >
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { goodsSearchApi } from '@/api/goods';
import ProductItem from '@/components/ProductItem/ProductItem.vue';
import { GoodsSearchParams, ICatalog, IGoodsList } from '@/dto/goods';
import { useCatalogStore } from '@/stores';
import { cdnurl, queryRect, shareOptions } from '@/utils/index';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import { getRefererPath } from '@/utils/track/config';
import { Loading1 } from '@nutui/icons-vue-taro';
import Taro, {
  getApp,
  nextTick,
  useDidShow,
  useReachBottom,
  useReady,
  useRouter,
  useShareAppMessage,
} from '@tarojs/taro';
import { isEmpty } from 'lodash';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import ClassifyScroll from './components/classifyScroll/ClassifyScroll.vue';
import Sort from './components/sort/sort.vue';

const linkflow = getApp()[`${process.env.APP_ID}`];

const router = useRouter();
const catalogsStore = useCatalogStore();

const parId = Number(router.params.parId || 0); // 父类目id
const sonId = ref<number>(Number(router.params.sonId || 0)); // 类目id
const title = ref<string>(router.params.title || '');
const catalogData = ref<ICatalog>();

const tabIndex = ref<number>(0); // 选中类目下标
const filteredNum = ref<number>(0); // 筛选条件个数
const goodsList = ref<any>([]);
const finished = ref<boolean>(false); // 是否加载完成
const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);
const scrollTop = ref<number>(0);
const oldScroll = ref<{ scrollTop: number }>({ scrollTop: 0 });

const listParams = reactive<GoodsSearchParams>({
  page: 1,
  perPage: 20,
  catalogIds: [sonId.value],
  q: '',
  sort: '',
  properties: '',
  priceRange: [],
});

const scrollHeight = ref('100%');
let timeout: NodeJS.Timeout;

const filterOptionsList = computed(() => {
  if (!catalogData.value || !sonId.value) return;
  return catalogsStore.findCatalogProperties(sonId.value);
});

const sortTitle = computed(() => {
  const findList = catalogData.value?.children?.find(item => item.id === sonId.value);
  return findList?.name ?? '';
});

const init = async () => {
  isLoading.value = false;
  isError.value = false;
  finished.value = false;
  listParams.page = 1;
  await getGoodsList();
};

async function getGoodsList() {
  if (finished.value) return;

  const indexVal = tabIndex.value;
  let result: IGoodsList;

  try {
    result = await goodsSearchApi(listParams);
  } catch (err) {
    console.error('goodsSearchApi error:', err);
    isError.value = true;
    return;
  }

  const list = result.list || [];

  if (list.length < listParams.perPage) {
    finished.value = true;
  }

  if (listParams.page === 1) {
    goodsList.value[indexVal] = list || [];
  } else {
    goodsList.value[indexVal] = goodsList.value[indexVal].concat(list);
  }

  listParams.page += 1;
  isLoading.value = true;
}

const handleSort = async val => {
  if (!isLoading.value) return;

  listParams.sort = val;
  await init();
};

const tabsChange = (index, id) => {
  tabIndex.value = index;
  sonId.value = id;

  listParams.catalogIds = [id];
  listParams.priceRange = [];
  listParams.properties = '';
  filteredNum.value = 0;

  scrollGoTop();
  removeStorage();

  onTrack(index);
  init();
};

onMounted(async () => {
  await catalogsStore.load();
  catalogData.value = catalogsStore.findCatalog(parId);
  await init();
});

useDidShow(async () => {
  const preload = Taro.getCurrentInstance().preloadData;
  if (!preload || isEmpty(preload.pageParams)) return;

  isLoading.value = false;
  const { properties, priceRange, selectNum } = preload.pageParams;
  listParams.priceRange = priceRange;
  listParams.properties = properties;
  filteredNum.value = selectNum;

  await init();
});

function goSearch() {
  Taro.navigateTo({ url: '/packageA/pages/search/search' });
}

function goIndexPage() {
  Taro.reLaunch({
    url: '/pages/index/index',
  });
}

// 回到顶部
const scrollGoTop = () => {
  scrollTop.value = oldScroll.value.scrollTop;
  nextTick(() => {
    scrollTop.value = 0;
  });
};

async function getTopRect() {
  try {
    const res = await queryRect('sticky', false);

    scrollHeight.value = `calc(100vh - ${res?.height + 50}px)`;
  } catch (e) {
    console.debug('getTopRect error=', e);
  }
}

const handleScroll = e => {
  oldScroll.value.scrollTop = e.detail.scrollTop;
};

const removeStorage = () => {
  Taro.removeStorageSync('selectedCategoryId');
  Taro.removeStorageSync(`selectedOptions`);
  Taro.preload({ pageParams: {} });
};

onUnmounted(() => {
  removeStorage();
  clearTimeout(timeout);
});

useReady(() => {
  timeout = setTimeout(() => {
    getTopRect();
  }, 300);
});

useShareAppMessage(() => {
  const params = { sonId: sonId.value, parId, title: title.value };
  const shareReturn = shareOptions({ page: '/packageA/pages/secondClassify/secondClassify', params });
  console.debug('secondClassify page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});

useReachBottom(() => getGoodsList());

const onTrack = index => {
  if (!linkflow) return;
  if (!catalogData.value?.children[index]) return;
  const { name: productSubdivide = '', id: productSubdivideId = '' } = catalogData.value.children[index];
  const triggerPagePath = getRefererPath();
  linkflow.track({
    event: ELinkflowEventsName.ProductDetail_Sort,
    props: { productSort: title.value, productSubdivide, productSubdivideId, triggerPagePath } as ILinkflowEventsProps,
  });
};
</script>

<style lang="scss">
.secondClassify_tabs {
  // width: 327px;

  .nut-tabs__titles {
    background-color: $white;
    border-bottom: 0.5px solid $Divide;
  }

  .nut-tabs__titles-item {
    color: $Tertiary;
    padding: 24px 0 8px;
    min-width: 86px;
    &.active {
      color: $Primary;
      .nut-tabs__titles-item__line {
        width: 0;
        height: 0;
      }
    }
    .nut-tabs__titles-item__text {
      font-size: 12px;
      z-index: 1;
    }
  }

  .nut-tabs__content {
    .nut-tab-pane {
      padding: 0;
    }
  }
}
</style>
<style lang="scss" module>
@import './secondClassify.scss';
</style>
