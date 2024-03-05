<template>
  <view :class="$style.layout">
    <scroll-view
      :scroll-x="true"
      scroll-with-animation
      class="nut-flex nut-col-top nut-row-center"
      :class="$style.title_scroll"
      :enhanced="true"
      :show-scrollbar="false"
      :enable-flex="true"
    >
      <block v-for="(tag, index) in tags" :key="tag.name">
        <view
          class="nut-flex-col nut-col-center nut-row-center"
          :class="[$style.sort, curIndex === index ? $style.sort_on : '']"
          @click="onClickTag(index)"
        >
          <text :class="$style.sort_title" class="f_s-20">{{ tag.name }}</text>
        </view>
      </block>
    </scroll-view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ITopicTag } from '@/dto/topic';
import variables from '@/scss/variables';

defineProps({
  tags: {
    type: Array<ITopicTag>,
    default: [],
  },
  tagColor: {
    type: String,
    default: variables.primaryColor,
  },
  lineColor: {
    type: String,
    default: variables.secendary,
  },
});

const emit = defineEmits(['update:idx']);

const curIndex = ref<number>(0); // 当前选中

function onClickTag(idx: number) {
  curIndex.value = idx;
  emit('update:idx', curIndex.value);
}
</script>
<style lang="scss" module>
.layout {
  width: 343px;
  height: 34px;
  .title_scroll {
    max-width: 343px;
    height: 34px;
    align-items: baseline;
    white-space: nowrap;
    .sort {
      position: relative;
      padding: 0 16px;
      line-height: 26px;
      color: v-bind(tagColor);
      &_on {
        &::after {
          content: '';
          position: absolute;
          bottom: -6px;
          width: 21.5px;
          height: 1px;
          transform: scaleY(0.5);
          background-color: v-bind(lineColor);
          z-index: 2;
        }
      }
      &_title {
        z-index: 1;
      }
    }
  }
}
</style>
