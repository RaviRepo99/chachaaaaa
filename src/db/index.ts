import {drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {getDatabaseUrl} from '@/lib/env';

// Keep a single postgres client across module reloads (HMR/dev) to avoid
// creating many pooled connections. Also limit the pool size with
// PG_MAX_CONNECTIONS (default: 5) to prevent "too many clients" errors.
const maxConns = Number(
    process.env.PG_MAX_CONNECTIONS || (process.env.NODE_ENV === 'development' ? 1 : 5),
);

const globalForPostgres = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
};

if (!globalForPostgres.postgresClient) {
  globalForPostgres.postgresClient = postgres(getDatabaseUrl(), {
    prepare: false,
    max: maxConns,
    idle_timeout: 20,
  });
}

const client = globalForPostgres.postgresClient;
export const db = drizzle({client});
