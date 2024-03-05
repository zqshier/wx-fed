<template>
  <view :class="$style.box">
    <scroll-view
      :scroll-x="true"
      :scrollLeft="scrollLeft"
      :enhanced="true"
      :scroll-with-animation="true"
      class="nut-flex nut-col-top"
      :class="$style['content-scroll']"
      id="content-scroll"
      :show-scrollbar="true"
      :enable-flex="true"
    >
      <view :class="[$style['scroll-warp'], tabList.length < 5 ? 'nut-flex nut-row-between' : '']">
        <block v-for="(item, index) in tabList" :key="index">
          <view :class="$style['scroll-item']" id="scroll-item" @tap="handleItem(index, item.id)">
            <text
              class="nut-line-1 f_s-12"
              :class="[$style['item_name'], { [$style['item_name-selected']]: curIndex === index }]"
              >{{ item.name }}</text
            >
            <!-- <view :class="[$style['item_active'], { [$style['item_active-selected']]: curIndex === index }]"></view> -->
          </view>
        </block>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { queryRect } from '@/utils';
import { useAppStore } from '@/stores';

const props = defineProps(['list', 'selectedId']);
const emits = defineEmits(['tabsChange']);
// 屏幕宽度
const windowWidth = computed((): number => useAppStore().sysInfo.screenWidth || 0);

const tabList = computed(() => props.list || []);
const tabIndex = computed(() => {
  const idx = tabList.value.findIndex(item => {
    return item.id === props.selectedId;
  });
  if (idx === -1) return 0;
  return idx;
});

const curIndex = ref<number>(Number(tabIndex.value) || 0); // 当前选中
let scrollLeft = ref<number>(0); // 横向滚动条位置
const scrollViewWidth = ref<number>(0); // 导航区宽度
const tabsRect = ref<any>([]);

const handleItem = (arg: number, id: number) => {
  emits('tabsChange', arg, id);
  curIndex.value = arg;
  resize();
};

// 设置位置
const setScrollLeft = () => {
  const list = tabList.value;
  // 当前活动tab的布局信息，有tab菜单的width和left(为元素左边界到父元素左边界的距离)等信息
  const tabRectItem = list[curIndex.value];
  // 累加得到当前item到左边的距离
  const offsetLeft = list.slice(0, curIndex.value).reduce((total, curr) => {
    return total + curr.rect.width;
  }, 0);

  // 将活动的tabs-item移动到屏幕正中间，实际上是对scroll-view的移动
  let scrollLeftVal =
    offsetLeft -
    (tabsRect.value.width - tabRectItem.rect.width) / 2 -
    (windowWidth.value - tabsRect.value.right) / 2 +
    tabsRect.value.left / 2;

  // 这里做一个限制，限制scrollLeft的最大值为整个scroll-view宽度减去tabs组件的宽度
  scrollLeftVal = Math.min(scrollLeftVal, scrollViewWidth.value - tabsRect.value.width);
  scrollLeft.value = Math.max(0, scrollLeftVal);
};
// 获取所有标签的尺寸
const resize = () => {
  // 如果不存在list，则不处理
  if (tabList.value.length === 0) {
    return;
  }
  Promise.all([getTabsRect(), getAllItemRect()]).then(([tabsRectRes, itemRect = []]) => {
    tabsRect.value = tabsRectRes;
    scrollViewWidth.value = 0;
    itemRect.map((item, index) => {
      // 计算scroll-view的宽度，这里
      scrollViewWidth.value += item.width;
      // 另外计算每一个item的中心点X轴坐标
      tabList.value[index].rect = item;
    });
    // 获取了tabs的尺寸之后，设置滑块的位置
    setScrollLeft();
  });
};

// 获取导航菜单的尺寸
const getTabsRect = () => {
  return new Promise(resolve => {
    queryRect('content-scroll', false).then(size => {
      resolve(size);
    });
  });
};

// 获取所有标签的尺寸
const getAllItemRect = () => {
  return new Promise(resolve => {
    queryRect(`scroll-item`, true).then(size => {
      resolve(size);
    });
  });
};

onMounted(() => {
  setTimeout(() => {
    resize();
  }, 200);
});
</script>

<style lang="scss" module>
.box {
  display: flex;
  width: 375px;
  padding: 24px 16px 0px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  .content-scroll {
    width: 343px;
    padding-bottom: 8px;
    border-bottom: 0.5px solid #dddddd;
    white-space: nowrap;
    .scroll-warp {
      width: 100%;
      height: 16px;
      display: flex;
    }
    .scroll-item {
      height: 18px;
      line-height: 18px;
      text-align: center;
      .item_name {
        color: $Tertiary;
        width: 86px;
        display: block;
        font-family: 'FZLanTingHei-R-GBK';
        &-selected {
          font-weight: 600;
          color: $Primary;
        }
      }
      .item_active {
        margin-top: 10px;
        width: 100%;
        height: 2px;
        background: $primary-color;
        opacity: 0;
        &-selected {
          opacity: 1;
        }
      }
    }
  }
}
</style>
