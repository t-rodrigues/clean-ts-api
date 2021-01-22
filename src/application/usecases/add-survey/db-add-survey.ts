import { AddSurveyRepository } from '@application/contracts';
import { AddSurvey, AddSurveyDTO } from '@domain/usecases/survey';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(addSurveyDTO: AddSurveyDTO): Promise<void> {
    await this.addSurveyRepository.add(addSurveyDTO);
  }
}
