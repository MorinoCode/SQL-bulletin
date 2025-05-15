import {Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
});

// Testa anslutningen när servern startar
pool.connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch(err => console.error("❌ Failed to connect to the database:", err));

  const db = {
  query: (text, params) => pool.query(text, params), // För enkla queries
  getClient: () => pool.connect(),                   // För transaktioner
};

export default db