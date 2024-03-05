import { post } from '@/utils/http/old_client';

// 登录
// export function oldLoginApi(data: { code: string }): Promise<any> {
//   return post({ url: '/interface/data.aspx?action=login', data: { ...data, platform: 'wxmp' } });
// }

// 初始化会员数据
// export const inintmembersApi = (): Promise<any> => post({ url: '/interface/data.aspx?action=inintmembers' });

// 注册
// export function registerApi(data: { mobile: string; code: string }): Promise<any> {
//   return post({ url: '/interface/data.aspx?action=register', data });
// }

// 修改会员信息
// export const updatememberApi = async (data: UpdateUserParams) =>
//   post<UpdateUserParams>({ url: '/interface/data.aspx?action=updatemember', data });

// 发送短信
// export const sendsmsApi = (data: { mobile: string; imgcode: string }) =>
//   post({ url: '/interface/data.aspx?action=sendsms', data });

// 系统消息
export const sysMessageApi = () => post({ url: '/interface/data.aspx?action=sysmessage' });

// 每日签到页面数据
// export const initTaskApi = () => post({ url: '/interface/data.aspx?action=ininttask' });

// 签到
// export const signinApi = (data: { daykey: string }) => post({ url: '/interface/data.aspx?action=signin', data });

// 做任务、领积分
// export const dotaskApi = (data: { taskid: number; acttype: number }) =>
//   post({ url: '/interface/data.aspx?action=dotask', data });

// 代码监测
// export const trackApi = (data: any) => get({ url: '/interface/api.aspx', params: data });

// 首页弹窗是否显示
// export const isshowApi = () => get({ url: '/interface/api.aspx?action=isshow' });

// 意见与建议
export const suggestApi = (data: { picurl: string; info: string }) =>
  post({ url: '/interface/data.aspx?action=suggest', data });

// 礼品列表
// export const pointGoodsListApi = () => post({ url: '/interface/data.aspx?action=productlist' });

// 礼品详情
// export const pointGoodsdetailsApi = async (goodsId: string) =>
//   post({ url: '/interface/data.aspx?action=productdetails', data: { dguid: goodsId } });

// 礼品兑换
// export const pointGoodsExchangeApi = async (goodsId: string) =>
//   post({ url: '/gift/exchange', data: { dguid: goodsId }, baseURL: process.env.API_JAVA_HOST });

//兑换订单查询
export const pointGoodsExchangeListApi = async () =>
  post({ url: '/gift/exchangeList', data: {}, baseURL: process.env.API_JAVA_HOST });

// 产品验真
// export const getCipherApi = async (cipher: string) =>
//   post({
//     url: '/zippo/getCipher',
//     data: { cipher },
//     baseURL: process.env.API_JAVA_HOST,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8',
//     },
//   });

// 完善信息
// export const getQrCompleteInfoApi = (data: IQrCompleteInfoParams) =>
//   post({
//     url: '/zippo/qrCompleteInfo',
//     data,
//     baseURL: process.env.API_JAVA_HOST,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8',
//     },
//   });

export const uploadpicApi = async (data: { pic: string }) =>
  post({ url: '/interface/data.aspx?action=uploadpic', data });

// 积分明细
// export const getScorelistApi = () => post({ url: '/interface/data.aspx?action=scorelist' });
