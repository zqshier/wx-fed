<template>
  <view :class="$style.layout">
    <view :class="$style.layout_top">
      <view v-if="isMember" :class="$style.user" class="nut-flex nut-flex-1 nut-row-left nut-col-center">
        <image
          :class="$style.avatar"
          :src="userInfo.avatar || logoCircel"
          mode="aspectFill"
          @tap="gotoUserInfoPage('头像')"
        ></image>
        <view class="nut-flex nut-flex-1 nut-flex-col nut-row-center nut-col-top">
          <!-- <text :class="$style.nickname" class="f_s-20 f_w-500 nut-line-1 numfnt-medium">{{ getNickname }}</text> -->
          <view :class="$style.name_box" class="nut-flex nut-row-center" @tap="gotoUserInfoPage('昵称')">
            <text :class="$style.nickname" class="f_s-16 f_w-600 nut-line-1">{{ getNickname }}</text>
            <image :class="$style.icon_edit" src="../../../static/icon/edit.png"></image>
          </view>

          <image
            :class="$style.levelImg"
            :src="currentMemberLevel?.image"
            mode="aspectFill"
            @tap.stop="goInterests"
          ></image>
        </view>
      </view>
      <view v-else :class="$style.none" class="nut-flex nut-row-top nut-col-center" @tap="gotoUserInfoPage">
        <text class="f_s-24 f_w-600">登录 / 注册</text>
        <image :class="$style.icon_right" src="../../../static/icon/arr-right-l.png"></image>
      </view>
      <view :class="$style.layout_bottom" class="nut-flex-col nut-col-bottom nut-row-left">
        <view :class="$style.title" class="f_s-14 nut-flex nut-row-between" @tap="gotoMyIntegralPage">
          <view class="f_w-600">
            <text>我的小火苗</text>
            <text :class="[$style.point, pointsTip ? 'numfnt-medium' : '']">{{ isMember ? pointsTip : '--' }}</text>
          </view>

          <view class="nut-flex" v-if="levelUpTips && isMember">
            <text>{{ levelUpTips }}</text>
            <image class="icon-right" :class="$style.icon_right" src="../../../static/icon/arr-right-s.png"></image>
          </view>
        </view>
        <view :class="$style.line">
          <view :class="$style.line_active" :style="{ width: `${levelProgress}%` }"></view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { LOGIN_TARGET } from '@/constants';
import { UserInfo } from '@/dto/user';
import useLoginPop from '@/hook/useLoginPop';
import logoCircel from '@/static/icon/logo_circle.png';
import { usePointStore, useUserStore } from '@/stores';
import Taro from '@tarojs/taro';
import { computed } from 'vue';

const { checkMemberLevel } = useLoginPop();

const userStore = useUserStore();
const pointStore = usePointStore();

const emits = defineEmits(['track']);

const userInfo = computed((): UserInfo => userStore.getUserInfo!);
const isMember = computed((): Boolean => !!userStore.isPhone);
const getNickname = computed(() => userInfo.value.nickname || userInfo.value.phone);
const pointsTip = computed((): number => pointStore.balance);

const currentMemberLevel = computed(() =>
  userInfo.value.memberLevels.find(o => o.levelCode === userInfo.value.memberLevel),
);

const nextLevel = computed(() => {
  if (!currentMemberLevel.value) return null;
  for (const cfg of userInfo.value.memberLevels) {
    if (cfg.level > currentMemberLevel.value.level) {
      return cfg;
    }
  }
  return null;
});

const levelUpTips = computed(() => {
  if (!currentMemberLevel.value) return '';
  if (!nextLevel.value) return '已达到最高等级';
  const threshold = subtractWithPrecision(nextLevel.value.threshold, Number(userInfo.value.memberLevelPoints));
  if (threshold > 0) return `还需消费${threshold}元升级`;
  return '';
});

const levelProgress = computed(() => {
  if (nextLevel.value && isMember.value) {
    return (Number(userInfo.value.memberLevelPoints) / nextLevel.value.threshold) * 100;
  }
  return 100;
});

