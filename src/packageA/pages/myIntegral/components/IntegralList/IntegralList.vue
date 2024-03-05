<template>
  <view :class="$style.integrallist_layout">
    <view :class="$style.box" class="border-05px-box-16">
      <block v-if="!load && listData && listData.length > 0">
        <view
          v-for="item in listData"
          :key="item.id"
          :class="$style.item"
          class="nut-flex nut-row-between f_s-14 f_w-400"
        >
          <view :class="$style.item_left" class="nut-flex-col">
            <text :class="$style['item_left-memo']">{{ item.memo }}</text>
            <text :class="$style['item_left-mg']" class="f_s-12 numfnt">{{
              format(new Date(item.createdAt), 'yyyy.MM.dd HH:mm:ss')
            }}</text>
          </view>
          <text class="f_w-500 numfnt-medium">{{ item.type === 'credit' ? '+' : '-' }}{{ item.changed }}</text>
        </view>
      </block>
      <view
        v-if="!load && listData && listData.length === 0"
        :class="$style.empty_box"
        class="nut-flex nut-row-center f_s-14"
        >暂无明细~</view
      >
      <Loading :show="load" :overlay-style="{ backgroundColor: variables.white, position: 'absolute' }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { IPointItem } from '@/dto/point';
import variables from '@/scss/variables';
import Loading from '@/components/Loading/Loading.vue';

const props = defineProps(['list', 'load']);

const listData = computed((): IPointItem[] => {
  return props.list;
});

const load = computed((): boolean => {
  return props.load;
});
</script>

<style lang="scss" module>
.integrallist_layout {
  width: 345px;
  padding-top: 16px;
  .box {
    position: relative;
    width: 345px;
    min-height: 258px;
    padding: 16px;
    background: $white;
    .item {
      width: 100%;
      height: 42px;
      margin-bottom: 16px;
      .item_left {
        color: $font-color;
        &-memo {
          line-height: 20px;
          font-family: 'FZLanTingHei-R-GBK';
        }
        &-mg {
          color: $Tertiary;
          margin-top: 6px;
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .empty_box {
    width: 100%;
    height: 258px;
    color: $Tertiary;
  }
}
</style>
