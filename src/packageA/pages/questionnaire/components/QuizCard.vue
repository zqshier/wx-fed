<template>
  <view
    :class="[$style.card, { [$style['rotate-out-2-br-cw']]: isAnimations }]"
    :style="cardStyle"
    @animationend="emits('next')"
  >
    <view :class="$style.number" class="numfnt f_s-12 f_w-500"
      >{{ padNumber(index + 1) }}/{{ padNumber(listLength) }}</view
    >

    <view :class="[$style.content, { [$style.content_centered]: !data.image }]">
      <image :class="$style.img" :src="imageProcess(data.image, 'L')" v-if="data.image"></image>
      <view :class="$style.title" class="f_s-16 f_w-600">{{ data.title }}</view>
      <view :class="$style.options" class="nut-flex nut-flex-wrap nut-row-between f_s-12 f_w-400">
        <view
          :class="[$style.options_item, { [$style['options_item-on']]: selectedIndex === indexs }]"
          class="nut-flex nut-row-center f_s-14 f_w-400"
          v-for="(item, indexs) in data.options"
          :key="item.key"
          @tap="selectAnswer(item, indexs)"
        >
          <text> {{ processedText(item.value) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { IQuestions } from '@/dto/survey';
import { imageProcess } from '@/utils';
import { PropType, computed, ref } from 'vue';

const emits = defineEmits(['answerSelected', 'next']);
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  listLength: {
    type: Number,
    default: 0,
  },
  questionIndex: {
    type: Number,
    default: 0,
  },
  info: {
    type: Object as PropType<IQuestions>,
    default: () => ({}),
  },
  isNextItem: {
    type: Boolean,
    default: false,
  },
});

const selectedIndex = ref<number>();
const isAnimations = ref<boolean>(false);

const isActive = computed(() => {
  return props.active;
});

const data = computed(() => {
  return props.info;
});

const cardStyle = computed(() => ({
  zIndex: isActive.value ? 99 : props.index > props.questionIndex ? props.listLength - props.index : 1, // 激活的卡片层级较高
  boxShadow:
    props.isNextItem || props.index === props.listLength - 1 ? '0px 4px 10px 0px rgba(165, 165, 165, 0.65)' : 'none',
}));

const selectAnswer = (item, index: number) => {
  if (!isActive.value || isAnimations.value) return; // 上一页未完成操作流程， 下一页不允许点击
  emits('answerSelected', { answer: [{ ...item }], questionId: data.value.id });
  selectedIndex.value = index;
};

const showAnimations = () => {
  isAnimations.value = true;
};

function processedText(val) {
  return val.slice(0, 8);
}

function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

defineExpose({
  showAnimations,
});
</script>

<style lang="scss" module>
.card {
  position: absolute;
  width: 351px;
  height: 556px;
  padding: 24px 32px;
  border-radius: 20px;
  background: #fff;
  // box-shadow: 0px 4px 10px 0px rgba(165, 165, 165, 0.65);
  .content {
    height: 100%;
    &_centered {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
  .img {
    margin: 24px 0;
    width: 287px;
    height: 280px;
  }
  .title {
    width: 100%;
    height: 42px;
    font-family: 'FZLanTingHei-B-GBK';
  }
  .options {
    margin-top: 24px;
    width: 287px;
    height: 96px;
    align-content: space-between;
    &_item {
      width: 124px;
      height: 40px;
      border-radius: 24px;
      border: 1px solid $Secendary;
      // .icon {
      //   background: rgba(165, 165, 165, 0.65);
      //   margin-right: 8px;
      //   width: 20px;
      //   height: 20px;
      // }
    }
    &_item-on {
      background: #f00;
      border: 1px solid #f00;
      color: White;
    }
  }
}

.rotate-out-2-br-cw {
  animation: rotate-out-2-br-cw 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
@keyframes rotate-out-2-br-cw {
  0% {
    transform: rotate(0);
    transform-origin: 100% 100%;
    opacity: 1;
  }
  99% {
    transform: rotate(35deg);
    transform-origin: 100% 100%;
    opacity: 0;
  }
  100% {
    transform: rotate(0);
    transform-origin: 100% 100%;
    opacity: 0;
  }
}
</style>
