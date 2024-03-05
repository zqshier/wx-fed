<template>
  <view class="container" :class="$style.container">
    <CustomBar title="筛选" :fixed="true" />

    <view :class="$style.collapse">
      <block v-for="(panel, index) in panelList" :key="index">
        <view :class="$style['collapse-item']" :style="{ transform: panel.transform }">
          <view :class="$style['collapse-item_title']" class="nut-flex nut-row-between">
            <view :class="$style['title-name']" class="f_s-16"
              >{{ panel.name }}({{ panel.selectedValues.length }})</view
            >
            <image
              src="@/static/icon/arrowLeft.png"
              :class="[$style['title-img'], { [$style['title-img_up']]: panel.isCollapsed }]"
              @tap="toggleCollapse(index)"
            ></image>
          </view>
          <view
            :class="[
              $style['collapse-item_content'],
              panel.isCollapsed ? $style['content-none'] : '',
              { [$style['numfnt-medium']]: index === panelList.length - 1 },
            ]"
            :style="{ height: panel.isCollapsed ? 0 : panel.height + 'px' }"
            class="nut-flex nut-row-left"
            id="panel-content"
          >
            <view
              v-for="item in panel.values"
              :key="item"
              :class="[
                $style['checkbox-warp'],
                { [$style['checkbox-warp_select']]: panel.selectedValues.includes(item) },
              ]"
              class="f_s-12 f_w-400 nut-flex nut-row-left"
              @tap="toggleOption(panel, item)"
            >
              <image
                :src="
                  panel.selectedValues.includes(item)
                    ? require('@/static/icon/checkbox_on.png')
                    : require('@/static/icon/checkbox.png')
                "
                :class="$style['checkbox-img']"
              ></image>
              <text>{{ item }}</text>
            </view>
          </view>
          <view :class="$style['collapse-item_border']"></view>
        </view>
      </block>
      <!-- 占位 -->
      <view :class="$style.placeholder"> </view>
    </view>

    <view :class="$style.end" class="nut-flex nut-row-center f_s-14 f_w-400">
      <nut-button shape="square" plain type="primary" :class="[$style.btn, $style.btn_mg]" @click="resetFilters"
        >重置</nut-button
      >
      <nut-button shape="square" plain type="primary" :class="[$style.btn, $style.btn_mg]" @click="applyFilters"
        >确定</nut-button
      >
    </view>
  </view>
</template>

<script setup lang="ts">
import { queryRect } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import Taro, { getApp, useReady, useRouter } from '@tarojs/taro';
import { onMounted, onUnmounted, ref } from 'vue';

interface IPageParams {
  properties: string[]; //参数筛选, 格式: 参数名:参数值, 支持多个
  priceRange: number[][]; // 价格区间
  selectNum: number;
}

interface IPanelList {
  height: number;
  name: string;
  selectedValues: string[];
  values: string[];
  transform: string;
  isCollapsed: boolean;
}

const linkflow = getApp()[`${process.env.APP_ID}`];

const router = useRouter();
const categoryId = ref(router.params.sonId || 0);
const panelList = ref<IPanelList[]>([]);
const priceRanges = ['¥0-299', '¥300-599', '¥600-899', '¥900-1199', '¥1200-1499', '¥1500-2999', '¥3000-4999', '¥5000+'];
const priceRangesArr = {
  '¥0-299': [0, 299],
  '¥300-599': [300, 599],
  '¥600-899': [600, 1199],
  '¥900-1199': [900, 1199],
  '¥1200-1499': [1200, 1499],
  '¥1500-2999': [1500, 2999],
  '¥3000-4999': [3000, 4999],
  '¥5000+': [5000],
};

const toggleOption = (panel, optionValue) => {
  const selectedOptions = panel.selectedValues;
  if (selectedOptions.includes(optionValue)) {
    selectedOptions.splice(selectedOptions.indexOf(optionValue), 1);
  } else {
    selectedOptions.push(optionValue);
  }
};

const getMinMaxPriceFromSelection = (selectedRanges: string[]) => {
  const prices: number[][] = selectedRanges.map(range => priceRangesArr[range]);
  return prices;
};

// 确定
const applyFilters = async () => {
  const pageParams: IPageParams = {
    properties: [],
    priceRange: [],
    selectNum: 0,
  };

  // const trackParams = {};

  panelList.value.forEach(item => {
    if (item.selectedValues.length) {
      pageParams.selectNum += item.selectedValues.length;
      if (item.name !== '价格区间') {
        // trackParams[item.name] = item.selectedValues.join(',');
        const obj = `${item.name}:${item.selectedValues.join(',')}`;
        pageParams.properties.push(obj);
      } else {
        pageParams.priceRange = getMinMaxPriceFromSelection(item.selectedValues);
      }
    }
  });

  // if (!isEmpty(trackParams)) {
  //   tarckEvents([
  //     {
  //       path: 'packageA/pages/advancedFilter/advancedFilter',
  //       event: IEventsName.FILTER_CL,
  //       properties: { ...trackParams, categoryId: categoryId.value, desc: `参数值筛选` },
  //     },
  //     {
  //       path: 'packageA/pages/advancedFilter/advancedFilter',
  //       event: IEventsName.FILTER_CL,
  //       properties: {
  //         ...{ 价格区间: `${pageParams.priceRange.join(',')}` },
  //         categoryId: categoryId.value,
  //         desc: `价格区间筛选`,
  //       },
  //     },
  //   ]);
  // }

  onTrack();
  Taro.setStorageSync('selectedCategoryId', categoryId.value);
  Taro.setStorageSync(`selectedOptions`, panelList.value);

  Taro.preload({ pageParams: pageParams });
  Taro.navigateBack();
};

