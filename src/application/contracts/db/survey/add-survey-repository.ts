import { AddSurveyDTO } from '@/domain/usecases';

export interface AddSurveyRepository {
  add(addSurveyDTO: AddSurveyDTO): Promise<void>;
}
