// server.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const express = require('express');
const cors = require('cors'); // CORS санг дуудах
const app = express();

app.use(cors()); // Бүх гаднах холболтыг зөвшөөрөх
app.use(express.json());

// ... бусад кодууд


const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CSS312',
  password: '123',
  port: 5433,
});

// CREATE TABLE
pool.query(`
  CREATE TABLE IF NOT EXISTS finance_records (
    id SERIAL PRIMARY KEY,
    card_name VARCHAR(100) NOT NULL,
    card_number VARCHAR(20) NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0,
    credit_limit NUMERIC(12, 2) DEFAULT 1000,
    used_credit NUMERIC(12, 2) DEFAULT 0,
    expiry VARCHAR(10),
    notify_services BOOLEAN DEFAULT false,
    category VARCHAR(100),
    category_amount NUMERIC(12, 2) DEFAULT 0,
    category_percent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
  )
`, (err) => {
  if (err) console.error('Table creation error:', err);
  else console.log('Table ready.');
});

// CREATE - POST /finance
app.post('/finance', async (req, res) => {
  const {
    card_name, card_number, balance, credit_limit,
    used_credit, expiry, notify_services,
    category, category_amount, category_percent
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO finance_records 
        (card_name, card_number, balance, credit_limit, used_credit, expiry, notify_services, category, category_amount, category_percent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [card_name, card_number, balance, credit_limit, used_credit, expiry, notify_services, category, category_amount, category_percent]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL - GET /finance
app.get('/transactions', async (req, res) => {
    try {
        const allEntries = await pool.query("SELECT * FROM transactions");
        res.json(allEntries.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Серверийн алдаа");
    }
});

// READ ONE - GET /finance/:id
app.get('/finance/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance_records WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - PUT /finance/:id
app.put('/finance/:id', async (req, res) => {
  const {
    card_name, card_number, balance, credit_limit,
    used_credit, expiry, notify_services,
    category, category_amount, category_percent
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE finance_records SET
        card_name=$1, card_number=$2, balance=$3, credit_limit=$4,
        used_credit=$5, expiry=$6, notify_services=$7,
        category=$8, category_amount=$9, category_percent=$10
       WHERE id=$11 RETURNING *`,
      [card_name, card_number, balance, credit_limit, used_credit, expiry, notify_services, category, category_amount, category_percent, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - DELETE /finance/:id
app.delete('/finance/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM finance_records WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully', record: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
