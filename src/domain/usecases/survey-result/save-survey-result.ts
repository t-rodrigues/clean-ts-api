import { SurveyResult } from '@/domain/entities';

export type SaveSurveyResultParams = Omit<SurveyResult, 'id'>;

export interface SaveSurveyResult {
  save(saveSurveyDTO: SaveSurveyResultParams): Promise<SurveyResult>;
}
