const pool = require('./src/config/database');

const check = async () => {
  try {
    const result = await pool.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'
       ORDER BY table_name`
    );
    console.log('Tables dans ta base :');
    result.rows.forEach(row => console.log(' -', row.table_name));
    process.exit(0);
  } catch (err) {
    console.error('Erreur :', err.message);
    process.exit(1);
  }
};

check();