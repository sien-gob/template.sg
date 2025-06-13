export type ErrorName = 'all' | (string & {});

export interface ValidationOptions {
  throwOnError: {
    ruleName: ErrorName;
    stopOnError: boolean;
    throwNew?: boolean;
  };
}

export interface BusinessRuleContext {
  [key: string]: any;
}

export interface BusinessRule<T extends BusinessRuleContext = BusinessRuleContext> {
  isValid(context: T, onError?: (e: ErrorResult) => void): Promise<boolean> | boolean;
  getErrorMessage(): string;
  getName(): string;
}

export type ErrorResult = { ruleName: string; message: string };

export interface ValidationResult {
  isValid: boolean;
  errors: ErrorResult[];
}
