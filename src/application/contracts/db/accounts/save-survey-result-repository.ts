import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultDTO } from '@/domain/usecases';

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultDTO): Promise<SurveyResult>;
}
