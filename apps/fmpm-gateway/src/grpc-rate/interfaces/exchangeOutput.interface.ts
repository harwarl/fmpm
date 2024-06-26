export class IBaseExchangeResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
}

export type ConversionRate = {
  [currencyCode: string]: number;
};

export class IResExchangeRates extends IBaseExchangeResponse {
  conversion_rates: ConversionRate[];
}

export class IResExchangeRate extends IBaseExchangeResponse {
  conversion_rate: number;
}

export class IResExchangeAmount extends IBaseExchangeResponse {
  conversion_rate: number;
  conversion_result: number;
}
