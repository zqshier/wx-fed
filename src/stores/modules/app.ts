import Taro from '@tarojs/taro';
import { defineStore } from 'pinia';
import { TOKEN_KEY } from '../key';
import { getDocument } from '@/api/deco';
import { DocumentVo, DocumentContentVo } from '@/dto/document';

const sysInfo = Taro.getSystemInfoSync();

interface AppState {
  sysInfo: Taro.getSystemInfoSync.Result;
  sharePosterData: DocumentContentVo[];
  selected: number;
  showTabbar: boolean;
}

export const useAppStore = defineStore({
  id: 'app-store',
  state: (): AppState => ({
    sysInfo,
    sharePosterData: [],
    selected: 0,
    showTabbar: true,
  }),
  getters: {
    getSelected: state => state.selected,
    getShowTabbar: state => state.showTabbar,
  },

  actions: {
    async getSharePosterData() {
      if (this.sharePosterData.length > 0) return;
      const res: DocumentVo = await getDocument('share_poster');
      this.sharePosterData = res?.contents?.length ? res.contents : [];
    },

    setSelected(index: number) {
      this.selected = index;
    },

    setShowTabbar(flag: boolean) {
      this.showTabbar = flag;
    },
  },
});

export const getToken = (): string | undefined => {
  return Taro.getStorageSync(TOKEN_KEY);
};
