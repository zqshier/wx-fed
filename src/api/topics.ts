import { get } from '@/utils/http';
import { ITopicGroup } from '@/dto/topic';

enum Api {
  /** 专题组 */
  group = '/api/topics/groups/',
}

export const getTopicGroup = async (code: string) => get<ITopicGroup>({ url: `${Api.group}${code}` });
