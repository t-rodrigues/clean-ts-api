export type HttpRequest = {
  body?: any;
  headers?: any;
  params?: any;
};

export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};
