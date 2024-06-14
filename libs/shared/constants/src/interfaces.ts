import { Currency } from '@fmpm/dtos';

export interface IRateAmount {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: Currency;
  target_code: Currency;
  conversion_rate: number;
  conversion_result: number;
}
