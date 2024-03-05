<!-- 专题组 -->
<template>
  <view :class="$style.layout" v-for="(topic, index) in data?.topics" :key="topic.code">
    <Topic v-if="index < data!.topics.length - 1" :data="topic" />
    <Topic1 v-else :data="topic" :animationKey="animationKey" />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ITopicGroup } from '@/dto/topic';
import { getTopicGroup } from '@/api/topics';
import { topicGroupProps } from './props';
import Topic from './Topic.vue';
import Topic1 from './Topic1.vue';
const props = defineProps(topicGroupProps);
const data = ref<ITopicGroup>();

async function load(code: string) {
  if (!code) return;
  data.value = await getTopicGroup(code);
}

onMounted(() => {
  load(props.code);
});
</script>
<style lang="scss" module>
.layout {
  padding-top: 16px;
  &:last-child {
    padding-top: 0;
  }
}
</style>
