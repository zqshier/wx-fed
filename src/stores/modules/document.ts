import { defineStore } from 'pinia';
import LRUCache from 'lru-cache';
import { getDocument } from '@/api/deco';
import { DocumentVo } from '@/dto/document';

interface IDocumentState {
  // cache: LRUCache<string, DocumentVo>;
}

const cache = new LRUCache<string, DocumentVo>({ ttl: 600 * 1000, max: 20 });

export const useDocumentStore = defineStore({
  id: 'document-store',

  state: (): IDocumentState => ({}),

  getters: {},

  actions: {
    async load(code: string) {
      if (cache.has(code)) return cache.get(code);
      const res = await getDocument(code);
      cache.set(res.code, res);
      return res;
    },

    async loadWxoaArticle() {
      const res: DocumentVo = await this.load('wxoa_article');
      if (res?.contents?.length) {
        return res.contents[0].content;
      }
      return '';
    },
  },
});
