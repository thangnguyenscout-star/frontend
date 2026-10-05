/** Format up to eight digits as dd/mm/yyyy and keep the caret near its digit. */
export function maskDateInput(value: string, caret = value.length) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const text = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean).join('/');
  const digitCount = value.slice(0, caret).replace(/\D/g, '').length;
  let position = 0;
  let count = 0;
  while (position < text.length && count < digitCount) {
    if (/\d/.test(text[position])) count++;
    position++;
  }
  return { text, caret: position };
}

export function parseMaskedDate(value: string): Date | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const [day, month, year] = value.split('/').map(Number);
  if (year < 1) return null;
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date : null;
}
