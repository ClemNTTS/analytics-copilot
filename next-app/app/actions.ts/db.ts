"use server";

import { pool } from "@/src/lib/pool_db";

export async function pingTestDB(): Promise<any> {
  try {
    const res = await pool.query("SELECT NOW()");
    return res.rows[0];
  } catch (err) {
    throw new Error("Database connection failed :" + err);
  }
}
