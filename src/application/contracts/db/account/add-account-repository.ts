import { Account } from '@/domain/entities';
import { AddAccountParams } from '@/domain/usecases';

export interface AddAccountRepository {
  add(accountData: AddAccountParams): Promise<Account>;
}
