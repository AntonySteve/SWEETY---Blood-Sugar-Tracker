function pad(n) {
  return String(n).padStart(2, '0');
}

// Today's date as YYYY-MM-DD (server local time)
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// True if the string is a real calendar date in YYYY-MM-DD format
function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// 1st of the month up to the selected date
function monthToDateRange(s) {
  const [y, m] = s.split('-');
  return { from: `${y}-${m}-01`, to: s };
}

// The whole month before the selected date's month
function previousMonthRange(s) {
  const [y, m] = s.split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 2, 1));
  const last = new Date(Date.UTC(y, m - 1, 0));
  return {
    from: first.toISOString().slice(0, 10),
    to: last.toISOString().slice(0, 10),
  };
}

module.exports = { todayStr, isValidDate, monthToDateRange, previousMonthRange };
