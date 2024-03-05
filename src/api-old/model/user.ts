export interface UpdateUserParams {
  /** old params */
  openid?: string;
  Nick__c: string; //用户头像
  Gender__c: number; //用户性别, 0 女|1 男|2 未知 ⤵
  // name?: string; //用户姓名
  Birthday__c: string; //用户生日
  Mobile__c: string; //手机号码
  code: string; // 短信验证码
  Province__c: string;
  City__c: string;
  address: string;
}

export interface UserInfo {
  openid: string;
  status: number; //用户状态, 0 正常|1 黑名单|2 注销
  Id: string; //用户加密ID
  Nick__c: string; //用户头像
  ProfilePhoto__c: string; //用户头像
  Gender__c: number; //用户性别, 0 女|1 男|2 未知 ⤵
  RegisterDate1__c: string; //用户创建时间
  Birthday__c: string; //用户生日
  Mobile__c: string; // 手机号
  MemberLevel__c: string; // 会员等级
  AvailablePoints__c: number; // 积分
  Province__c: string;
  City__c: string;
  address: string;
  JoinTime__c: string;
  subscribed: boolean; // 是否关注公众号
}
