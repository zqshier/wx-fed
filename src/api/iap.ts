import { post, get } from '@/utils/http';

enum Api {
  getCodeApi = '/employee/code',
  submitApi = '/employee/valid',
  query = '/employee/state',
}

interface IEmployee {
  /** 邮箱地址 */
  email: string;
  /** 验证码 */
  code: string;
}

export const getCode = async (email: string) => post({ url: `${Api.getCodeApi}`, data: { email: email } });

export const submit = async (data: IEmployee) => post({ url: `${Api.submitApi}`, data });

/**
 * 查询内购身份
 * result: true 为内购员工
 */
export const query = async () => get<{ result: boolean }>({ url: Api.query });
