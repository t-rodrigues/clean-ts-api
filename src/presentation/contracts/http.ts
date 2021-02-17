export type HttpRequest = {
  body?: any;
  headers?: any;
  params?: any;
  accountId?: string;
};

export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};
