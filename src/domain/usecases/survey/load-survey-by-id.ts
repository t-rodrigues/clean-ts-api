import { Survey } from '@/domain/entities';

export interface LoadSurveyById {
  loadById(surveyId: string): Promise<Survey | null>;
}
