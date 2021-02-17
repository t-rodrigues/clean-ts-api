import { Survey } from '@/domain/entities';

export interface LoadSurveysRepository {
  loadAll(): Promise<Survey[]>;
}
