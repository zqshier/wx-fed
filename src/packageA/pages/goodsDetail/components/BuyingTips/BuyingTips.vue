<template>
  <view :class="$style.buyTip" @tap="onChange" v-if="aftersalesContent">
    <view class="nut-flex nut-row-between">
      <view :class="$style['title']" class="f_s-16 f_w400">售后须知</view>
      <image
        :class="[$style['icon'], { [$style.icon_unfold]: isDown }]"
        src="../../../../../static/icon/arrowLeft.png"
      />
    </view>
    <Document
      :class="[$style.document, { [$style.document_unfold]: isDown }]"
      :dcontents="aftersalesContent"
      :max-width="343"
      format="png"
    />
  </view>
</template>
<script setup lang="ts">
import Document from '@/components/Document/Document.vue';
import { GoodsInfo } from '@/dto/goods';
import { PropType, computed, ref } from 'vue';

const props = defineProps({
  data: { type: Object as PropType<GoodsInfo | null>, default: null },
});

const isDown = ref(false);

const goodsInfo = computed(() => props.data);

const aftersalesContent = computed(() => {
  return (
    goodsInfo.value?.extends.aftersales &&
    goodsInfo.value?.extends.aftersales.length > 0 &&
    goodsInfo.value?.extends.aftersales.map(i => ({ content: i.url, id: i.url, meta: {}, type: 'image' }))
  );
});

const onChange = () => {
  isDown.value = !isDown.value;
};
</script>
<style lang="scss" module>
.buyTip {
  width: 100%;
  padding: 16px 0;
  border-top: 0.5px solid $Divide;
  border-bottom: 0.5px solid $Divide;
  &_collapse {
    width: 100%;
  }
  .title {
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    line-height: 24px;
  }
  .icon {
    width: 16px;
    height: 16px;
    transform: rotate(90deg);
    transition: transform 0.3s ease;
    &_unfold {
      transform: rotate(-90deg);
    }
  }

  .document {
    margin-top: 0;
    opacity: 0;
    overflow: hidden;
    height: 0;
    transition: all 0.3s ease;
    &_unfold {
      margin-top: 16px;
      opacity: 1;
      height: auto;
      overflow: visible;
      transition: all 0.3s ease;
    }
  }
}
</style>
