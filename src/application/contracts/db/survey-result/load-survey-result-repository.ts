import { SurveyResult } from '@/domain/entities';

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string): Promise<SurveyResult>;
}
