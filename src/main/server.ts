import { MongoHelper } from '@infra/db/mongodb';
import env from '@main/config/env';

MongoHelper.connect(env.mongoUrl).then(async () => {
  const app = (await import(`./config/app`)).default;
  app.listen(env.port, () =>
    console.log(`server is running at: http://localhost:${env.port}`),
  );
});
