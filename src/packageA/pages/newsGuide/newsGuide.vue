<template>
  <BackgroundImage :class="$style.layout">
    <CustomBar :title="title" />

    <view :class="$style.main">
      <Document
        :code="code"
        :maxWidth="343"
        :imageStyle="{ marginBottom: pxTransform(16), borderRadius: pxTransform(8), overflow: 'hidden' }"
        className="border-05px-box-16"
      />
    </view>
  </BackgroundImage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { pxTransform, useRouter, useShareAppMessage } from '@tarojs/taro';
import CustomBar from '@/components/CustomBar/CustomBar.vue';
import Document from '@/components/Document/Document.vue';
import BackgroundImage from '@/components/BackgroundImage/BackgroundImage.vue';
import { shareOptions } from '@/utils';

const router = useRouter();
const title = ref(router.params.title);
const code = ref(router.params.code);

useShareAppMessage(() => {
  const params = { title: title.value, code: code.value };
  const shareReturn = shareOptions({ page: '/packageA/pages/newsGuide/newsGuide', params });
  console.debug('newsGuide page useShareAppMessage path=', shareReturn.path);
  return shareReturn;
});
</script>

<style lang="scss" module>
.layout {
  .main {
    width: 375px;
    padding: 16px;
  }
}
</style>
