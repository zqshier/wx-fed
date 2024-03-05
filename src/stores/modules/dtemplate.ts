import { defineStore } from 'pinia';
import { getDeliverTemplateApi } from '@/api/dtemplate';
import { IDeliverTemplate } from '@/dto/dtemplate';

interface IDtemplateState {
  dTemplateInfo: IDeliverTemplate[];
}

export const useDtemplateStore = defineStore({
  id: 'dtemplate-store',

  state: (): IDtemplateState => ({
    dTemplateInfo: [],
  }),

  getters: {},

  actions: {
    async load() {
      if (this.dTemplateInfo && this.dTemplateInfo.length > 0) return;
      const { list } = await getDeliverTemplateApi();
      this.dTemplateInfo = list || [];
      return list;
    },
  },
});
