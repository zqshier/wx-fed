<template>
  <view class="nut-flex-col nut-col-center" :class="$style.coupon">
    <view
      :class="[
        $style['coupon-warp'],
        { [$style['coupon-warp-box']]: isBorder, [$style['coupon-warp_disable']]: isDisable },
      ]"
      class="nut-flex-col nut-col-top nut-row-between"
    >
      <view :class="$style['coupon-top']" class="nut-flex nut-col-top nut-row-between">
        <view class="f_s-8 f_w-400">
          <view class="f_s-10 f_w-600" :class="$style['top_type']"
            >满减券 ｜ {{ isAvailableStatus ? '部分可用' : '全场通用' }}
          </view>

          <block v-if="itemData?.start">
            <view class="nut-flex f_s-8 f_w-400" :class="{ [$style.time_border]: isAvailableStatus }">
              <text :class="$style.time_mg">有效期</text>
              <text> {{ format(new Date(itemData.start), 'yyyy.MM.dd') }}</text>
              <span>-</span>
              <text>{{ format(new Date(itemData.end), 'yyyy.MM.dd') }}</text></view
            >
          </block>
          <block v-else>
            <view
              class="nut-flex f_s-8 f_w-400"
              :class="{ [$style.time_border]: isAvailableStatus }"
              v-if="itemData.expiration.start"
            >
              <text :class="$style.time_mg">有效期</text>
              <text>{{ format(new Date(itemData.expiration.start), 'yyyy.MM.dd') }}</text>
              <span>-</span>
              <text>{{ format(new Date(itemData.expiration.end), 'yyyy.MM.dd') }}</text></view
            >
            <view class="nut-flex f_s-8 f_w-400" :class="{ [$style.time_border]: isAvailableStatus }" v-else>{{
              expirationText
            }}</view>
          </block>

          <!-- 指定说明 -->
          <view :class="$style['top_statement']" v-if="isAvailableStatus">仅限部分商品可用</view>
        </view>

        <view :class="$style.amount" class="nut-flex-col nut-col-bottom">
          <view class="f_s-14 f_w-500 numfnt-medium" :class="$style['top_denomination']"
            >¥{{ formatPrice(itemData.value) }}</view
          >
          <view class="f_s-8 f_w-400" :class="$style['top_conditions']"
            >满{{ formatPrice(itemData.threshold) }}可用</view
          >
        </view>
      </view>

      <view :class="$style['coupon-end']" class="nut-flex nut-col-bottom nut-row-between">
        <view :class="$style['end_usageRules']" class="f_s-8 f_w-400 nut-flex nut-row-center" @tap="handleRule">
          <block v-if="isHasRule && props.showRule">
            <text>查看使用规则</text>
            <image
              :class="[$style.icon_arrows, !isUnfold ? $style.down : '']"
              src="../../../../static/icon/arr-s.png"
            ></image>
          </block>
        </view>

        <block v-if="!$slots.btn">
          <block v-if="statusText">
            <view
              :class="[$style['end_btn'], { [$style['end_btn-couponCenter']]: btnStyle }]"
              class="f_s-12 f_w-400 nut-flex nut-row-center"
              v-if="!isBtnLoading"
              @tap="handleClick"
            >
              {{ statusText }}
            </view>
            <nut-button
              v-else
              :loading="isBtnLoading"
              shape="square"
              plain
              :class="[$style.end_btn, $style.btn_get]"
            ></nut-button>
          </block>
          <image v-if="couponTypeImg" :class="$style.status_img" :src="couponTypeImg"></image>
        </block>
        <slot name="btn" v-if="$slots.btn"></slot>
      </view>
    </view>
    <view class="f_s-10 f_w-400 mg-bottom-12" :class="[$style['rule_state'], isUnfold ? $style['info_rule-none'] : '']"
      ><text :decode="true">{{ itemData.rules }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { COMPONENTS_COUPON_TYPE, LOGIN_TARGET } from '@/constants';
import { CouponType } from '@/dto/coupons';
import useLoginPop from '@/hook/useLoginPop';
import { useCouponStore } from '@/stores';
import { Toast, cdnurl, formatPrice, subscribeMessage } from '@/utils';
import Taro from '@tarojs/taro';
import { format } from 'date-fns';
import { computed, ref } from 'vue';
import { dProps } from './props';

const { checkMemberLevel } = useLoginPop();

const props = defineProps(dProps);
const emits = defineEmits(['checkRule', 'userStateChanged']);

const expirationText = computed(() => {
  const { itemData } = props;
  if (!itemData || !itemData.expiration) return '';
  if (itemData.expiration.after > 0) {
    return `领券${itemData.expiration.after}天后生效，有效期${itemData.expiration.days}天`;
  }
  return `领券后有效期${itemData.expiration.days}天`;
});

const isHasRule = computed(() => (props.itemData.rules ? true : false));

let isUnfold = ref<boolean>(true);
let isBtnLoading = ref<boolean>(false);

const statusText = computed((): string => {
  if (props.page === COMPONENTS_COUPON_TYPE.COUPON_CENTER || props.page === COMPONENTS_COUPON_TYPE.COUPON_SHARE) {
    switch (props.itemData.userState) {
      case 2:
        return '立即使用';
      case 3:
        return '已使用';
      default:
        return '立即领取';
    }
  }

  if (new Date(props.itemData.start).getTime() > new Date().getTime()) {
    return '待生效';
  }

  const btnText = {
    1: '立即使用',
  };
  return btnText[props.status];
});

const couponTypeImg = computed(() => {
  const status = {
    2: cdnurl('static/used.png'),
    3: cdnurl('static/expired.png'),
  };
  return status[props.status];
});

const isDisable = computed(
  (): boolean =>
    (props.page === 'coupon' && (props.status === CouponType.used || props.status === CouponType.expired)) || false,
);

// const isGet = computed(
//   (): boolean =>
//     (props.page === COMPONENTS_COUPON_TYPE.COUPON_CENTER || props.page === COMPONENTS_COUPON_TYPE.COUPON_SHARE) &&
//     props.itemData.userState !== 1,
// );
// 立即使用按钮样式
const btnStyle = computed(() => {
  return !!(
    (props.page === COMPONENTS_COUPON_TYPE.COUPON_CENTER || props.page === COMPONENTS_COUPON_TYPE.COUPON_SHARE) &&
    props.itemData.userState === 2
  );
});

const isAvailableStatus = computed(() => {
  return props.itemData.name === '部分商品可用';
});

const handleClick = async () => {
  if (isDisable.value) return;

  if (props.status === CouponType.unused || props.itemData.userState !== CouponType.unused) {
    if (Number(props.itemData.itemId) > 0) {
      // 使用指定优惠券ID
      Taro.navigateTo({
        url: `/packageA/pages/goodsDetail/goodsDetail?id=${props.itemData.itemId}`,
      });
    } else {
      Taro.switchTab({ url: '/pages/shop/shop' });
    }
    return;
  }

  checkMemberLevel(LOGIN_TARGET.gifts, handleClick);
  // 校验vip
  // const target: string = LOGIN_TARGET.gifts;
  // const flag = authFlow({ target });

  // Taro.eventCenter.off(TARGET_PHOME_AUTH_CALLBACK);
  // Taro.eventCenter.once(TARGET_PHOME_AUTH_CALLBACK, arg => {
  //   if (target === decodeURIComponent(arg)) {
  //     handleClick();
  //   }
  // });

  // if (!flag) return;

  const mid = process.env.COUPON_EXPIRE_MID as string;
  isBtnLoading.value = true;
  let subed = false;

  try {
    const res = await subscribeMessage([mid]);
    console.log('handleClick res=', res);
    subed = res[mid] === 'accept';
  } catch (error) {
    console.log('handleClick error', error);
  }

  handleGet(subed ? mid : undefined);
};

const handleGet = async (templateId?: string) => {
  if (!props.itemData.couponId) {
    isBtnLoading.value = false;
    console.log('....', props.itemData);
    return;
  }

  let memo = '';
  if (props.page === COMPONENTS_COUPON_TYPE.COUPON_CENTER) memo = '领券中心';
  if (props.page === COMPONENTS_COUPON_TYPE.COUPON_SHARE) memo = '分享领券页';

  try {
    await useCouponStore().pull({
      couponId: props.itemData.couponId,
      templateId,
      memo,
    });

    Toast('领取成功', 2000, 'none');
    emits('userStateChanged', 2, props.index);
  } catch (error) {
    Toast(error.message, 2000, 'none');
  } finally {
    isBtnLoading.value = false;
  }
};

const handleRule = () => {
  isUnfold.value = !isUnfold.value;
};
</script>

<style lang="scss" module>
.coupon {
  flex-direction: column;
}
.coupon-warp {
  padding: 5px 12px 10px 12px;
  width: 223px;
  height: 78px;
  align-self: stretch;
  z-index: 2;
  position: relative;
  border-radius: 8px;
  // overflow: hidden;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0px 2.62857px 6.57143px 0px rgba(165, 165, 165, 0.65);
  &-box {
    padding: 16px;
    // border-radius: 8px;
    border: 0px solid $Divide;
    background: var(--white, #fff);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: 0 0;
      box-sizing: border-box;
      border: 1px solid $Divide;
      border-radius: 16px;
      pointer-events: none;
    }
  }
  .coupon-top {
    width: 100%;
    color: $Primary;
    font-family: 'FZLanTingHei-R-GBK';
    .top_type {
      line-height: 24px;
    }
    // .top_time {
    //   line-height: 24px;
    // }
    .time_border {
      padding-bottom: 4px;
      border-bottom: 1px solid #d9d9d9;
    }
    .time_mg {
      margin-right: 2px;
    }
    .top_statement {
      max-width: 185px;
      display: inline-block;
      padding-top: 4px;
    }
    // .top_denomination {
    //   font-family: CentraleSans;
    // }
    .amount {
      margin-top: 3px;
    }
    .top_conditions {
      color: $Tertiary;
    }
  }

  .coupon-end {
    width: 100%;
    position: relative;
    .end_usageRules {
      color: $Tertiary;
      font-family: 'FZLanTingHei-R-GBK';
      line-height: 18px;
    }
    .end_btn {
      width: 96px;
      height: 32px;
      border-radius: 20px;
      background: $Primary;
      color: #fff;
      &-couponCenter {
        background: transparent;
        color: $Primary;
        border: 1px solid var(--tertiary, #a5a5a5);
      }
    }
    .btn_get {
      // background: transparent;
      border: none;
    }
    .status_img {
      position: absolute;
      right: 0;
      bottom: -11px;
      width: 64px;
      height: 52px;
      // background: #a5a5a5;
    }
    .icon_arrows {
      margin-left: 8px;
      width: 12px;
      height: 12px;
    }
    .down {
      transform: rotate(180deg);
    }
  }
}
.coupon-warp_disable {
  .coupon-top {
    color: $Tertiary;
  }
}
.rule_state {
  width: 223px;
  margin-top: -11px;
  position: relative;
  left: 0px;
  padding: 18px 10px 9px;
  border-radius: 8px;
  background: $Primary;
  color: $white;
  &.info_rule-none {
    display: none;
  }
}
</style>
