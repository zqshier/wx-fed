import { IMedalsCom, IMedalsDetail, IMedalsList, IMedalsSubParams } from '@/dto/medail';
import { get, post } from '@/utils/http';

enum Api {
  medalsApi = '/api/medals',
  medalsLogApi = '/api/medals/log',
}

export const medalsDetail = async (id: number) => get<IMedalsDetail>({ url: `${Api.medalsApi}/${id}` });

// 订阅勋章
export const medalsSubscribe = async (id: number, data: IMedalsSubParams) =>
  post({ url: `${Api.medalsApi}/${id}/subscribe`, data });

// 佩戴勋章
export const medalsWear = async (id: number) => post({ url: `${Api.medalsApi}/${id}/select` });

// 勋章列表
export const medalsList = async () => get<IMedalsList>({ url: `${Api.medalsApi}` });

// 完成前端勋章条件
export const medalsCom = async (data: IMedalsCom) => post({ url: `${Api.medalsLogApi}`, data });
