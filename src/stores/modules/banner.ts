import { getBanners as getBannersApi } from '@/api/deco';
import { IBanner } from '@/dto/banner';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface IBannerMap {
  [key: string]: IBanner[];
}

// 首页用到的Banner配置
const homeBannerGroups = ['home-top', 'jingangqu', 'shouyetanchuang'];

export const useBannerStore = defineStore('banner-store', () => {
  const cachedMap = ref<IBannerMap>({});
  const getBanners = computed(
    () =>
      (group: string, num = 6) =>
        (cachedMap.value[group] || []).slice(0, num),
  );
  const homeBannersLoaded = computed(() => {
    for (const key of homeBannerGroups) {
      if (cachedMap.value[key]) return true;
    }
    return false;
  });

  const _promises = new Map<string, Promise<{ list: IBanner[] }>>();
  async function load(...groups: string[]) {
    const key = groups.join(',');
    if (!_promises.has(key)) {
      _promises.set(key, getBannersApi(groups));
    }

    try {
      const { list } = await _promises.get(key)!;
      const tmpMap: IBannerMap = {};
      for (const b of list) {
        if (!tmpMap[b.group]) tmpMap[b.group] = [];
        tmpMap[b.group].push(b);
      }
      for (const g of groups) {
        delete cachedMap.value[g];
      }
      Object.assign(cachedMap.value, tmpMap);
    } catch (e) {
      console.error(e);
    }

    _promises.delete(key);
  }

  async function loadHomeBanners() {
    await load(...homeBannerGroups);
  }

  return { homeBannersLoaded, getBanners, load, loadHomeBanners };
});
