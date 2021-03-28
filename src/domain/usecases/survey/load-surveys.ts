import { Survey } from '@/domain/entities';

export interface LoadSurveys {
  load(accountId: string): Promise<Survey[]>;
}
