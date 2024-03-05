<template>
  <view
    :class="$style.nav_layout"
    class="nut-flex nut-col-center nut-row-center"
    :style="{ border: borderStyle, background: bgColor }"
  >
    <view :class="$style.image_box" @tap="gotoPage(props.modes[0])">
      <view :class="[$style['image_box-item']]" v-if="props.modes[0] !== TYPE_PAGE.CUSTOMER">
        <view :class="[$style.image, $style[`image_${props.modes[0]}`]]" :style="imageStyle"></view>
      </view>

      <view :class="[$style['image_box-item']]" v-else>
        <button
          shape="square"
          plain
          open-type="contact"
          :class="[$style.image, $style[`image_${props.modes[0]}`]]"
          :style="imageStyle"
        ></button>
      </view>
      <view v-show="props.modes[0] === TYPE_PAGE.CART && cartListLen" :class="$style.dot" class="numfnt">
        <text>{{ cartListLen }}</text>
      </view>
    </view>
    <view :class="$style.line"></view>
    <view :class="[$style.image_box, $style['image_box-r']]" @tap="gotoPage(props.modes[1])">
      <view :class="[$style['image_box-item']]" v-if="props.modes[1] !== TYPE_PAGE.CUSTOMER">
        <view :class="[$style.image, $style[`image_${props.modes[1]}`]]" :style="imageStyle"></view>
      </view>

      <view :class="[$style['image_box-item']]" v-else>
        <button
          shape="square"
          plain
          open-type="contact"
          :class="[$style.image, $style[`image_${props.modes[1]}`]]"
          :style="imageStyle"
        ></button>
      </view>
      <view v-show="cartView" :class="$style.dot" class="numfnt">
        <text>{{ cartListLen }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
export enum TYPE_PAGE {
  BACK = 'back',
  SEARCH = 'search',
  HOME = 'index',
  CART = 'cart',
  SHOP = 'shop',
  CUSTOMER = 'customer',
}
</script>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { useCartStore, useUserStore } from '@/stores';
import { PropType, computed, CSSProperties, inject } from 'vue';
import { goBack, openCustomerServiceChat as openService } from '@/utils';

const props = defineProps({
  modes: {
    type: Array as PropType<string[]>,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [TYPE_PAGE.BACK, TYPE_PAGE.HOME],
  },
  iconColor: {
    type: String,
    default: '#fff',
  },
  lineColor: {
    type: String,
    default: 'white',
  },
  bgColor: {
    type: String,
    default: '',
  },
});

const backFn = (inject('back') as any) || null;

const lineColor = computed(() => {
  if (props.lineColor === 'white') {
    return 'rgba(255,255,255,0.36)';
  } else if (props.lineColor === 'black') {
    return 'rgba(0,0,0,0.12)';
  }
  return props.iconColor;
});

const borderStyle = computed(() => {
  return `1px solid ${lineColor.value}`;
});

const imageStyle = computed((): CSSProperties => {
  return {
    background: props.iconColor,
  };
});

const cartListLen = computed((): number => {
  return (useCartStore().cartInfo?.items && useCartStore().cartInfo?.items.length) || 0;
});

const cartView = computed(
  (): boolean => props.modes[1] === TYPE_PAGE.CART && cartListLen.value && useUserStore().isPhone,
);

const gotoPage = (type: string) => {
  if (backFn) {
    return backFn();
  }

  if (type === TYPE_PAGE.BACK) {
    return goBack();
  }
  if (type === TYPE_PAGE.CUSTOMER) {
    return openService();
  }
  if (type === TYPE_PAGE.CART) {
    Taro.navigateTo({ url: '/packageA/pages/cart/cart' });
    return;
  }
  if (type === TYPE_PAGE.SEARCH) {
    Taro.navigateTo({ url: '/packageA/pages/search/search' });
    return;
  }
  const url = `/pages/${type}/${type}`;
  Taro.switchTab({ url });
};

// const goBack = () => {
//   const pages = Taro.getCurrentPages(); // 当前页
//   const beforePage = pages[pages.length - 2];
//   if (!beforePage) {
//     Taro.switchTab({ url: '/pages/index/index' });
//   } else {
//     Taro.navigateBack();
//   }
// };
</script>
<style lang="scss" module>
.nav_layout {
  position: absolute;
  left: 8px;
  width: 87px;
  height: 32px;
  border-radius: 16px;
  transition: all 0.3s;
  background: transparent;
  .image_box {
    position: relative;

    &-item {
      position: relative;
      width: 24px;
      height: 24px;
      overflow: hidden;
      .image {
        position: relative;
        width: 24px;
        height: 24px;
        &_back {
          background-size: 24px;
          mask: url(../../static/icon/icon_back.png) no-repeat;
          mask-size: 24px 24px;
        }
        &_cart {
          background-size: 24px;
          mask: url(../../static/icon/icon_cart_w.png) no-repeat;
          mask-size: 24px 24px;
        }
        &_search {
          background-size: 24px;
          mask: url(../../static/icon/icon_search_w.png) no-repeat;
          mask-size: 24px 24px;
        }
        &_index {
          background-size: 24px;
          mask: url(../../static/icon/icon_home.png) no-repeat;
          mask-size: 24px 24px;
        }
        &_back {
          background-size: 24px;
          mask: url(../../static/icon/icon_back.png) no-repeat;
          mask-size: 24px 24px;
        }
        &_customer {
          background-size: 24px;
          mask: url(../../static/icon/custom_sm.png) no-repeat;
          mask-size: 24px 24px;
        }
      }
    }

    .dot {
      position: absolute;
      bottom: 11px;
      left: 11px;
      font-size: 9px;
      min-width: 12px;
      height: 12px;
      line-height: 14px;
      padding: 2px;
      text-align: center;
      font-weight: 800;
      background: $Brand;
      color: $white;
      border-radius: 8px;
      box-sizing: content-box;
    }
  }
  .line {
    width: 1px;
    height: 16px;
    background-color: v-bind(lineColor);
    margin: 0 8px;
    transition: all 0.3s;
  }
}
</style>
