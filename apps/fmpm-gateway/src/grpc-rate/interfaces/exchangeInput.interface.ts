export interface IExchangeRates {
  baseRate: string;
}

export interface IExchangeRate {
  base: string;
  target: string;
}

export interface IExchangeAmount extends IExchangeRate {
  amount: number;
}
