import { get } from '@/utils/http';
enum Api {
  qrcode = '/api/tpms/wx_qrcode',
  wxQrcode = '/api/tpms/wx_qrcode',
}

export function getQrcodeParams(code: string, scene: number): Promise<any> {
  return get({ url: `${Api.qrcode}/${code}?scene=${scene}` });
}
