import { SurveyResult } from '@/domain/entities';

export type SaveSurveyResultParams = {
  surveyId: string;
  accountId: string;
  answer: string;
  date: Date;
};

export interface SaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SurveyResult>;
}
