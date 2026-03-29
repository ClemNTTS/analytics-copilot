import { Pool } from "pg";
import { createLogger } from "./logger";

const logger = createLogger("DB");

logger.info("Initializing Database Pool");

const connectionString =
  process.env.DATABASE_URL ?? process.env.DB_CONNEXION_STRING;

if (!connectionString) {
  logger.error("FATAL: DATABASE_URL environment variable is not set.");
} else {
  const maskedConnectionString = connectionString.replace(/:([^:]+)@/, ":********@");
  logger.info("Attempting to connect", { connectionString: maskedConnectionString });
}

const globalForPg = global as typeof global & { pool?: Pool };

let pool: Pool;

try {
  pool =
    globalForPg.pool ??
    new Pool({
      connectionString,
    });

  pool
    .query("SELECT NOW()")
    .then((result) =>
      logger.info("Initial test query successful", {
        dbTime: result.rows[0].now,
      }),
    )
    .catch((error) =>
      logger.error("Initial test query FAILED", {
        error: error.message,
        stack: error.stack,
      }),
    );
} catch (error: any) {
  logger.error("FAILED to create new Pool object", {
    error: error.message,
    stack: error.stack,
  });
  pool = new Pool();
}

if (process.env.NODE_ENV !== "production") {
  globalForPg.pool = pool;
}

export { pool };

export async function getDbSchema(): Promise<string> {
  const startTime = Date.now();

  try {
    logger.debug("Fetching schema...");
    const result = await pool.query(`
      SELECT
        table_name,
        column_name,
        data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);

    const schema = result.rows.reduce<Record<string, string[]>>((acc, row) => {
      if (!acc[row.table_name]) {
        acc[row.table_name] = [];
      }

      acc[row.table_name].push(`${row.column_name} ${row.data_type}`);
      return acc;
    }, {});

    logger.info("Schema fetched successfully", {
      durationMs: Date.now() - startTime,
      tableCount: Object.keys(schema).length,
    });

    return Object.entries(schema)
      .map(
        ([table, columns]) => `Table ${table} {\n  ${columns.join(",\n  ")}\n}`,
      )
      .join("\n\n");
  } catch (error: any) {
    logger.error("Error fetching schema", {
      durationMs: Date.now() - startTime,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to fetch database schema: ${error}`);
  }
}
