import { Account } from '@domain/entities';

export type AddAccountDTO = {
  name: string;
  email: string;
  password: string;
};

export interface AddAccount {
  add(addAccountData: AddAccountDTO): Promise<Account>;
}
