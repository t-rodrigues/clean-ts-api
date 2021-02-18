import { Account } from '@/domain/entities';
import { AddAccountParams } from '@/domain/usecases';

export type DbAddAccountParams = AddAccountParams;

export type DbAccount = Account;
