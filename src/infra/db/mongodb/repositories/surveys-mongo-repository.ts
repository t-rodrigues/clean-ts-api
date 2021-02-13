import { AddSurveyRepository } from '@application/contracts';
import { DbAddSurveyDTO } from '@application/dtos';
import { MongoHelper } from '../mongo-helper';

export class SurveysMongoRepository implements AddSurveyRepository {
  async add(addSurveyData: DbAddSurveyDTO): Promise<void> {
    const surveysCollection = await MongoHelper.getCollection('surveys');
    await surveysCollection.insertOne(addSurveyData);
  }
}
