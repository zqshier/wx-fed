import { IGuideItem } from '@/dto/guide';
import {
  IBirthdayGiftsInfo,
  IMemberLevelUpsInfo,
  INewComerGiftsInfo,
  MemberInfo,
  MemberParams,
  UpdateUserParams,
} from '@/dto/user';
import { get, post, put } from '@/utils/http';
export interface AuthParams {
  code: string;
  fromUser?: string; // 邀请人ID
  scene?: string; // 小程序场景值
}

export interface AuthResp {
  token: string;
}

enum Api {
  Login = '/api/users/auth',
  UpdatePhone = '/api/users/phone',
  registerMember = '/api/users/register_member',
  usersProfile = '/api/users/profile',
  trace = '/api/users/trace',
  newcomerGifts = '/api/users/newcomer-gifts',
  birthdayGifts = '/api/users/birthday-gifts',
  cardsMigrations = '/api/gift-cards/migrations',
  memberLevelUp = '/api/users/member-level-up',
  loginMember = '/api/users/login_member',
}

export function loginApi(data: AuthParams): Promise<{ token: string; sid: string; openId: string; unionId: string }> {
  return post({ url: Api.Login, data: { ...data, platform: 'wxmp' } });
}

export function updatePhoneApi(data: { code: string }): Promise<any> {
  return post({ url: Api.UpdatePhone, data });
}

export function registerMemberApi(data: MemberParams): Promise<MemberInfo> {
  return post({ url: Api.registerMember, data });
}

export function usersProfileApi(): Promise<any> {
  return get({ url: Api.usersProfile });
}

export const updateUsersProfileApi = async (data: UpdateUserParams) =>
  post<UpdateUserParams>({ url: Api.usersProfile, data });

interface IUserTraceData {
  introducer?: string; // 推荐人ID
}

export const userTrace = (data: IUserTraceData) => post<{ guide?: IGuideItem }>({ url: Api.trace, data });

export const newcomerGiftsApi = () => get<{ gifts: INewComerGiftsInfo[] }>({ url: Api.newcomerGifts });

export const birthdayGiftsApi = () => get<{ gifts: IBirthdayGiftsInfo[] }>({ url: Api.birthdayGifts });

export const birthdayGiftsMarkApi = () => put({ url: Api.birthdayGifts });

export const cardsMigrationsApi = () => post({ url: Api.cardsMigrations });

export const memberLevelUpApi = () => get<IMemberLevelUpsInfo>({ url: Api.memberLevelUp });

export const memberLevelUpMarkApi = () => put({ url: Api.memberLevelUp });

// 会员登录
export function loginMemberApi(data: MemberParams): Promise<MemberInfo> {
  return post({ url: Api.loginMember, data });
}
