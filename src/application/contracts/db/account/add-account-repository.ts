import { Account } from '@/domain/entities';
import { AddAccountDTO } from '@/domain/usecases';

export interface AddAccountRepository {
  add(accountData: AddAccountDTO): Promise<Account>;
}
