import { SaveSurveyResultRepository } from '@/application/contracts';
import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResultParams } from '@/domain/usecases';

import { mockSaveSurveyResult } from '@/domain/test/mocks';

export class SaveSurveyResultRepositorySpy
  implements SaveSurveyResultRepository {
  async save(saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResult> {
    return mockSaveSurveyResult();
  }
}