// 重置
const resetFilters = () => {
  panelList.value.map(item => {
    item.selectedValues = [];
  });
};

const getAllItemRect = () => {
  queryRect(`panel-content`, true).then(rects => {
    if (rects && rects.length > 0) {
      panelList.value.forEach((panel, index) => {
        panel.height = rects[index].height;
        // panel.transform = 'translateX(-100%)';
      });
    }
  });
};

const parsedData = () => {
  const oldList = JSON.parse(router.params.data || '');
  oldList.push({
    name: '价格区间',
    values: priceRanges,
  });
  panelList.value = oldList.map(item => {
    return {
      ...item,
      selectedValues: [],
    };
  });
};

// 模拟动画效果
const animateItems = () => {
  panelList.value.forEach((item, index) => {
    setTimeout(() => {
      item.transform = 'translateX(0)';
    }, 100 * index); // 延迟 100ms 让每个项依次滑入
  });
};

let animaTimeout;
let rectTimeout;

useReady(async () => {
  animaTimeout = setTimeout(() => {
    animateItems();
  }, 200);
});

onMounted(() => {
  const selectedCategoryId = Taro.getStorageSync('selectedCategoryId');

  if (categoryId.value === selectedCategoryId) {
    panelList.value = Taro.getStorageSync(`selectedOptions`) || [];
    return;
  }

  parsedData();

  rectTimeout = setTimeout(() => {
    getAllItemRect();
  }, 500);
});

const toggleCollapse = (index: number) => {
  panelList.value[index].isCollapsed = !panelList.value[index].isCollapsed;
};

onUnmounted(() => {
  clearTimeout(rectTimeout);
  clearTimeout(animaTimeout);
});

const onTrack = () => {
  if (!linkflow) return;
  linkflow.track({ event: ELinkflowEventsName.ProductDetail_Search });
  panelList.value.length &&
    panelList.value.forEach(item => {
      item.selectedValues.length &&
        linkflow.track({
          event: ELinkflowEventsName.ProductDetail_Subdivide_Search,
          props: {
            primaryCategory: item.name,
            secondaryCategory: item.selectedValues.join('|'),
            productSort: router.params?.title || '',
          } as ILinkflowEventsProps,
        });
    });
};
</script>

<style lang="scss" module>
.container {
  background: $white;
}
.collapse {
  width: 375px;
  height: 100%;
  padding: 0 16px;
  position: relative;
  .collapse-item {
    margin-top: 16px;
    width: 100%;
    overflow: hidden;
    transform: translateX(-110%);
    transition: transform 0.5s ease-in-out; /* 添加动画过渡效果 */
    align-items: flex-start;
    &_title {
      width: 100%;
      margin-bottom: 8px;
    }
    .collapse-item_content {
      box-sizing: content-box;
      transition: all 0.35s;
      flex-wrap: wrap;
      font-family: 'FZLanTingHei-R-GBK';
      box-sizing: border-box;
      .checkbox-img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }

      .checkbox-warp {
        color: $Tertiary;
        margin-right: 16px;
        width: 103px;
        height: 30px;
        &:nth-of-type(3n + 3) {
          margin-right: 0;
        }
        &_select {
          color: $Primary;
        }
      }
    }
    .content-none {
      opacity: 0;
    }
    .numfnt-medium {
      font-family: 'CentraleSans-medium';
    }
    &_border {
      padding-top: 8px;
      border-bottom: 0.5px solid #d9d9d9;
    }
  }
  .title-name {
    font-family: 'FZLanTingHei-R-GBK';
    max-width: 345px;
    color: $Primary;
  }
  .title-img {
    width: 22px;
    height: 22px;
    padding: 3px;
    transform: rotate(-90deg);
    transition: transform 0.3s ease;
    &_up {
      transform: rotate(90deg);
    }
  }
}
.end {
  width: 100%;
  background: #fff;
  width: 375px;
  height: 88px;
  padding: 8px 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  font-family: 'FZLanTingHei-R-GBK';
  .btn {
    border-radius: 20px;
    border: 1px solid $Tertiary;
    width: 120px;
    height: 40px;
    &_mg {
      margin-right: 16px;
    }
  }
}
.placeholder {
  width: 100%;
  height: 88px;
}
</style>
