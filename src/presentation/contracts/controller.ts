import { HttpRequest, HttpResponse } from '@/presentation/contracts';

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
