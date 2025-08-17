"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.pool = void 0;
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const config_1 = require("../config");
exports.pool = new pg_1.Pool({ connectionString: config_1.config.databaseUrl });
exports.db = (0, node_postgres_1.drizzle)(exports.pool);
//# sourceMappingURL=client.js.map