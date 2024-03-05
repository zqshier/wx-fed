export interface IAddressesParams {
  default: boolean;
  name: string;
  phone: string;
  code: string;
  town?: string;
  address: string;
  zipcode: string;
}

export interface IAddressesInfo {
  id: number;
  default: boolean;
  region: string;
  name: string;
  phone: string;
  code: string;
  town: string;
  address: string;
  zipcode: string;
  province: string;
  city: string;
  district: string;
}

export interface IAddressesResult {
  list: IAddressesInfo[];
}

export interface AddressInfo {
  id?: string;
  code: string;
  province: string;
  name: string;
  city?: string;
  area?: string;
  children?: AddressInfo[];
}

export interface IAddressInfo {
  codes: string[];
  texts: string[];
}
