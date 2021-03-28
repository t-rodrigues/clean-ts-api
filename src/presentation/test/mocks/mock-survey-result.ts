import { SurveyResult } from '@/domain/entities';
import {
  LoadSurveyResult,
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '@/domain/usecases';

import { mockSurveyResult } from '@/domain/test/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResult = mockSurveyResult();
  saveSurveyResult: SaveSurveyResultParams;

  async save(data: SaveSurveyResultParams): Promise<SurveyResult> {
    this.saveSurveyResult = data;

    return this.surveyResult;
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResult = mockSurveyResult();
  surveyId: string;
  accountId: string;

  async load(surveyId: string, accountId: string): Promise<SurveyResult> {
    this.surveyId = surveyId;
    this.accountId = accountId;

    return this.surveyResult;
  }
}
