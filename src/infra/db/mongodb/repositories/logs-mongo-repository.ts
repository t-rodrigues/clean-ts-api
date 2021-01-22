import { LogErrorRepository } from '@application/contracts';
import { MongoHelper } from '../mongo-helper';

export class LogsMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.insertOne({
      stack,
      date: new Date(),
    });
  }
}
