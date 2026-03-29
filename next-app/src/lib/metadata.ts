import { readFileSync } from "fs";
import path from "path";
import { parse } from "yaml";
import { createLogger } from "./logger";

const logger = createLogger("Metadata");

export async function getSemanticModel(): Promise<any> {
  const filePath = path.join(
    process.cwd(),
    "..",
    "metadata",
    "semantic_model.yaml",
  );

  try {
    const fileContent = readFileSync(filePath, "utf8");
    const parsed = parse(fileContent);
    logger.info("Semantic model loaded successfully", { filePath });
    return parsed;
  } catch (error: any) {
    logger.error("Failed to load semantic model", { filePath, error: error.message });
    throw error;
  }
}
