import { get, post } from '@/utils/http';
import { IActGoods, IActInfo, IActList, IActSub, ISignUp } from '@/dto/activity';

enum Api {
  /** 活动商品列表 */
  actGoodsList = '/api/promotions/goods_list/',
  /** 活动列表 */
  actList = '/api/activity/list',
  /** 活动详情 */
  actInfo = '/api/activity/info',
  /** 活动报名 */
  actSignUp = '/api/activity/sign-up',
  /** 活动订阅 */
  subscribe = '/api/activity/subscribe-to',
}

export const getActGoods = async data =>
  get<IActGoods>({ url: `${Api.actGoodsList}${data.promotionId}`, params: data });

export const getActList = async data => get<IActList>({ url: `${Api.actList}`, params: data });

export const getActInfo = async data => get<IActInfo>({ url: `${Api.actInfo}`, params: data });

export const signUp = async (data: ISignUp) => post({ url: `${Api.actSignUp}`, data });

export const actSubscribe = async (data: IActSub) => post({ url: `${Api.subscribe}`, data });
