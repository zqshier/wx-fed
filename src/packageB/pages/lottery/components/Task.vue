<template>
  <view :class="$style.layout">
    <CustomTitle title="更多抽奖机会" tips="完成以下任务即可获取" />

    <view :class="$style.layout_item" class="nut-flex-col nut-row-center nut-col-center">
      <block v-for="(task, idx) in tasks" :key="idx">
        <TaskItem :task="task" :isOut="isOut" />
      </block>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CustomTitle from './CustomTitle.vue';
import TaskItem from './TaskItem.vue';

const props = defineProps(['metaData', 'btnLodging', 'isOut']);

const tasks = computed(() => props.metaData);
</script>
<style lang="scss" module>
.layout {
  width: 375px;
  padding: 29px 0 32px;
  &_item {
    width: 375px;
    padding-top: 12px;
    // .line {
    //   width: ;
    // }
  }
}
</style>
