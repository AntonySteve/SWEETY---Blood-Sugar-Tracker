const { isValidDate, monthToDateRange, previousMonthRange } = require('../src/utils/dates');

test('isValidDate', () => {
  expect(isValidDate('2026-10-15')).toBe(true);
  expect(isValidDate('2026-02-30')).toBe(false);
  expect(isValidDate('15-10-2026')).toBe(false);
});

test('month-to-date range', () => {
  expect(monthToDateRange('2026-10-15')).toEqual({ from: '2026-10-01', to: '2026-10-15' });
});

test('previous month range', () => {
  expect(previousMonthRange('2026-10-15')).toEqual({ from: '2026-09-01', to: '2026-09-30' });
  expect(previousMonthRange('2026-01-10')).toEqual({ from: '2025-12-01', to: '2025-12-31' });
  expect(previousMonthRange('2026-03-05')).toEqual({ from: '2026-02-01', to: '2026-02-28' });
});
