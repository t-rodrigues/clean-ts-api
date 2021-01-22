import { LogErrorRepository } from '@application/contracts';
import { Controller, HttpRequest, HttpResponse } from '@presentation/contracts';

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      console.error(httpResponse.body);
      this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
