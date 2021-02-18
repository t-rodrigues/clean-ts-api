import { Validation } from '@/presentation/contracts';

export class ValidationSpy implements Validation {
  validate(input: any): Error | null {
    return null;
  }
}
