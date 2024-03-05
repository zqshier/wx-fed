import { IAddrParams, IPondInfo, IPrizeInfo, IRecordsInfo, IVerify, Itickets } from '@/dto/prizes';
import { get, post, put } from '@/utils/http';

enum Api {
  lotteries = '/api/lotteries',
  phone = '/api/users/phone',
}

export const getPond = async (code: string, ticket?: string) =>
  get<IPondInfo>({ url: `${Api.lotteries}/${code}?ticket=${ticket}` });

export const luckyDraw = async (lotteryCode: string, position?: number) =>
  post<IPrizeInfo>({ url: `${Api.lotteries}/${lotteryCode}`, data: { code: lotteryCode, position } });

export const getPrizeRecord = async (lotteryCode: string, params) =>
  get<IRecordsInfo>({ url: `${Api.lotteries}/${lotteryCode}/records`, params });

export function fillAddresses(code: string, data: IAddrParams): Promise<any> {
  return post({ url: `${Api.lotteries}/${code}/records/${data.id}/addresses`, data });
}

export function getTickets(code: string): Promise<any> {
  return get<Itickets>({ url: `${Api.lotteries}/${code}/tickets` });
}

export function codeVerification(lotteryCode: string, code: string): Promise<any> {
  return post<IVerify>({ url: `${Api.lotteries}/${lotteryCode}/verification`, data: { code } });
}

export function mandatePhoneApi(data: { code: string }): Promise<any> {
  return put({ url: Api.phone, data });
}
