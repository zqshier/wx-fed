<template>
  <BackgroundImage>
    <CustomBar title="消息中心" />
    <view
      :class="$style.main"
      class="iphone-end nut-flex-col nut-col-center nut-row-center"
      v-if="noticeList.length > 0"
    >
      <block v-for="item in noticeList" :key="item">
        <view :class="$style.main_item">
          <view :class="$style.time">{{ format(new Date(item.updatedAt), 'yyyy年MM月dd日 HH:mm') }}</view>
          <view
            :class="$style.list"
            class="border-05px-box-16 nut-flex-1 nut-flex-col nut-row-left nut-col-top"
            @tap="gotoPage(item)"
          >
            <view :class="$style.title" class="f_s-16">{{ item.title }}</view>
            <text>{{ item.content }}</text>
          </view>
        </view>
      </block>
    </view>
    <view v-else :class="$style.empty_box" class="nut-flex nut-flex-1 nut-col-top nut-row-center">
      <DefaultPage
        imgWidth="48"
        imgHeight="48"
        imgMbottom="16"
        tip="暂无系统消息"
        :icon="require('@/static/icon/no-msg.png')"
      />
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { sysMessageApi } from '@/api-old';
import { INoticeCenterInfo } from '@/api-old/model/system';
import { handleLink, regroupNoticeCenterList as regrounpList } from '@/utils';
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';

import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';

const noticeList = ref<INoticeCenterInfo[]>([]);

onMounted(() => {
  load();
});

async function load() {
  try {
    const result = await sysMessageApi();
    noticeList.value = regrounpList(result);
  } catch (e) {
    console.error('noticeCenter page load err=', e);
  }
}

function gotoPage(item: INoticeCenterInfo) {
  handleLink(item.type, item.url, item.appid);
}
</script>

<style lang="scss" module>
.main {
  width: 375px;
  padding: 16px;
  &_item {
    .time {
      width: 100%;
      padding-top: 8px;
      text-align: center;
      color: $Tertiary;
      margin-bottom: 16px;
    }
    .list {
      padding: 12px 16px;
      background: $white;
      margin-bottom: 16px;

      .title {
        margin-bottom: 4px;
      }
    }
  }
}
.empty_box {
  padding-top: 176px;
}
</style>
