import { ObjectId } from 'mongodb';
import {
  AddSurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/application/contracts';
import { DbAddSurveyParams, DbSurvey } from '@/application/dtos';

import { MongoHelper } from '../mongo-helper';
import { QueryBuilder } from '../query-builder';

export class SurveysMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysRepository,
    LoadSurveyByIdRepository {
  async add(addSurveyData: DbAddSurveyParams): Promise<void> {
    const surveysCollection = await MongoHelper.getCollection('surveys');

    await surveysCollection.insertOne(addSurveyData);
  }

  async loadAll(accountId: string): Promise<DbSurvey[]> {
    const surveysCollection = await MongoHelper.getCollection('surveys');

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)],
                  },
                },
              },
            },
            1,
          ],
        },
      })
      .build();

    const surveys = await surveysCollection.aggregate(query).toArray();

    return surveys && MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<DbSurvey> {
    const surveysCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) });

    return survey && MongoHelper.map(survey);
  }
}
