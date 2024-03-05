import { goodsCatalogsApi } from '@/api/goods';
import { ICatalog } from '@/dto/goods';
import { defineStore } from 'pinia';
import { useBannerStore } from './banner';
import { ref } from 'vue';

export const useCatalogStore = defineStore('catalog-store', () => {
  const loaded = ref(false);
  const catalogs = ref<ICatalog[]>([]);

  async function load() {
    if (loaded.value && catalogs.value.length) return catalogs.value;
    const result = await goodsCatalogsApi();
    catalogs.value = (result && result.list) || [];
    if (catalogs.value.length) {
      const ids = catalogs.value.map(o => `cat-banner-${o.id}`);
      useBannerStore().load(...ids);
    }
    loaded.value = true;
    console.debug('catalogs.value', catalogs.value);
    return catalogs.value;
  }

  const findCat = (id: number, list: ICatalog[]) => {
    for (const cat of list) {
      if (cat.id === id) return cat;
      if (cat.children?.length) {
        const o = findCat(id, cat.children);
        if (o) return o;
      }
    }
  };

  const findCatalog = (id: number) => findCat(id, catalogs.value);

  const findCatalogProperties = (id: number) => {
    const catalog = findCatalog(id);
    console.debug('catalogs.findCatalogProperties', catalog);
    return catalog ? catalog.properties : [];
  };

  return { loaded, catalogs, load, findCatalog, findCatalogProperties };
});
