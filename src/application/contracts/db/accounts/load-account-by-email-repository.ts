import { Account } from '@/domain/entities';

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<Account>;
}
