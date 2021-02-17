import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/contracts';
import { DbAddSurveyDTO, DbSurvey } from '@/application/dtos';
import { ObjectId } from 'mongodb';
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
    const surveys = await surveysCollection.find().toArray();

    return surveys && MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<DbSurvey> {
    const surveysCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) });

    return survey && MongoHelper.map(survey);
  }
}
