import { LogErrorRepository } from '@/application/contracts';

export class LogErrorRepositorySpy implements LogErrorRepository {
  stack: string;

  async logError(stack: string): Promise<void> {
    this.stack = stack;
  }
}
