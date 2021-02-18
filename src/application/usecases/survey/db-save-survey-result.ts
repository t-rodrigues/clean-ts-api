import { SaveSurveyResultRepository } from '@/application/contracts';
import { SurveyResult } from '@/domain/entities';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
  ) {}

  async save(
    saveSurveyDTO: SaveSurveyResultParams,
  ): Promise<SurveyResult | null> {
    const survey = await this.saveSurveyResultRepository.save(saveSurveyDTO);
    return survey;
  }
}
