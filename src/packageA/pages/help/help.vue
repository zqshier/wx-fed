<template>
  <view class="container">
    <CustomBar
      v-if="isFullScreen"
      :backIconSlot="true"
      bg-color="transparent"
      :isPlaceholder="false"
      :isNtitleSlot="isHasNtitle"
    >
      <template v-slot:barLeft>
        <CustomNavBack
          :modes="[TYPE_PAGE.BACK, TYPE_PAGE.CUSTOMER]"
          line-color="white"
          icon-color="#fff"
          bg-color="rgba(0, 0, 0, 0.36)"
        />
      </template>
    </CustomBar>
    <CustomBar v-else :title="title" />
    <Document :code="code" :title="title" :image-height="style.imageHeight" :image-mode="style.imageMode" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useShareAppMessage } from '@tarojs/taro';
import { DOCUMENTS } from '@/constants';
import { shareOptions } from '@/utils';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import Document from '@/components/Document/Document.vue';
import CustomNavBack, { TYPE_PAGE } from '@/components/CustomNavBack/CustomNavBack.vue';

const router = useRouter();
const title = ref(router.params.title);
const code = ref(router.params.code || '');

// 是否需要全屏显示
const isFullScreen = computed(
  (): boolean => code.value === DOCUMENTS.REMENHUODONG.code || code.value === DOCUMENTS.FULI.code,
);

// 全屏显示下logo颜色
// const logoColor = computed((): LogoColorType => {
//   let color = LogoColorType.WHITE;
//   return color;
// });

// 是否需要导航栏自定义内容
const isHasNtitle = computed((): boolean => code.value === DOCUMENTS.REMENHUODONG.code);

const style = computed(() => {
  const obj = {
    imageHeight: {},
    imageMode: '',
  };

  if (code.value === DOCUMENTS.FULI.code) {
    obj.imageHeight = { height: `100vh` };
    obj.imageMode = 'aspectFill';
  }

  return obj;
});

useShareAppMessage(() => {
  const params = { title: title.value, code: code.value };
  const shareReturn = shareOptions({ page: '/packageA/pages/help/help', params });
  console.debug('help page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});
</script>

<style lang="scss"></style>
