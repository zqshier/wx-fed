<template>
  <BackgroundImage :class="$style.layout">
    <CustomBar title="更多信息" />

    <view :class="$style.main" class="border-05px-box-16 rounded_corners-8">
      <view
        :class="$style['main-item']"
        class="nut-flex nut-row-between nut-col-center"
        hover-class="btn-hover"
        v-for="item in docList"
        :key="item.code"
        @tap="gotoHelpPage(item)"
      >
        <text class="f_s-14">{{ item.title }}</text>
        <image :class="$style.img" src="../../../static/icon/chevron-right.png" mode="aspectFill" />
      </view>

      <view :class="$style.footer" class="nut-flex nut-row-between nut-col-center">
        <nut-button class="nut-flex-1" type="primary" @click="showOutPop = true">退出登录</nut-button>
      </view>
    </view>

    <Notice
      v-model:show="showOutPop"
      @otherClose="() => (showOutPop = false)"
      :confirmBtnStyle="confirmBtnStyle"
      :isComfirmBtnplain="false"
      :cancelFunKey="true"
      submitText="确认退出"
      title="提示"
      @submit="handleLogOut"
    >
      <view :class="$style.notice_title" class="f_s-14 nut-flex nut-col-center nut-row-center">
        退出后，小程序部分功能需登录后才能使用
      </view>
    </Notice>
  </BackgroundImage>
</template>
<script setup lang="ts">
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import Notice from '@/components/Notice/Notice.vue';

import { DOCUMENTS } from '@/constants';
import { LOGIN_STATUS_KEY } from '@/stores/key';
import { useUserStore } from '@/stores/modules/user';
import { LinkType, handleLink } from '@/utils';
import { ELinkflowEventsName, ILinkflowEventsProps } from '@/utils/track';
import Taro, { getApp } from '@tarojs/taro';
import { ref } from 'vue';

const confirmBtnStyle = {
  color: '#FFF',
  background: `#333`,
  border: 'none',
};

interface IDocParams {
  title: string;
  url?: string;
  code?: string;
  type: LinkType;
}
const docList: Array<IDocParams> = [
  // { title: DOCUMENTS.GONGLUE.title, type: LinkType.h5, code: DOCUMENTS.GONGLUE.code },
  { title: DOCUMENTS.YINSITIAOKUAN.title, type: LinkType.h5, code: DOCUMENTS.YINSITIAOKUAN.code },
  { title: DOCUMENTS.FUWUXIEYI.title, type: LinkType.h5, code: DOCUMENTS.FUWUXIEYI.code },
  // { title: DOCUMENTS.QIANDAO.title, type: LinkType.h5, code: DOCUMENTS.QIANDAO.code },
  { title: '任务中心', type: LinkType.path, url: '/packageA/pages/taskCenter/taskCenter' },
];

const showOutPop = ref(false);

const handleLogOut = () => {
  // 设置登录态
  Taro.setStorageSync(LOGIN_STATUS_KEY, false);
  useUserStore().setUserInfo(null);
  Taro.navigateBack();
};

const gotoHelpPage = (item: IDocParams) => {
  onTrack(item.title);
  if (item.type === LinkType.h5) {
    const url = `/packageA/pages/help/help?title=${item.title}&code=${item.code}`;
    Taro.navigateTo({ url });
  } else {
    handleLink(item.type, item.url!);
  }
};

const linkflow = getApp()[`${process.env.APP_ID}`];

const onTrack = (buttonName: string) => {
  if (!linkflow) return;
  linkflow.track({ event: ELinkflowEventsName.Setting_Page_Click, props: { buttonName } as ILinkflowEventsProps });
};
</script>
<style lang="scss" module>
.layout {
  width: 375px;
  .main {
    width: 343px;
    padding: 0 18px;
    margin: 16px auto;

    .main-item {
      position: relative;
      width: 311px;
      height: 56px;

      border-bottom: 0.5px solid #e6e6e6;
      .img {
        width: 16px;
        height: 16px;
      }
      &:last-child {
        border-bottom: none;
      }
    }

    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 375px;
      min-height: 88px;
      padding: 8px;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      border-radius: 24px 24px 0 0;
      background: rgba($color: $white, $alpha: 0.8);
      backdrop-filter: blur(10px);
    }
  }
}
</style>
