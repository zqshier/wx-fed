import { DOCUMENTS } from '@/constants';
import { IBanner, LinkType } from '@/dto/banner';
import { DocumentContentVo } from '@/dto/document';
import { Toast } from '@/utils';
import { getQrCodeUrl } from '@/utils/http';
import Taro from '@tarojs/taro';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useDocumentStore } from './document';
import { useUserStore } from './user';

export const useInvitePostStore = defineStore('invitePost-store', () => {
  const qrCodeUrl = ref<string>('');
  const code = ref(DOCUMENTS.YAOQINGHAOYOU.code);
  const contents = ref<DocumentContentVo[]>([]);

  const imgList = computed((): IBanner[] => {
    const banners: IBanner[] = [];
    const banner: IBanner = {
      src: '',
      group: '',
      srcType: 'image',
      link: '',
      linkType: LinkType.none,
      id: 0,
    };

    contents.value.forEach(item => {
      const bannerObj = { ...banner };
      bannerObj.src = item.content;
      banners.push(bannerObj);
    });

    return banners;
  });

  async function getImgList() {
    const doc = await useDocumentStore().load(code.value);
    contents.value = doc?.contents || [];
  }

  async function getQRCode() {
    const params = { uid: useUserStore().getUserInfo?.sid || '' };

    let res;
    try {
      res = await getQrCodeUrl({
        page: 'pages/index/index',
        params,
        isHyaline: 1,
      });
    } catch (error) {
      Toast('网络错误,请重试', 2000, 'none', true, () => {
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      });
    }

    qrCodeUrl.value = res;
  }

  return { qrCodeUrl, imgList, getQRCode, getImgList };
});
