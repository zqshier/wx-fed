export enum IMemberRightsType {
  once = 'once',
  daily = 'daily',
}

export interface IMemberRights {
  code: string;
  name: string;
  image: string;
  desc: string;
  buttonText: string;
  path: string;
  remind: boolean;
  remindAt?: Date[];
  remindType?: IMemberRightsType;
}

export interface IMemberRightsList {
  name: string;
  rights: IMemberRights[];
}
