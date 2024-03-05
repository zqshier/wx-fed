<template>
  <!-- v-if="addressContents" -->
  <view :class="$style['address-warp']" class="f_s-12 f_w-400" v-if="addressContents">
    <view class="nut-flex nut-row-between">
      <view :class="$style.box_title">退货地址</view>
      <view :class="$style.box_btn" class="f_s-10 nut-flex nut-row-center" @tap="handleCopy">复制</view>
    </view>
    <view :class="$style.address_content" class="f_s-14 f_w-400 nut-flex nut-row-between">
      <view :class="$style.content_left">
        <block v-for="item in addressContents" :key="item">
          <view :class="$style.address_text">{{ item }}</view>
        </block>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { useDocumentStore } from '@/stores';
import { Toast } from '@/utils';
import Taro from '@tarojs/taro';
import { onMounted, ref } from 'vue';

const addressContents = ref<any>('');

const documentStore = useDocumentStore();
const getAddress = async () => {
  const doc = await documentStore.load('logistic_address');
  addressContents.value = doc?.contents[0].content.split(/[(\r\n)\r\n]+/) || '';
};

const handleCopy = () => {
  if (!addressContents.value[1]) return;
  Taro.setClipboardData({
    data: addressContents.value[1],
    success() {
      Toast('地址已复制');
    },
  });
};

onMounted(() => {
  Taro.nextTick(async () => {
    await getAddress();
  });
});
</script>

<style lang="scss" module>
.address-warp {
  border-radius: 8px;
  background: var(--block, #eee);
  padding: 8px 12px;
  color: $Primary;
  font-family: 'FZLanTingHei-R-GBK';

  .address_content {
    margin-top: 4px;
    .content_left {
      width: 237px;
    }
  }
  .address_text {
    // font-weight: 400;
    // &:first-child {
    //   color: $font-color;
    // }
    margin-bottom: 4px;
    &:nth-child(2) {
      color: var(--tertiary, #a5a5a5);
    }
  }
}
.box_btn {
  width: 36px;
  height: 16px;
  color: #ffffff;
  border-radius: 8px;
  background: var(--tertiary, #a5a5a5);
  font-family: 'FZLanTingHei-R-GBK';
}
</style>
