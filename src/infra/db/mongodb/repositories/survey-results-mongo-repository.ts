import { ObjectId } from 'mongodb';
import { SaveSurveyResultRepository } from '@/application/contracts';
import { DbSurveyResult, DbSaveSurveyResultDTO } from '@/application/dtos';
import { MongoHelper } from '../mongo-helper';

export class SaveSurveyResultMongoRepository
  implements SaveSurveyResultRepository {
  async save(saveSurveyData: DbSaveSurveyResultDTO): Promise<DbSurveyResult> {
    const surveyResultCollection = await MongoHelper.getCollection(
      'surveyResults',
    );
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
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
        returnOriginal: false,
      },
    );
    return surveyResult && MongoHelper.map(surveyResult.value);
  }
}