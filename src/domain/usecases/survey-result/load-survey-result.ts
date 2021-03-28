import { SurveyResult } from '@/domain/entities';

export interface LoadSurveyResult {
  load(surveyId: string, accountId: string): Promise<SurveyResult>;
}
