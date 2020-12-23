import { Validation } from '@/presentation/contracts';
import { InvalidParamError } from '@/presentation/errors';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldtoCompareName: string,
  ) {}

  validate(input: any): Error | null {
    if (!input[this.fieldName] !== !input[this.fieldtoCompareName]) {
      return new InvalidParamError(this.fieldName);
    }
    return null;
  }
}
