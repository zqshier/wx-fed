<template>
  <view :class="[$style['info-other']]" class="f_s-12 f_w-400" v-if="data">
    <view :class="$style['info-other_item']" class="nut-flex">
      <text :class="$style['item_name']">生效时间</text>
      <view :class="$style['item_val']">
        <block v-if="data?.start">
          <view class="nut-flex f_s-12 f_w-400">
            <text :class="$style.time_mg">有效期</text>
            <text> {{ format(new Date(data.start), 'yyyy.MM.dd') }}</text>
            <span>-</span>
            <text>{{ format(new Date(data.end), 'yyyy.MM.dd') }}</text></view
          >
        </block>
        <block v-else>
          <view class="nut-flex f_s-12 f_w-400" v-if="data?.expiration && data?.expiration.start">
            <text :class="$style.time_mg">有效期</text>
            <text>{{ format(new Date(data.expiration.start), 'yyyy.MM.dd') }}</text>
            <span>-</span>
            <text>{{ format(new Date(data.expiration.end), 'yyyy.MM.dd') }}</text></view
          >
          <view class="nut-flex f_s-11 f_w-400" v-else>{{ expirationText }}</view>
        </block>
      </view>
    </view>
    <view :class="$style['info-other_item']">
      <text :class="$style['item_name']">优惠面值</text>
      <text :class="$style['item_val']">{{ data.value }}元</text>
    </view>
    <view :class="$style['info-other_item']">
      <text :class="$style['item_name']">使用门槛</text>
      <text :class="$style['item_val']">满{{ data.threshold }}元可用</text>
    </view>
    <view :class="[$style['info-other_item'], $style.info_comb]">
      <text :class="$style['item_name']">使用条件</text>
      <text :class="$style['item_val']">{{ data.name === '部分商品可用' ? '部分可用' : '全场通用' }}</text>
    </view>
    <view :class="[$style['info-other_item'], $style.info_comb]" class="nut-flex nut-col-top" v-if="data.rules">
      <text :class="$style['item_name']">使用规则</text>
      <text :class="[$style['item_val'], $style['item_val-width']]">{{ data.rules }}</text>
    </view>
  </view>
</template>
<script setup lang="ts">
import { PropType, computed } from 'vue';
import { ICouponsItem } from '@/dto/coupons';
import { format } from 'date-fns';

const props = defineProps({
  data: {
    type: Object as PropType<ICouponsItem>,
    default: () => {},
  },
});

const expirationText = computed(() => {
  const { data } = props;
  if (!data || !data.expiration) return '';
  if (data.expiration.after > 0) {
    return `兑换${data.expiration.after}天后生效，有效期${data.expiration.days}天`;
  }
  return `兑换后有效期${data.expiration.days}天`;
});
</script>

<style lang="scss" module>
.info-other {
  width: 100%;
  &_mg {
    margin-bottom: 16px;
  }
  &_item {
    margin-bottom: 4px;
    color: $Primary;
    line-height: 18px;
    font-family: 'FZLanTingHei-R-GBK';
    .item_name {
      display: inline-block;
      width: 64px;
      color: $Secendary;
    }
  }
  .info-other_item:last-child {
    margin-bottom: 0;
  }

  .info_comb {
    .item_val {
      // position: relative;
      padding-right: 4px;
      margin-right: 4px;
      // &::after {
      //   content: ',';
      //   position: absolute;
      //   top: 40%;
      //   right: 0;
      //   width: 1px;
      //   height: 100%;
      //   transform: translateY(-50%);
      // }
      .time_mg {
        margin-right: 2px;
      }
      &-width {
        display: inline-block;
        width: 279px;
      }
    }
    .item_val:last-child {
      padding-right: 0;
      margin-right: 0;
      &::after {
        font-size: 0;
      }
    }
  }
}
</style>
