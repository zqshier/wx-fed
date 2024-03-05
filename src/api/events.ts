import { post } from '@/utils/http';
import { IEventsParams } from '@/dto/events';

enum Api {
  events = '/ana/events',
}

export const getEventsApi = async (events: IEventsParams[]) => post<any>({ url: `${Api.events}`, data: { events } });
