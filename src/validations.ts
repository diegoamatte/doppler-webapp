/* eslint-disable */
const emailRegex =
  /^\s*((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\s*$/i;
/* eslint-enable */
const nameRegex = /^[\u00C0-\u1FFF\u2C00-\uD7FF\w][\u00C0-\u1FFF\u2C00-\uD7FF\w'`\-. ]+$/i;
const accentRegex = /[\u00C0-\u00FF]/i;

export function validateEmail(
  value: string,
  commonErrorKey: true | string = 'validation_messages.error_invalid_email_address',
): true | string | null {
  if (!value) {
    return null;
  }

  if (!emailRegex.test(value)) {
    return commonErrorKey;
  } else if (accentRegex.test(value)) {
    return 'validation_messages.error_has_accents';
  }

  return null;
}

export function validateName(
  value: string,
  commonErrorKey: true | string = 'validation_messages.error_invalid_name',
): true | string | null {
  if (!value || nameRegex.test(value)) {
    return null;
  } else {
    return commonErrorKey;
  }
}

export function validateRequiredField(
  value: any,
  commonErrorKey: true | string = 'validation_messages.error_required_field',
): true | string | null {
  if (value === undefined || value === null || value === '') {
    return commonErrorKey;
  }

  return null;
}

export function validateMinLength(
  value: any,
  minLength: true | number = 2,
  commonErrorKey: true | string = 'validation_messages.error_min_length',
): true | string | null {
  if (!value || value.length >= minLength) {
    return null;
  }

  return commonErrorKey;
}

export function validatePassword(
  value: string,
): { empty: true } | { charLength?: boolean; digit?: boolean; letter?: boolean } | null {
  const digitRegex = /[0-9]/;
  const letterRegex = /[a-zA-Z]/;

  if (!value) {
    return { empty: true };
  }

  const charError = value.length < 8;
  const digitError = !digitRegex.test(value);
  const letterError = !letterRegex.test(value);

  if (charError || digitError || letterError) {
    return { charLength: charError, digit: digitError, letter: letterError };
  }

  return null;
}

export function validateCheckRequired(
  value: any,
  commonErrorKey: true | string = true,
): true | string | null {
  if (!value) {
    return commonErrorKey;
  }

  return null;
}

export function combineValidations(
  ...validateFunctions: [((value: any) => true | string | null) | undefined | false | null]
): (value: any) => true | string | null {
  return (value) => {
    for (let validate of validateFunctions) {
      const result = validate && validate(value);
      if (result) {
        return result;
      }
    }
    return null;
  };
}

export function validateCuit(
  value: string,
  commonErrorKey: true | string = 'validation_messages.error_invalid_cuit',
): true | string | null {
  if (!value) {
    return null;
  }

  const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;

  if (!regexCuit.test(value)) {
    return commonErrorKey;
  }

  var mult = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  var total = 0;
  for (var i = 0; i < mult.length; i++) {
    total += parseInt(value[i]) * mult[i];
  }
  var mod = total % 11;
  var digit = mod === 0 ? 0 : mod === 1 ? 9 : 11 - mod;

  if (digit !== parseInt(value[10])) {
    return commonErrorKey;
  }

  return null;
}

export function validateNit(
  value: string,
  commonErrorKey: true | string = 'validation_messages.error_invalid_nit',
) {
  if (!value || value.length > 16) {
    return null;
  }
  // takes in account nits up to 16 characters

  var multiplier = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 51];
  var total = 0;
  var lastElement = value.length - 2;
  for (var i = 0; i < value.length - 1; i++) {
    total += parseInt(value[lastElement - i]) * multiplier[i];
  }
  var mod = total % 11;
  var digit = mod >= 2 ? 11 - mod : mod;

  if (digit !== parseInt(value[value.length - 1])) {
    return commonErrorKey;
  }

  return null;
}
