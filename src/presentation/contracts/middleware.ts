import { HttpRequest, HttpResponse } from '@/presentation/contracts';

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
