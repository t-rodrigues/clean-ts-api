export class ServerError extends Error {
  constructor(stack: string) {
    super('Something wrong happend. Please try again later.');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
