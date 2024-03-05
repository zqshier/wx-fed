import { get, post, put } from '@/utils/http';
import { IAddCartParams, ISelectCartParams, IUpdateItemCountParams, ICartInfo, IUpdateSkuParams } from '@/dto/cart';

enum Api {
  /** 专题组 */
  addItem = '/api/cart/addItem',
  info = '/api/cart/info',
  select = '/api/cart/select',
  removeItems = '/api/cart/removeItems',
  updateItemCount = '/api/cart/updateItemCount',
  updateSku = '/api/cart/updateSku',
}

export const getCartInfoApi = async () => get<ICartInfo>({ url: `${Api.info}` });
export const getCartAddItemApi = async (data: IAddCartParams) => post({ url: `${Api.addItem}`, data });
export const getSelectItemsApi = async (data: ISelectCartParams) => post<ICartInfo>({ url: `${Api.select}`, data });
export const getRemoveItemsApi = async (items: number[]) => post({ url: `${Api.removeItems}`, data: { items } });
export const getUpdateItemCountApi = async (data: IUpdateItemCountParams) =>
  put<ICartInfo>({ url: `${Api.updateItemCount}`, data });
export const getUpdateSkuApi = async (data: IUpdateSkuParams) => put<ICartInfo>({ url: `${Api.updateSku}`, data });
