import { BussinesRuleException } from '../exceptions';
import { BusinessRule, BusinessRuleContext, ErrorResult, ValidationOptions, ValidationResult } from '../models';

export type SettingValidate = {
  options?: ValidationOptions;
  onError?: (e: ErrorResult) => void;
};

export abstract class BusinessValidator<T extends BusinessRuleContext = BusinessRuleContext> {
  protected rules: BusinessRule<T>[] = [];

  protected addRule(rule: BusinessRule<T>): void {
    this.rules.push(rule);
  }

  private shouldStopOnError(ruleName: string, settings?: SettingValidate): boolean {
    if (!settings?.options?.throwOnError) return false;
    const { stopOnError, ruleName: configuredRuleName } = settings.options.throwOnError;
    return stopOnError === true && (configuredRuleName === 'all' || configuredRuleName === ruleName);
  }

  async validate(context: T, settings?: SettingValidate): Promise<ValidationResult> {
    const errors: ErrorResult[] = [];
    for (const rule of this.rules) {
      const ruleName = rule.getName();
      try {
        const isValid = await rule.isValid(context, settings?.onError);
        if (!isValid) {
          errors.push({ ruleName: ruleName, message: rule.getErrorMessage() });
          if (settings?.options?.throwOnError.throwNew) {
            throw new BussinesRuleException({ code: 'BUSINESS_RULE', path: 'BusinessValidator', message: rule.getErrorMessage() });
          }
          if (this.shouldStopOnError(ruleName, settings)) break;
        }
      } catch (error) {
        errors.push({ ruleName: ruleName, message: error.message });

        if (settings?.options?.throwOnError.throwNew) {
          throw new BussinesRuleException({ code: 'BUSINESS_RULE', path: 'Error', message: rule.getErrorMessage() });
        }
        if (this.shouldStopOnError(ruleName, settings)) break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async validateFast(context: T): Promise<ValidationResult> {
    return this.validate(context, {
      options: {
        throwOnError: { ruleName: 'all', stopOnError: true },
      },
    });
  }

  async validateFastThrow(context: T): Promise<ValidationResult> {
    return this.validate(context, {
      options: {
        throwOnError: { ruleName: 'all', stopOnError: true, throwNew: true },
      },
    });
  }
}
