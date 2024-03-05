import { get } from '@/utils/http';
import { IStoresInfo } from '@/dto/stores';

enum Api {
  stores = '/api/stores',
}

export const getStoresListApi = async () => get<{ list: IStoresInfo[]; total: number }>({ url: Api.stores });
