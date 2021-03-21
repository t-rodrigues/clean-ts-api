import { SurveyResult } from '@/domain/entities';
import {
  LoadSurveyResult,
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '@/domain/usecases';

import { mockSurveyResult } from '@/domain/test/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  async save(data: SaveSurveyResultParams): Promise<SurveyResult> {
    return mockSurveyResult();
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  async load(surveyId: string): Promise<SurveyResult> {
    return mockSurveyResult();
  }
}
