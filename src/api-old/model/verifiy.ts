export interface IVerifyCipherQrRecordlist {
  code: string;
  createdAt: Date;
  id: string;
  openid: string;
}
export interface IVerifyCipherInfo {
  completeInfoVisible: number;
  integralRule: {
    num: number;
    type?: 'MINI_PROGRAM_VALID_REAL_COMPLETE_INFO' | 'MINI_PROGRAM_VALID_REAL_COMPLETE_INFO_NON_FIRST';
  };
  memberInfo: {
    availablePoints: number;
  };
  goods: {
    code: string;
    name: string;
    image: string;
  };
  qrRecordlist: IVerifyCipherQrRecordlist[];
}

export interface IQrCompleteInfoParams {
  recordId: string;
  memberBirthday: string;
  memberGender: string;
  buyPurpose: string;
}
