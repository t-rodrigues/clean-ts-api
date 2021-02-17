import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/contracts';
import { DbAddSurveyDTO, DbSurvey } from '@/application/dtos';
import { MongoHelper } from '../mongo-helper';

export class SurveysMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add(addSurveyData: DbAddSurveyDTO): Promise<void> {
    const surveysCollection = await MongoHelper.getCollection('surveys');

    await surveysCollection.insertOne(addSurveyData);
  }

  async loadAll(): Promise<DbSurvey[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys');

    return surveysCollection.find().toArray();
  }

  async loadById(id: string): Promise<DbSurvey> {
    const surveysCollection = await MongoHelper.getCollection('surveys');

    return surveysCollection.findOne({ _id: id });
  }
}
