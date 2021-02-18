import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';

import { mockSaveSurveyResult } from '@/domain/test/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  async save(data: SaveSurveyResultParams): Promise<SurveyResult> {
    return mockSaveSurveyResult();
  }
}
