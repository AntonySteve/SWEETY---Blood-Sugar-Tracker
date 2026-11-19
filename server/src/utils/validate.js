const { isValidDate, todayStr } = require('./dates');

const SLOTS = {
  morning: 'Morning (fasting)',
  after_breakfast: 'After breakfast',
  after_lunch: 'After lunch',
  after_dinner: 'After dinner',
};

// Checks one reading. Returns an error message, or null if it is fine.
function validateReading({ date, slot, value }) {
  if (value === undefined || value === null || value === '') {
    return 'Please enter a glucose value.';
  }
  const num = Number(value);
  if (!Number.isInteger(num) || num < 40 || num > 600) {
    return 'Value must be between 40 and 600 mg/dl.';
  }
  if (!SLOTS[slot]) {
    return 'Please choose a time slot.';
  }
  if (!isValidDate(date)) {
    return 'Please choose a valid date.';
  }
  if (date > todayStr()) {
    return 'Date cannot be in the future.';
  }
  return null;
}

module.exports = { SLOTS, validateReading };
