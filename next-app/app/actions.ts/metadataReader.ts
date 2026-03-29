"use server";

import { getSemanticModel } from "@/src/lib/metadata";

export async function testMetadataLoad(): Promise<any> {
  try {
    const res = await getSemanticModel();
    return JSON.parse(JSON.stringify(res));
  } catch (err) {
    throw new Error("Database connection failed :" + err);
  }
}
