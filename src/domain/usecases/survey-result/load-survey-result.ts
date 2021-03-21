import { SurveyResult } from '@/domain/entities';

export interface LoadSurveyResult {
  save(surveyId: string): Promise<SurveyResult>;
}
