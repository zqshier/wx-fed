import { checkOrderPayState, getOrderChargelApi } from '@/api/order';
import { IWxPayParams } from '@/dto/order';
import Taro from '@tarojs/taro';

/** 请求支付订单 */
export async function requestPayment(orderNo: string): Promise<{ alreadyPaid?: boolean }> {
  let result: IWxPayParams;

  try {
    result = await getOrderChargelApi(orderNo);
  } catch (error) {
    console.error('getOrderChargel error=', error);
    throw error;
  }

  const { paid, ...params } = result;
  if (paid) return { alreadyPaid: paid };

  if (!params.paySign) {
    throw new Error('支付参数错误');
  }

  return new Promise((resolve, reject) => {
    Taro.requestPayment({
      ...(params as any),
      success: res => {
        console.debug('Taro.requestPayment success', res);
        checkOrderPayState(orderNo).catch(() => 0);
        resolve({});
      },
      fail: err => {
        console.debug('Taro.requestPayment fail', err);
        reject(new Error(err.errMsg));
      },
    });
  });
}
