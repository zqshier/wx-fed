<template>
  <view :class="$style.goods" class="nut-flex nut-flex-col nut-col-center nut-row-left">
    <TopicTags :tags="data.tags" v-model:idx="curIndex" />
    <!-- <view :class="$style.goods_list">
      <scroll-view
        :class="$style.scroll_view"
        class="nut-flex nut-col-top nut-row-left"
        :scroll-x="true"
        :enhanced="true"
        :show-scrollbar="false"
        :enable-flex="true"
      >
        <view :class="$style.scroll_view_box" class="nut-flex nut-col-top nut-row-left">
          <block v-for="(item, index) in goods" :key="index">
            <Product :item="item" />
          </block>
        </view>
      </scroll-view>
    </view> -->
    <Item :info="goods"></Item>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { topicProps } from './props';
import { ITopic } from '@/dto/topic';
// import Product from './Product.vue';
import Item from './Item.vue';
import TopicTags from './TopicTags.vue';

const props = defineProps(topicProps);
const data = ref<ITopic>(props.data as any);
const curIndex = ref<number>(0); // 当前选中
const goods = computed(() => data.value.tags[curIndex.value]?.items);
</script>
<style lang="scss" module>
@import './topic.scss';
</style>
