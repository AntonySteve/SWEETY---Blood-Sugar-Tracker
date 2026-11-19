const { validateReading } = require('../src/utils/validate');

const good = { date: '2020-01-15', slot: 'morning', value: 100 };

test('accepts a valid reading', () => {
  expect(validateReading(good)).toBeNull();
});

test('value is required', () => {
  expect(validateReading({ ...good, value: '' })).toBe('Please enter a glucose value.');
  expect(validateReading({ ...good, value: undefined })).toBe('Please enter a glucose value.');
});

test('value must be a whole number between 40 and 600', () => {
  const msg = 'Value must be between 40 and 600 mg/dl.';
  expect(validateReading({ ...good, value: 39 })).toBe(msg);
  expect(validateReading({ ...good, value: 601 })).toBe(msg);
  expect(validateReading({ ...good, value: 100.5 })).toBe(msg);
  expect(validateReading({ ...good, value: 'abc' })).toBe(msg);
  expect(validateReading({ ...good, value: 40 })).toBeNull();
  expect(validateReading({ ...good, value: 600 })).toBeNull();
});

test('date cannot be in the future', () => {
  expect(validateReading({ ...good, date: '2999-01-01' })).toBe('Date cannot be in the future.');
});

test('slot must be one of the four slots', () => {
  expect(validateReading({ ...good, slot: 'midnight' })).toBe('Please choose a time slot.');
});
