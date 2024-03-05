export enum LOTTERY_DRAW_ERROR {
  /** 奖品中奖次数上限 */
  LOTTERY_AWARD_EMPTY = 'lottery_award_empty',
}

export const LOTTERY_DRAW_ERROR_TEXT = {
  [LOTTERY_DRAW_ERROR.LOTTERY_AWARD_EMPTY]: '你已获得所有奖品，将奖品留给别人吧',
};
