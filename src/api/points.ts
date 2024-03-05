import {
  IPointGoodsExchangeInfo,
  IPointsConfigs,
  IPointsGoodsInfo,
  IPointsGoodsList,
  IPointsList,
  IPointsListParams,
  IPointsParams,
} from '@/dto/point';
import { get } from '@/utils/http';

enum Api {
  // usersPoints = '/interface/data.aspx?action=scorelist',
  usersPoints = '/api/users/points',
  /** 积分活动商品列表 */
  pointList = '/api/promotions/point-mall/list',
  /** 获取分组配置 */
  configs = '/api/promotions/point-mall/configs',
  /** 积分兑换物品详情页 */
  detail = '/api/promotions/point-mall/detail',
  /** 积分活动用户兑换列表 */
  exchangeList = '/api/promotions/point-mall/exchange/list',
}

export const getUsersPoints = async (data?: IPointsParams) =>
  get<IPointsList>({ url: `${Api.usersPoints}`, params: data || {} });

export const getPointList = async (data: IPointsListParams) =>
  get<IPointsGoodsList>({ url: `${Api.pointList}`, params: data });

export const getConfigs = async () => get<IPointsConfigs>({ url: `${Api.configs}` });

export const getInfo = async (promotionId: string) =>
  get<IPointsGoodsInfo>({ url: `${Api.detail}`, params: { promotionId } });

export const getExchangeList = async (data: IPointsListParams) =>
  get<IPointGoodsExchangeInfo>({ url: `${Api.exchangeList}`, params: data || {} });
