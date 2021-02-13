import { LoadSurveysRepository } from '@application/contracts';
import { Survey } from '@domain/entities';
import { LoadSurveys } from '@domain/usecases';

export class DbLoadSurveys implements LoadSurveys {
  constructor(private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load(): Promise<Survey[]> {
    const surveys = await this.loadSurveysRepository.loadAll();

    return surveys;
  }
}
