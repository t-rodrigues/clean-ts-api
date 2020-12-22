import { MongoHelper as sut } from './mongo-helper';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('should reconnect if mongodb is down', async () => {
    let accountsCollenction = await sut.getCollection('accounts');
    expect(accountsCollenction).toBeTruthy();

    await sut.disconnect();

    accountsCollenction = await sut.getCollection('accounts');
    expect(accountsCollenction).toBeTruthy();
  });
});
