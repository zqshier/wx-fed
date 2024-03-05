import { createPinia } from 'pinia';
import { App } from 'vue';
export * from './key';
export { useAddressStore } from './modules/address';
export { useAfterSalesStore } from './modules/aftersales';
export { getToken, useAppStore } from './modules/app';
export { useBannerStore } from './modules/banner';
export { useCartStore } from './modules/cart';
export { useCatalogStore } from './modules/catalog';
export { useCouponStore } from './modules/coupon';
export { useDailyStore } from './modules/daily';
export { useDocumentStore } from './modules/document';
export { useDtemplateStore } from './modules/dtemplate';
export { useGoodsStore } from './modules/goods';
export { useInvitePostStore } from './modules/invitePost';
export { useMedailStore } from './modules/medail';
export { useMissionsStore } from './modules/missions';
export { useOrderStore } from './modules/order';
export { usePointStore } from './modules/point';
export { usePointsGoodStore } from './modules/pointsGoods';
export { useReversibleStore } from './modules/reversible';
export { useSettleStore } from './modules/settle';
export { useSigninStore } from './modules/signin';
export { useUserStore } from './modules/user';

export const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}
