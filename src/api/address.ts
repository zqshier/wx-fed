import { get, post, put, del } from '@/utils/http';
import { IAddressesParams } from '@/dto/address';

enum Api {
  userAddresses = '/api/user-addresses',
}

export function userAddressesApi(data: IAddressesParams): Promise<any> {
  return post({ url: Api.userAddresses, data });
}

export function userAddressesGetApi(): Promise<any> {
  return get({ url: Api.userAddresses });
}

export function userAddressesInfoApi(id: number): Promise<any> {
  return get({ url: `${Api.userAddresses}/${id}` });
}

export function updateUserAddressesApi(id: number, data: IAddressesParams): Promise<any> {
  return put({ url: `${Api.userAddresses}/${id}`, data });
}

export function deleteUserAddressesApi(id: number): Promise<any> {
  return del({ url: `${Api.userAddresses}/${id}` });
}
