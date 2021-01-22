import { LogsMongoRepository } from '@infra/db/mongodb';
import { LogControllerDecorator } from '@main/decorators';
import { Controller } from '@presentation/contracts';

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  const logsMongoRepository = new LogsMongoRepository();

  return new LogControllerDecorator(controller, logsMongoRepository);
};
