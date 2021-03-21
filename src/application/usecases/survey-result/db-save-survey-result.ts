import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/contracts';

import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save({
    accountId,
    surveyId,
    answer,
    date,
  }: SaveSurveyResultParams): Promise<SurveyResult | null> {
    await this.saveSurveyResultRepository.save({
      surveyId,
      accountId,
      answer,
      date,
    });

    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      surveyId,
    );

    return surveyResult;
  }
}
