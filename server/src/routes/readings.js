const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const { SLOTS, validateReading } = require('../utils/validate');

const router = express.Router();
router.use(auth);


async function checkDayRules(userId, date, slot, excludeId) {
  const id = excludeId || 0;

  const count = await pool.query(
    'SELECT COUNT(*) FROM readings WHERE user_id = $1 AND reading_date = $2 AND id <> $3',
    [userId, date, id]
  );
  if (Number(count.rows[0].count) >= 4) return 'You can add only 4 readings per day.';

  const dup = await pool.query(
    'SELECT 1 FROM readings WHERE user_id = $1 AND reading_date = $2 AND slot = $3 AND id <> $4',
    [userId, date, slot, id]
  );
  if (dup.rows.length > 0) {
    const name = SLOTS[slot].replace(' (fasting)', '');
    const article = slot === 'morning' ? 'a' : 'an';
    return `You already have ${article} ${name} reading for this date.`;
  }
  return null;
}

router.get('/', async (req, res) => {
  try {
    const params = [req.userId];
    let sql = 'SELECT id, reading_date, slot, value FROM readings WHERE user_id = $1';
    if (req.query.date) {
      params.push(req.query.date);
      sql += ' AND reading_date = $2';
    }
    sql += ' ORDER BY reading_date DESC, id';
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { date, slot, value } = req.body;
    const error = validateReading({ date, slot, value }) || (await checkDayRules(req.userId, date, slot));
    if (error) return res.status(400).json({ error });

    const result = await pool.query(
      `INSERT INTO readings (user_id, reading_date, slot, value)
       VALUES ($1, $2, $3, $4) RETURNING id, reading_date, slot, value`,
      [req.userId, date, slot, Number(value)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { date, slot, value } = req.body;

    const existing = await pool.query('SELECT id FROM readings WHERE id = $1 AND user_id = $2', [id, req.userId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Reading not found.' });

    const error = validateReading({ date, slot, value }) || (await checkDayRules(req.userId, date, slot, id));
    if (error) return res.status(400).json({ error });

    const result = await pool.query(
      `UPDATE readings SET reading_date = $1, slot = $2, value = $3
       WHERE id = $4 AND user_id = $5 RETURNING id, reading_date, slot, value`,
      [date, slot, Number(value), id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM readings WHERE id = $1 AND user_id = $2', [
      Number(req.params.id),
      req.userId,
    ]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Reading not found.' });
    res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

module.exports = router;
