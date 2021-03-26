import { Account } from '@/domain/entities';

export type AddAccountParams = {
  name: string;
  email: string;
  password: string;
};

export interface AddAccount {
  add(accountData: AddAccountParams): Promise<Account>;
}
