import { get, post } from '@/utils/http';
import { IDaily, ISigninData, ISigninMonthData } from '@/dto/daily';

enum Api {
  daily = '/api/daily',
  signin = '/api/daily-signin',
}

export const getDailyApi = async () => get<IDaily>({ url: `${Api.daily}` });

// 查询月份签到数据
export const getDailySigninMonthApi = async (params: { month: string }) =>
  get<ISigninMonthData>({ url: `${Api.signin}/month`, params });

// 签到
export const getDailySigninApi = async () => post<ISigninData>({ url: `${Api.signin}` });
