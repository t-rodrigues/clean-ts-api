import { AddSurvey, AddSurveyDTO } from '@domain/usecases/survey';
import { MongoHelper } from '../mongo-helper';

export class SurveysMongoRepository implements AddSurvey {
  async add(addSurveyData: AddSurveyDTO): Promise<void> {
    const surveysCollection = await MongoHelper.getCollection('surveys');
    await surveysCollection.insertOne(addSurveyData);
  }
}
