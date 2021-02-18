import { Account } from '@/domain/entities';

export type AddAccountParams = Omit<Account, 'id'>;

export interface AddAccount {
  add(addAccountData: AddAccountParams): Promise<Account>;
}
