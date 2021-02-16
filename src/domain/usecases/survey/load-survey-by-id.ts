import { Survey } from '@/domain/entities';

export interface LoadSurveyById {
  loadById(id: string): Promise<Survey | null>;
}
