const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { isValidDate, todayStr, monthToDateRange, previousMonthRange } = require('../utils/dates');

const router = express.Router();
router.use(auth);

async function getStats(userId, from, to) {
  const result = await pool.query(
    `SELECT MAX(value) AS highest, MIN(value) AS lowest,
            ROUND(AVG(value), 1) AS average, COUNT(*) AS count
     FROM readings
     WHERE user_id = $1 AND reading_date BETWEEN $2 AND $3`,
    [userId, from, to]
  );
  const row = result.rows[0];
  const count = Number(row.count);
  if (count === 0) return { count: 0, highest: null, lowest: null, average: null };
  return {
    count,
    highest: Number(row.highest),
    lowest: Number(row.lowest),
    average: Number(row.average),
  };
}

router.get('/', async (req, res) => {
  try {
    const date = req.query.date || todayStr();
    if (!isValidDate(date)) return res.status(400).json({ error: 'Please choose a valid date.' });

    const mtd = monthToDateRange(date);
    const prev = previousMonthRange(date);

    const dayReadings = await pool.query(
      `SELECT id, reading_date, slot, value FROM readings
       WHERE user_id = $1 AND reading_date = $2 ORDER BY id`,
      [req.userId, date]
    );

    res.json({
      daily: { from: date, to: date, stats: await getStats(req.userId, date, date), readings: dayReadings.rows },
      monthToDate: { ...mtd, stats: await getStats(req.userId, mtd.from, mtd.to) },
      previousMonth: { ...prev, stats: await getStats(req.userId, prev.from, prev.to) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
