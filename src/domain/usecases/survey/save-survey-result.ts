import { SurveyResult } from '@/domain/entities';

export type SaveSurveyResultDTO = Omit<SurveyResult, 'id'>;

export interface SaveSurveyResult {
  save(surveyId: SaveSurveyResultDTO): Promise<SurveyResult>;
}
