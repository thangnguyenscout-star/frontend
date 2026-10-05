/** Standalone backend validation messages. Not connected to the current application i18n. */
export const ValidationCodes = {
  Required: 'VAL_001',
  InvalidFormat: 'VAL_002',
  InvalidValue: 'VAL_003',
  InvalidDate: 'VAL_004',
  InvalidDateRange: 'VAL_005',
  InvalidNumber: 'VAL_006',
  InvalidLength: 'VAL_007',
  AlreadyExists: 'VAL_008',
  NotExists: 'VAL_009',
  InvalidStatus: 'VAL_010',
  FixedLength: 'VAL_011',
  MinLength: 'VAL_012',
  MaxLength: 'VAL_013',
  RangeLength: 'VAL_014',
} as const;

export type ValidationCode = (typeof ValidationCodes)[keyof typeof ValidationCodes];
export type MessageLocale = 'en' | 'fr' | 'vn' | 'vi';
export type MessageParams = Readonly<Record<string, string | number | boolean | null | undefined>>;

/**
 * Parameters:
 * - All codes except VAL_005: {field} (a label in the requested language).
 * - VAL_005: {startField}, {endField}.
 * - VAL_011: {length}; VAL_012: {min}; VAL_013: {max}; VAL_014: {min}, {max}.
 */
export const validationMessages = {
  vn: {
    VAL_001: '{field} là thông tin bắt buộc.',
    VAL_002: '{field} không đúng định dạng.',
    VAL_003: 'Giá trị của {field} không hợp lệ.',
    VAL_004: '{field} phải là ngày hợp lệ.',
    VAL_005: '{endField} phải lớn hơn hoặc bằng {startField}.',
    VAL_006: '{field} phải là số hợp lệ.',
    VAL_007: 'Độ dài của {field} không hợp lệ.',
    VAL_008: '{field} đã tồn tại.',
    VAL_009: '{field} không tồn tại.',
    VAL_010: 'Trạng thái của {field} không hợp lệ.',
    VAL_011: '{field} phải có đúng {length} ký tự.',
    VAL_012: '{field} phải có ít nhất {min} ký tự.',
    VAL_013: '{field} không được vượt quá {max} ký tự.',
    VAL_014: '{field} phải có từ {min} đến {max} ký tự.',
  },
  en: {
    VAL_001: '{field} is required.',
    VAL_002: '{field} has an invalid format.',
    VAL_003: 'The value of {field} is invalid.',
    VAL_004: '{field} must be a valid date.',
    VAL_005: '{endField} must be on or after {startField}.',
    VAL_006: '{field} must be a valid number.',
    VAL_007: 'The length of {field} is invalid.',
    VAL_008: '{field} already exists.',
    VAL_009: '{field} does not exist.',
    VAL_010: 'The status of {field} is invalid.',
    VAL_011: '{field} must contain exactly {length} characters.',
    VAL_012: '{field} must contain at least {min} characters.',
    VAL_013: '{field} must not exceed {max} characters.',
    VAL_014: '{field} must contain between {min} and {max} characters.',
  },
  fr: {
    VAL_001: 'Le champ {field} est obligatoire.',
    VAL_002: 'Le format du champ {field} est invalide.',
    VAL_003: 'La valeur du champ {field} est invalide.',
    VAL_004: 'Le champ {field} doit contenir une date valide.',
    VAL_005: '{endField} doit être une date égale ou postérieure à {startField}.',
    VAL_006: 'Le champ {field} doit contenir un nombre valide.',
    VAL_007: 'La longueur du champ {field} est invalide.',
    VAL_008: '{field} existe déjà.',
    VAL_009: "{field} n’existe pas.",
    VAL_010: 'Le statut de {field} est invalide.',
    VAL_011: 'Le champ {field} doit contenir exactement {length} caractères.',
    VAL_012: 'Le champ {field} doit contenir au moins {min} caractères.',
    VAL_013: 'Le champ {field} ne doit pas dépasser {max} caractères.',
    VAL_014: 'Le champ {field} doit contenir entre {min} et {max} caractères.',
  },
} as const satisfies Record<'vn' | 'en' | 'fr', Record<ValidationCode, string>>;

/**
 * Returns plain text. Defaults to Vietnamese; `vi` is an alias for `vn`.
 * Unknown codes are returned unchanged. Missing/null parameters retain their placeholder.
 * Parameter values are inserted literally, without recursive interpolation or HTML rendering.
 *
 * @example getMessage('VAL_001', { field: 'Họ tên' })
 * @example getMessage(ValidationCodes.RangeLength, { field: 'Password', min: 8, max: 32 }, 'en')
 * @example getMessage('VAL_005', { startField: 'Ngày bắt đầu', endField: 'Ngày kết thúc' }, 'vn')
 */
export function getMessage(code: string, params: MessageParams = {}, locale: MessageLocale = 'vn'): string {
  const messages = validationMessages[locale === 'vi' ? 'vn' : locale] ?? validationMessages.vn;
  if (!Object.hasOwn(messages, code)) return code;
  const template = messages[code as ValidationCode];
  return template.replace(/\{(\w+)\}/g, (placeholder: string, name: string) => {
    if (!Object.hasOwn(params, name) || params[name] == null) return placeholder;
    return String(params[name]);
  });
}
