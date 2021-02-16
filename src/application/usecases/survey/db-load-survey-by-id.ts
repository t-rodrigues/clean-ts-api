import { LoadSurveyByIdRepository } from '@/application/contracts';
import { Survey } from '@/domain/entities';
import { LoadSurveyById } from '@/domain/usecases';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async loadById(id: string): Promise<Survey | null> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);

    return survey;
  }
}
