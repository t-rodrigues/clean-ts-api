import { Account } from '../../entities';

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<Account | null>;
}