// function handleShowLoginPop() {
//   emits('update:showLoginPop', true);
// }

function subtractWithPrecision(num1, num2) {
  const precision = Math.pow(10, 10); // 设定一个较大的精度值
  const result = Math.round((num1 - num2) * precision) / precision;
  return result;
}

function gotoMyIntegralPage() {
  // if (!pointsTip.value) return;
  emits('track', { modelName: '我的小火苗', buttonName: '小火苗描述文字' });
  // const path = Taro.getCurrentInstance().page?.route;
  // tarckEvents([{ path, event: IEventsName.CL, properties: { desc: `进入小火苗明细页面` } }]);

  const url = '/packageA/pages/myIntegral/myIntegral';
  Taro.navigateTo({ url });
}

function gotoUserInfoPage(buttonName?: string) {
  checkMemberLevel(LOGIN_TARGET.registerClick);

  emits('track', { modelName: '个人信息', buttonName });
  // const path = Taro.getCurrentInstance().page?.route;
  // tarckEvents([{ path, event: IEventsName.CL, properties: { desc: `进入个人信息页面` } }]);

  const url = '/packageA/pages/userInfo/userInfo';
  Taro.navigateTo({ url });
}

function goInterests() {
  emits('track', { modelName: '个人信息', buttonName: '会员等级' });
  Taro.navigateTo({ url: `/packageA/pages/memberRights/memberRights` });
}

// function handlePhoneFormat(str) {
//   const reg = /^(\d{3})\d{4}(\d{4})$/;
//   try {
//     str = str.replace(reg, '$1****$2');
//   } catch (e) {
//     /* empty */
//   }
//   return str;
// }
// onMounted(async () => {
//   await userStore.getUsersProfile();
// });
</script>
<style lang="scss" module>
.layout {
  &_top {
    width: 311px;
    height: 72px;
    margin-bottom: 12px;
    .none {
      width: 100%;
      height: 100%;
      color: $white;
      line-height: 32px;
      text-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      .icon_right {
        width: 24px;
        height: 24px;
      }
    }
    .user {
      width: 311px;
      height: 72px;
      .avatar {
        width: 72px;
        height: 72px;
        border-radius: 72px;
        margin-right: 16px;
      }
      .name_box {
        height: 24px;
        margin-bottom: 8px;
        .nickname {
          color: $white;
          max-width: 210px;
          font-family: 'FZLanTingHei-B-GBK';
          text-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
        }
        .icon_edit {
          margin-left: 8px;
          width: 16px;
          height: 16px;
        }
      }

      .levelImg {
        width: 84px;
        height: 28px;
      }
      // .level {
      //   color: $white;
      //   font-family: 'FZLanTingHeiS-R-GB';

      //   width: 84px;
      //   height: 28px;
      //   border-radius: 4px;
      //   &-vip1 {
      //     background: linear-gradient(180deg, #ecb9a9 0%, #c84f34 100%);
      //   }
      //   &-vip2 {
      //     background: linear-gradient(180deg, #d9d9d9 0%, #181818 100%);
      //   }
      //   &-vip3 {
      //     background: linear-gradient(180deg, #fae3c2 7.81%, #c2a16f 86.46%);
      //   }
      //   &-vip4 {
      //     background: linear-gradient(180deg, #ccf0ff 7.81%, #efb7cf 86.46%);
      //   }

      //   &_icon {
      //     margin-right: 4px;
      //     padding: 1px;
      //     width: 16px;
      //     height: 22px;
      //   }
      // }
    }
  }
  &_bottom {
    margin-top: 24px;
    color: $white;
    .title {
      width: 100%;
      height: 20px;
      text-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      .point {
        padding-left: 8px;
        margin-top: 3px;
      }
      .icon_right {
        width: 16px;
        height: 16px;
        // margin-left: 8px;
      }
    }
    .line {
      position: relative;
      width: 100%;
      height: 2px;
      margin-top: 8px;
      background-color: white;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      &_active {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: $Brand;
        transition: all 0.3s 200ms;
      }
    }
  }
}
</style>
