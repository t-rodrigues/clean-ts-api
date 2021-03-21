import { ObjectId } from 'mongodb';

import {
  LoadSurveyResultRepository,
  SaveSurveyResultRepository,
} from '@/application/contracts';
import { DbSaveSurveyResultParams } from '@/application/dtos';
import { SurveyResult } from '@/domain/entities';

import { MongoHelper } from '../mongo-helper';
import { QueryBuilder } from '../query-builder';

export class SurveyResultsMongoRepository
  implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save(saveSurveyData: DbSaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults',
    );
    await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: new ObjectId(saveSurveyData.surveyId),
        accountId: new ObjectId(saveSurveyData.accountId),
      },
      {
        $set: {
          answer: saveSurveyData.answer,
          date: saveSurveyData.date,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async loadBySurveyId(surveyId: string): Promise<SurveyResult> {
    const surveysCollection = await MongoHelper.getCollection('surveys');
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(surveyId),
      })
      .unwind({
        path: '$answers',
      })
      .lookup({
        from: 'surveyResults',
        let: {
          id: '$_id',
          answer: '$answers.answer',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$surveyId', '$$id'] },
                  { $eq: ['$answer', '$$answer'] },
                ],
              },
            },
          },
        ],
        as: 'results',
      })
      .group({
        _id: 0,
        data: { $push: '$$ROOT' },
        total: {
          $sum: { $size: '$results' },
        },
      })
      .unwind({ path: '$data' })
      .addFields({
        count: { $size: '$data.results' },
        percent: {
          $cond: {
            if: { $eq: ['$total', 0] },
            then: 0,
            else: {
              $multiply: [
                { $divide: [{ $size: '$data.results' }, '$total'] },
                100,
              ],
            },
          },
        },
      })
      .sort({ count: -1 })
      .project({
        _id: 0,
        surveyId: '$data._id',
        question: '$data.question',
        date: '$data.date',
        answers: {
          image: '$data.answers.image',
          answer: '$data.answers.answer',
          count: '$count',
          percent: '$percent',
        },
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date',
        },
        answers: {
          $push: '$answers',
        },
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers',
      })
      .build();

    const surveyResult = await surveysCollection.aggregate(query).toArray();

    return surveyResult?.length ? surveyResult[0] : null;
  }
}
