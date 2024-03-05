import {
  GoodsDetailInfo,
  GoodsListParams,
  GoodsSearchParams,
  IFavoritesParams,
  IGoodsArriveParams,
  IRatingInfoParams,
  IRatingSubmitParams,
} from '@/dto/goods';
import { IRecommendListParam, IRecommendListRes } from '@/dto/recommend';
import { get, post } from '@/utils/http';

enum Api {
  goodsList = '/api/goods/list',
  goodsSearch = '/api/goods/search',
  goods = '/api/goods',
  goodsCatalogs = '/api/catalogs',
  bookings = '/api/bookings',
  favorites = '/api/favorites',
  ratingInfo = '/api/item-rating/info',
  ratingSubmit = '/api/item-rating/submit',
  subscriptions = '/api/goods/subscriptions',
  recommend = '/api/goods-recommend/info',
  recommendList = '/api/goods-recommend/list',
}

export function goodsListApi(data: GoodsListParams): Promise<any> {
  return get({ url: Api.goodsList, params: data });
}

// export function goodsSearchApi(data: GoodsSearchParams): Promise<any> {
//   return get({ url: Api.goodsSearch, params: data });
// }

export function goodsSearchApi(data: GoodsSearchParams): Promise<any> {
  return post({ url: Api.goodsSearch, data });
}

export function goodsApi(id: number): Promise<any> {
  return get({ url: `${Api.goods}/${id}`, params: { id } });
}

export function goodsDetailApi(id: number): Promise<GoodsDetailInfo[]> {
  return get({ url: `${Api.goods}/${id}/details`, params: { id } });
}

export function goodsCatalogsApi(): Promise<any> {
  return get({ url: Api.goodsCatalogs });
}

export function goodsBookings(id: number, subscribed: boolean): Promise<any> {
  return post({ url: `${Api.bookings}/${id}`, data: { subscribed } });
}

export function goodsFavorites(data: IFavoritesParams): Promise<any> {
  return post({ url: Api.favorites, data });
}

export function goodsFavoritesList(data): Promise<any> {
  return get({ url: Api.favorites, params: data });
}

export function ratingInfoApi(data: IRatingInfoParams): Promise<any> {
  return get({ url: Api.ratingInfo, params: data });
}

// export function ratingSubmitApi(data: IRatingSubmitParams): Promise<any> {
//   return post({ url: Api.ratingSubmit,  data });
// }
export function ratingSubmitApi(data: IRatingSubmitParams): Promise<any> {
  return post({ url: Api.ratingSubmit, data });
}

export function goodsArrive(data: IGoodsArriveParams): Promise<any> {
  return post({ url: Api.subscriptions, data });
}

export function getRecommend(id: number): Promise<IRecommendListRes> {
  return get({ url: `${Api.recommend}/${id}` });
}

export function getRecommendList(data: IRecommendListParam): Promise<any> {
  return get({ url: Api.recommendList, params: data });
}
