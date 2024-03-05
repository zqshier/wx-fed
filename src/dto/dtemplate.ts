export interface IDeliverTemplate {
  name: string;
  threshold: number;
  valuationType: number;
  valuationRules: {
    regions: string[];
    firstFee: number;
    firstAmount: number;
    additionalFee: number;
    additionalAmount: number;
  }[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
