<template>
  <view class="f_s-12 nut-flex nut-row-right" :class="$style.sort">
    <text
      @tap="handleSortDefault(sortType.default)"
      :class="[$style['sort-padR'], { [$style['sort-select']]: sortVal == sortType.default }]"
      >默认</text
    >
    <view class="nut-flex nut-row-center" :class="$style['sort-padR']" @tap="handleSortPrice">
      <text :class="{ [$style['sort-select']]: isSortPrice }">价格</text>
      <image
        :src="isSortPrice ? require(`@/static/icon/sort_on.png`) : require(`@/static/icon/sort.png`)"
        :class="[$style['sort-img'], { [$style['sort-img_desc']]: sortVal === sortType.priceAsc }]"
      ></image>
    </view>

    <view class="nut-flex nut-row-center" :class="$style['sort-padR']" v-if="showSortMore" @tap="handleSortMore">
      <view :class="$style['sort-num']" class="nut-flex nut-row-center f_s-9 f_w-500" v-if="isFilteredNum">{{
        filteredNum
      }}</view>
      <text :class="{ [$style['sort-select']]: isFilteredNum }">筛选</text>
      <image src="@/static/icon/filter.png" :class="$style['sort-img']"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { sortType } from '@/dto/goods';
import Taro from '@tarojs/taro';

const emits = defineEmits(['handleSort']);
const props = defineProps({
  filterOptions: {
    type: Object,
    default: () => {
      return [];
    },
  },
  showSortMore: {
    type: Boolean,
    default: true,
  },
  // 筛选条件个数
  filteredItems: {
    type: Number,
    default: 0,
  },
  // 类目ID
  sonId: {
    type: Number,
    default: 0,
  },
  // 分类名称
  title: {
    type: String,
    default: '',
  },
});

let isAsc = ref<boolean>(false);
let sortVal = ref<string>('');

const isSortPrice = computed(() => {
  return sortVal.value != sortType.default;
});

const filteredNum = computed(() => {
  return props.filteredItems;
});

// const categoryId = computed(() => {
//   return props.sonId;
// });

const isFilteredNum = computed(() => {
  return filteredNum.value > 0;
});

const handleSortPrice = () => {
  isAsc.value = !isAsc.value;
  sortVal.value = isAsc.value ? sortType.priceAsc : sortType.priceDesc;
  handleSort();
};
const handleSortDefault = val => {
  sortVal.value = val;
  handleSort();
};

const handleSortMore = () => {
  Taro.navigateTo({
    url: `/packageA/pages/advancedFilter/advancedFilter?data=${JSON.stringify(props.filterOptions)}&sonId=${
      props.sonId
    }&title=${props.title}`,
  });
};

const handleSort = () => {
  emits('handleSort', sortVal.value);
};
</script>

<style lang="scss" module>
.sort {
  color: $Tertiary;
  padding-top: 8px;
  margin-right: -8px;
  .sort-padR {
    padding: 8px;
  }
  .sort-select {
    color: $Primary;
  }
  .sort-screen {
    padding: 10px 0 8px 8px;
  }
  .sort-img {
    margin-left: 4px;
    width: 12px;
    height: 12px;
    &_desc {
      transform: rotate(180deg);
    }
  }
  .sort-num {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    background: $Primary;
    color: $white;
    border-radius: 50%;
  }
}
</style>
