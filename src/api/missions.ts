import { IMissionsList } from '@/dto/missions';
import { get, post } from '@/utils/http';

enum Api {
  missions = '/api/missions',
}

export const getMissionsApi = async () => get<{ list: IMissionsList[] }>({ url: `${Api.missions}` });

export const getMissionsRecordsApi = async data => post({ url: `${Api.missions}/records`, data });

export const getMissionsRewardsApi = async (id: number | string) =>
  post<{ rewardType: string; rewardValue: string }>({ url: `${Api.missions}/${id}/rewards`, data: { id } });
