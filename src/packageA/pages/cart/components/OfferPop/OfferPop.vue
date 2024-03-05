<template>
  <view :catch-move="true">
    <CustomPopup v-model:show="isShow">
      <view :class="$style['offer_pop-layout']" class="popup_filter">
        <view :class="$style.title" class="f_s-12">优惠明细</view>
        <view :class="$style.item" class="nut-flex nut-col-center nut-row-between f_s-14">
          <text>商品总价</text>
          <text :class="$style.num" class="f_s-16 numfnt-medium">¥{{ infoData?.goodsAmount }}</text>
        </view>
        <view
          v-if="Number(infoData?.promotionDiscountAmount)"
          :class="$style.item"
          class="nut-flex nut-col-center nut-row-between f_s-14"
        >
          <text>活动立减</text>
          <text :class="$style.num" class="f_s-16 numfnt-medium">-¥{{ infoData?.promotionDiscountAmount }}</text>
        </view>
        <view
          v-if="Number(infoData?.couponDiscountAmount)"
          :class="$style.item"
          class="nut-flex nut-col-center nut-row-between f_s-14"
        >
          <text>优惠券</text>
          <text :class="$style.num" class="f_s-16 numfnt-medium">-¥{{ infoData?.couponDiscountAmount }}</text>
        </view>
        <view :class="$style.item" class="nut-flex nut-col-center nut-row-between f_s-14">
          <text>共优惠</text>
          <text :class="[$style.num, $style.num_2]" class="f_s-16 numfnt-medium">-¥{{ discountAmount }}</text>
        </view>
        <view :class="$style.tips" class="f_s-12">以上优惠只包含优惠券</view>
      </view>
    </CustomPopup>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import CustomPopup from '@/components/CustomPopup/CustomPopup.vue';
import { useCartStore } from '@/stores';
const userCartStore = useCartStore();
const emits = defineEmits(['update:show']);
const infoData = computed(() => {
  return userCartStore.cartInfo;
});
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
});
const isShow = computed({
  get() {
    return props.show;
  },
  set(v) {
    emits('update:show', v);
  },
});

const discountAmount = computed((): number => {
  return Number(infoData.value?.couponDiscountAmount || 0) + Number(infoData.value?.promotionDiscountAmount || 0);
});

const onClose = () => {
  emits('update:show', false);
};
</script>
<style lang="scss" module>
@import './OfferPop.scss';
</style>
