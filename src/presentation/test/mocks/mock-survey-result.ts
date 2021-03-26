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

  async load(surveyId: string): Promise<SurveyResult> {
    this.surveyId = surveyId;

    return this.surveyResult;
  }
}
