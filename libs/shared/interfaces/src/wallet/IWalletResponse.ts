import { Wallet } from '@fmpm/models';

export interface IWalletResponse {
  error: boolean;
  data: { wallet: Wallet | Wallet[] | null };
  message: string;
}
