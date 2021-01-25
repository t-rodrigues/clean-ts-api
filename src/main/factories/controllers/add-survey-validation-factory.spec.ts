import { Validation } from '@presentation/contracts';
import {
  RequiredFieldValidation,
  ValidationComposite,
} from '@validation/validators';
import { makeAddSurveyValidation } from './add-survey-validation';

jest.mock('@validation/validators/validation-composite');

describe('AddSurveyValidationFactory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeAddSurveyValidation();

    const validations: Validation[] = [];

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
