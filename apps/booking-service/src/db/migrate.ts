import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { pool, db } from './client';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

async function run() {
  const migrationsFolder = resolve(__dirname, '../..', 'migrations');
  await migrate(db, { migrationsFolder });
  await pool.end();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed', err);
  process.exit(1);
});
