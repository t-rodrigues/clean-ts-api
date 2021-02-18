import { AddSurveyParams } from '@/domain/usecases';

export interface AddSurveyRepository {
  add(addSurveyDTO: AddSurveyParams): Promise<void>;
}
