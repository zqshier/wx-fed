<template>
  <CustomPopup :zIndex="99999" v-model:show="isShow" position="center" :popup-style="popupStyle" catchMove>
    <view class="nut-flex-col nut-col-center" :class="$style.content">
      <view :class="$style.title" class="f_s-16">奖品规则</view>
      <scroll-view scroll-y="true" enhanced="true" enable-flex="true" :class="$style['pop_list-scroll']">
        <Document :code="code" :maxWidth="272" :textStyle="textStyle" />
      </scroll-view>
    </view>
  </CustomPopup>
</template>

<script setup lang="ts">
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import Document from '@/components/Document/Document.vue';
import { toRpx } from '@/components/PosterBuilder/utils/tools';
import variables from '@/scss/variables';
import { computed } from 'vue';

const popupStyle = { maxHeight: `${toRpx(320)}rpx`, width: `auto` };
const textStyle = { color: variables.primaryColor, lineHeight: `${toRpx(20)}rpx`, padding: 0 };
const emits = defineEmits(['update:isShow']);
const props = defineProps(['isShow', 'code']);

const isShow = computed({
  get() {
    return props.isShow;
  },
  set(v) {
    emits('update:isShow', v);
  },
});
</script>
<style lang="scss" module>
.content {
  width: 320px;
  max-height: 320px;
  padding: 32px 24px;
  .title {
    padding-bottom: 4px;
  }
  .pop_list-scroll {
    max-height: 208px;
  }
}
</style>
