import Taro from '@tarojs/taro';
import { get } from '@/utils/http';

const url = `/api/upload/oss/policy`;

export interface IUploadPolicy {
  host: string;
  expire: number;
  policy: string;
  signature: string;
  accessId: string;
  callback: string;
  dir: string;
  cdn: string;
}

export const getUrl = async () => get<IUploadPolicy>({ url });

export async function uploadFile(filePath: string): Promise<string> {
  const data: IUploadPolicy = await getUrl();
  // const data: IUploadPolicy = await get({ url });
  const key = `${data.dir}/a${Date.now()}`;
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: data.host,
      filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data',
      },
      timeout: 120 * 1000,
      formData: {
        key,
        policy: data.policy,
        OSSAccessKeyId: data.accessId,
        signature: data.signature,
        callback: data.callback,
      },
      success: res => {
        console.log(res.data);
        try {
          const json = JSON.parse(res.data);
          resolve(json.url);
        } catch (err) {
          console.error('上传文件失败', err);
        }
      },
      fail: reject,
    });
  });
}
