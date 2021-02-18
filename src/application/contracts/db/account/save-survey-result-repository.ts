import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultParams): Promise<SurveyResult>;
}
