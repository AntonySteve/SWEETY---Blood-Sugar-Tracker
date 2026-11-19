const bcrypt = require('bcryptjs');
const pool = require('./db');
const { todayStr } = require('./utils/dates');

const SLOTS = ['morning', 'after_breakfast', 'after_lunch', 'after_dinner'];
const BASE = { morning: 100, after_breakfast: 150, after_lunch: 140, after_dinner: 145 };

async function main() {
  
  await pool.query("DELETE FROM users WHERE email = 'demo@sweety.com'");

  const hash = await bcrypt.hash('demo1234', 10);
  const user = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ('Demo User', 'demo@sweety.com', $1) RETURNING id",
    [hash]
  );
  const userId = user.rows[0].id;



  const [y, m, d] = todayStr().split('-').map(Number);
  let total = 0;
  for (let i = 0; i < 65; i++) {
    const day = new Date(Date.UTC(y, m - 1, d - i)).toISOString().slice(0, 10);
    const howMany = i % 5 === 4 ? 2 : 4; 
    for (let s = 0; s < howMany; s++) {
      const value = BASE[SLOTS[s]] + Math.floor(Math.random() * 61) - 20; 
      await pool.query(
        'INSERT INTO readings (user_id, reading_date, slot, value) VALUES ($1, $2, $3, $4)',
        [userId, day, SLOTS[s], value]
      );
      total++;
    }
  }

  console.log(`Seeded demo user (demo@sweety.com / demo1234) with ${total} readings.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
