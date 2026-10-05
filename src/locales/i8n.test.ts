import { describe, expect, it } from 'vitest';
import { getMessage, validationMessages, ValidationCodes } from './i8n';

describe('standalone validation messages', () => {
  it('provides every backend validation code in all three languages', () => {
    for (const messages of Object.values(validationMessages)) {
      expect(Object.keys(messages).sort()).toEqual(Object.values(ValidationCodes).sort());
    }
  });
  it('defaults to Vietnamese and supports the existing vi locale alias', () => {
    expect(getMessage('VAL_001', { field: 'Họ tên' })).toBe('Họ tên là thông tin bắt buộc.');
    expect(getMessage('VAL_001', { field: 'Họ tên' }, 'vi')).toBe(getMessage('VAL_001', { field: 'Họ tên' }, 'vn'));
  });
  it('interpolates multiple parameters in English and French', () => {
    expect(getMessage(ValidationCodes.RangeLength, { field: 'Password', min: 8, max: 32 }, 'en'))
      .toBe('Password must contain between 8 and 32 characters.');
    expect(getMessage('VAL_011', { field: 'Code', length: 6 }, 'fr'))
      .toBe('Le champ Code doit contenir exactement 6 caractères.');
  });
  it('keeps zero and inserts values literally without recursive replacement', () => {
    expect(getMessage('VAL_013', { field: '{max} $&', max: 0 }, 'en'))
      .toBe('{max} $& must not exceed 0 characters.');
  });
  it('retains missing placeholders and safely returns unknown codes', () => {
    expect(getMessage('VAL_001', { field: null }, 'en')).toBe('{field} is required.');
    expect(getMessage('UNKNOWN')).toBe('UNKNOWN');
    expect(getMessage('toString')).toBe('toString');
    expect(getMessage('VAL_001', Object.create({ field: 'inherited' }), 'en')).toBe('{field} is required.');
  });
});
