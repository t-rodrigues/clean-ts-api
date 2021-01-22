import { MongoHelper } from '@infra/db/mongodb';
import { Collection } from 'mongodb';
import { LogsMongoRepository } from './logs-mongo-repository';

const makeSut = (): LogsMongoRepository => {
  return new LogsMongoRepository();
};

describe('LogsMongoRepository', async () => {
  let logErrorCollection: Collection;

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

  it('should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError('any_stack');
    const count = await logErrorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
