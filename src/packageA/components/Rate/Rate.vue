<template>
  <view>
    <block v-for="star in stars" :key="star">
      <image
        :class="$style['icon-rate']"
        :src="star <= value ? require(`@/static/icon/rate=yes.png`) : require(`@/static/icon/rate=no.png`)"
        @tap="handleRating(star)"
      />
    </block>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const emits = defineEmits(['update:value', 'update:isRate']);
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  isRate: {
    type: Boolean,
    default: false,
  },
});

const stars = Array<number>(5)
  .fill(0)
  .map((_, index) => index + 1);

// 是否评分
const isRating = computed({
  get() {
    return props.isRate;
  },
  set(v) {
    emits('update:isRate', v);
  },
});

/**
 * 评分
 * @param star 选择分数
 */
const handleRating = (star: number) => {
  if (isRating.value) return;

  const starVal = props.value !== star ? star : 0;
  emits('update:value', starVal);
};
</script>

<style lang="scss" module>
.icon-rate {
  width: 24px;
  height: 24px;
  margin-right: 4px;
}
</style>
