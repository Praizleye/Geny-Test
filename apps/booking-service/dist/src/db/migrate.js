"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const client_1 = require("./client");
const path_1 = require("path");
async function run() {
    const migrationsFolder = (0, path_1.resolve)(__dirname, '../..', 'migrations');
    await (0, migrator_1.migrate)(client_1.db, { migrationsFolder });
    await client_1.pool.end();
}
run().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Migration failed', err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map