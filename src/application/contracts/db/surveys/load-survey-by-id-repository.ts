import { Survey } from '@/domain/entities';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<Survey | null>;
}
