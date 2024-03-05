<template>
  <view>
    <view :class="$style['status-bar']" :style="{ height: `${statusBarHeight}px`, background: bgColor }"></view>
    <nut-navbar :style="{ background: bgColor }" :left-show="false" :border="border" :class="$style['nut-navbar-my']">
      <template #left v-if="showBack">
        <view :class="$style['icon']">
          <image v-if="backIcon" :class="$style['icon-back']" :src="backIcon" @tap="goBack" />
          <image v-else :class="$style['icon-back']" src="../../../../../static/icon/icon_back.png" @tap="goBack" />
        </view>
      </template>
      <template #content>
        <view
          class="nut-flex nut-col-between"
          :class="[showBack ? $style['content-box-isLeft'] : '', $style['content-box']]"
        >
          <view @tap="goSearch" :catch-move="true" class="nut-flex nut-col-between" :class="[$style.search]">
            <image
              :class="$style['icon-search']"
              :src="isSearchBtn ? require(`../../icon/search_on.png`) : require(`../../icon/search.png`)"
            />
            <input
              ref="inputRef"
              class="f_s-14"
              :class="$style.input"
              @input="onInput"
              @confirm="handleSearch"
              type="text"
              :value="inputVal"
              :disabled="disabled"
              :maxlength="maxLength"
              confirmType="search"
              placeholder="搜索商品"
            />
            <text
              :class="$style['search-btn']"
              class="f_s-14"
              @tap="handleSearch"
              :catch-move="true"
              v-show="isSearchBtn"
              >搜索</text
            >
          </view>
        </view>
      </template>
    </nut-navbar>
  </view>
</template>

<script lang="ts" setup>
import Taro from '@tarojs/taro';
import { useAppStore } from '@/stores';
import { computed, onMounted, ref, watch } from 'vue';
import { dProps } from './props';
import { trim } from 'lodash';

const emits = defineEmits(['back', 'search', 'update:modelValue']);
const props = defineProps(dProps);

const inputRef: any = ref(null);
let inputVal = ref(props.modelValue);

const isSearchBtn = ref<boolean>(false);

watch(
  () => props.modelValue,
  (newVal, preVal) => {
    if (newVal === preVal) return;
    inputVal.value = newVal;
  },
);

const statusBarHeight = computed((): number => {
  return useAppStore().sysInfo.statusBarHeight || 0;
});

const goBack = () => {
  // 如果自定义了点击返回按钮的函数，则执行，否则执行返回逻辑
  if (props.customBack) {
    emits('back');
  } else {
    const pages = Taro.getCurrentPages(); // 当前页
    const beforePage = pages[pages.length - 2];
    if (!beforePage) {
      // 从外部链接进来统一返回首页
      goHome();
    } else {
      Taro.navigateBack();
    }
  }
};

const goSearch = () => {
  if (!props.isNavFn) return;
  Taro.navigateTo({
    url: `/pages/search/search`,
  });
};

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = trim(input.value);

  isSearchBtn.value = !!value;
  inputVal.value = value;
};

function handleSearch() {
  emits('search', inputVal.value);
}

const goHome = () => {
  Taro.reLaunch({
    url: '/pages/index/index',
  });
};

onMounted(() => {
  if (props.autofocus) {
    inputRef.value.focus();
  }
});
</script>
<style>
.nut-navbar {
  box-shadow: none;
  margin-bottom: 0;
  padding: 0;
}
.nut-navbar__left {
  padding: 4px;
}
</style>
<style lang="scss" module>
.status-bar {
  width: 100%;
  height: auto;
  background: v-bind('bgColor');
}
.nut-navbar-my {
  position: relative;
  background: v-bind('bgColor');
  box-shadow: none;
  margin-top: -2px;
  margin-bottom: 0;
  width: 375px;
  padding: 0 8px;

  .icon {
    margin-top: 4px;
  }
  .icon-back {
    width: 24px;
    height: 24px;
  }
  .icon-search {
    margin-right: 16rpx;
    width: 24px;
    height: 24px;
  }
}
.content-box {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  &-isLeft {
    width: 216px;
    margin-left: 30px;
  }
  .search {
    width: 100%;
    height: 64rpx;
    padding: 8px 0 4px 0;
    box-sizing: border-box;
    border-bottom: 1px solid $Tertiary;
    font-family: 'FZLanTingHei-R-GBK';
    &-btn {
      color: $Primary;
      padding: 0 5px;
    }
  }
}

.input {
  color: $Primary;
  text-align: left;
  width: 66%;
}
</style>
