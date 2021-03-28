import { Survey } from '@/domain/entities';

export interface LoadSurveysRepository {
  loadAll(accountId: string): Promise<Survey[]>;
}
