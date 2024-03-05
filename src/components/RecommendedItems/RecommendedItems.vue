<template>
  <view :class="$style.container">
    <view :class="$style.container_title" class="f_s-16">{{ title }}</view>
    <view :class="$style.container_goods">
      <Item :info="data" :padding-left="16" :class="$style.goods_item" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Item from '../Topic/Item.vue';

const props = defineProps({
  title: {
    type: String,
    default: '猜你喜欢',
  },
  goods: {
    type: Object,
    default: () => ({}),
  },
  fontWeight: {
    type: String,
    default: '400',
  },
});

const data = computed(() => props.goods);
const fontWeight = computed(() => props.fontWeight);

// const goodsItems = ref([
//   {
//     id: 279,
//     name: '仲夏梦境',
//     subtitle: '',
//     price: '845.00',
//     guidePrice: null,
//     image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/08/4c925e24a4c04742ab8e21ffd918238e.jpeg',
//     itemType: 'goods',
//     link: '/packageA/pages/goodsDetail/goodsDetail?id=279',
//     images: ['https://res.dev.center.ugrow.cn/app-zippo/2023/08/4c925e24a4c04742ab8e21ffd918238e.jpeg'],
//   },
//   {
//     id: 280,
//     name: '甜蜜炮弹',
//     subtitle: '',
//     price: '389.00',
//     guidePrice: '389.00',
//     image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/08/263df7feab2543c5abd4e79c163a0b0f.jpeg',
//     itemType: 'goods',
//     link: '/packageA/pages/goodsDetail/goodsDetail?id=280',
//     images: ['https://res.dev.center.ugrow.cn/app-zippo/2023/08/263df7feab2543c5abd4e79c163a0b0f.jpeg'],
//   },
//   {
//     id: 281,
//     name: '浪漫梦魂',
//     subtitle: '',
//     price: '294.00',
//     guidePrice: '379.00',
//     image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/08/d25df2f16ce34df4ab0e16008c49cf1c.jpeg',
//     itemType: 'goods',
//     link: '/packageA/pages/goodsDetail/goodsDetail?id=281',
//     images: ['https://res.dev.center.ugrow.cn/app-zippo/2023/08/d25df2f16ce34df4ab0e16008c49cf1c.jpeg'],
//   },
//   {
//     id: 277,
//     name: '机械之心',
//     subtitle: '',
//     price: '724.00',
//     guidePrice: '1049.00',
//     image: 'https://res.dev.center.ugrow.cn/app-zippo/2023/08/0cd6e091a6b34eacbb58f229d8e91600.jpeg',
//     itemType: 'goods',
//     link: '/packageA/pages/goodsDetail/goodsDetail?id=277',
//     images: ['https://res.dev.center.ugrow.cn/app-zippo/2023/08/0cd6e091a6b34eacbb58f229d8e91600.jpeg'],
//   },
// ]);
</script>
<style lang="scss" module>
.container {
  box-sizing: border-box;
  &_title {
    padding-left: 16px;
    color: $Primary;
    font-weight: v-bind(fontWeight);
  }
  &_goods {
    .goods_item {
      padding: 16px 0 24px 0;
    }
  }
}
</style>
