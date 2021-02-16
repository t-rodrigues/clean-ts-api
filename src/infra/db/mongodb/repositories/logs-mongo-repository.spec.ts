import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb';

import { LogsMongoRepository } from './logs-mongo-repository';

const makeSut = (): LogsMongoRepository => {
  return new LogsMongoRepository();
};

let logErrorCollection: Collection;

describe('LogsMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    logErrorCollection = await MongoHelper.getCollection('errors');
    await logErrorCollection.deleteMany({});
  });

  describe('logError()', () => {
    it('should create an error log on success', async () => {
      const sut = makeSut();
      await sut.logError('any_stack');
      const count = await logErrorCollection.countDocuments();

      expect(count).toBe(1);
    });
  });
});
