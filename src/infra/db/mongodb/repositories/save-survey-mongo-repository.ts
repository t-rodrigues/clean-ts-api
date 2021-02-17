import { SaveSurveyResultRepository } from '@/application/contracts';
import { DbSurveyResult, DbSaveSurveyResultDTO } from '@/application/dtos';
import { MongoHelper } from '../mongo-helper';

export class SaveSurveyResultMongoRepository
  implements SaveSurveyResultRepository {
  async save(saveSurveyData: DbSaveSurveyResultDTO): Promise<DbSurveyResult> {
    const surveyResultCollection = await MongoHelper.getCollection('surveys');
    const surveyResult = await surveyResultCollection.findOneAndUpdate(
      {
        surveyId: saveSurveyData.surveyId,
        accountId: saveSurveyData.accountId,
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
