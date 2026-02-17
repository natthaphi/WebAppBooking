const { neon } = require("@netlify/neon");

const sql = neon();
let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  schemaReady = true;
}

module.exports = { sql, ensureSchema };
