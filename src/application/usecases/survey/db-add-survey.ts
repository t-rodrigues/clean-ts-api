import { AddSurveyRepository } from '@/application/contracts';
import { AddSurvey, AddSurveyParams } from '@/domain/usecases';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(addSurveyDTO: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(addSurveyDTO);
  }
}
