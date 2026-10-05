import { describe, expect, it } from 'vitest';
import { maskDateInput, parseMaskedDate } from './dateInput';
describe('date input mask', () => {
  it('formats typing, pasted dates and extra characters', () => {
    expect(maskDateInput('22092026').text).toBe('22/09/2026');
    expect(maskDateInput('22/09/2026').text).toBe('22/09/2026');
    expect(maskDateInput('ab2209202699').text).toBe('22/09/2026');
    expect(maskDateInput('220').text).toBe('22/0');
    expect(maskDateInput('').text).toBe('');
  });
  it('keeps the caret beside the edited digit', () => {
    expect(maskDateInput('22092026', 3)).toEqual({ text: '22/09/2026', caret: 4 });
    expect(maskDateInput('2209/2026', 2).caret).toBe(2);
  });
  it.each(['31/04/2026', '29/02/2025', '00/09/2026', '22/13/2026', '22/09/20', ''])('rejects invalid or partial date %s', value => {
    expect(parseMaskedDate(value)).toBeNull();
  });
  it('accepts leap days without timezone conversion', () => {
    const value = parseMaskedDate('29/02/2024')!;
    expect([value.getFullYear(), value.getMonth(), value.getDate()]).toEqual([2024, 1, 29]);
  });
});
