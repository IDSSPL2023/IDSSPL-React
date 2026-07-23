export type Validator<V = string> = (value: V) => string | undefined;

export const required = (message = "This field is required"): Validator<string> => (value) =>
  !value || !value.trim() ? message : undefined;

export const pattern = (re: RegExp, message = "Invalid value"): Validator<string> => (value) =>
  value && !re.test(value) ? message : undefined;

export const minLength = (min: number, message = `Must be at least ${min} characters`): Validator<string> => (value) =>
  value && value.trim().length < min ? message : undefined;

export const maxLength = (max: number, message = `Must be at most ${max} characters`): Validator<string> => (value) =>
  value && value.trim().length > max ? message : undefined;

export const compose = <V>(...validators: Validator<V>[]): Validator<V> => (value) => {
  for (const validate of validators) {
    const error = validate(value);
    if (error) return error;
  }
  return undefined;
};

/** Runs a per-field validator map against a values object, returning only the fields with errors. */
export function validateFields<T extends Record<string, unknown>>(
  values: T,
  rules: Partial<{ [K in keyof T]: Validator<T[K]> }>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key in rules) {
    const validate = rules[key];
    if (!validate) continue;
    const error = validate(values[key]);
    if (error) errors[key] = error;
  }
  return errors;
}

export const isFormValid = (errors: Partial<Record<string, string | undefined>>): boolean =>
  Object.values(errors).every((e) => !e);
