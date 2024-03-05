import { get } from '@/utils/http';
import { IMemberRightsList } from '@/dto/member';

enum Api {
  memberRights = '/api/member-rights',
}

export const getMemberRightsApi = async () => get<{ list: IMemberRightsList[] }>({ url: `${Api.memberRights}` });
