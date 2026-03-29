import OpenAI from "openai";
import { createLogger } from "./logger";

const logger = createLogger("LLM");
const llmApiKey = process.env.AI_API_KEY ?? process.env.MISTRAL_API_KEY;
const llmBaseUrl = process.env.AI_BASE_URL ?? "https://api.mistral.ai/v1";
const llmModel = process.env.AI_MODEL ?? "mistral-large-latest";

const client = new OpenAI({
  apiKey: llmApiKey,
  baseURL: llmBaseUrl,
});

export async function askLLM(
  prompt: string,
  systemPrompt = "Tu es un assistant analytique expert en donnees.",
): Promise<string> {
  const startTime = Date.now();

  try {
    const response = await client.chat.completions.create({
      model: llmModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    logger.info("LLM Request success", {
      model: llmModel,
      durationMs: Date.now() - startTime,
      promptTokens: response.usage?.prompt_tokens,
      completionTokens: response.usage?.completion_tokens,
    });

    return response.choices[0].message.content || "";
  } catch (error: any) {
    logger.error("LLM Request failed", {
      durationMs: Date.now() - startTime,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

export async function askLLMForSql(prompt: string): Promise<string> {
  return askLLM(
    prompt,
    "Tu es un traducteur de langage naturel vers SQL. Reponds uniquement en SQL pur.",
  );
}

export async function askLLMForAnswer(prompt: string): Promise<string> {
  return askLLM(
    prompt,
    "Tu es un assistant analytique pour une plateforme SaaS. Reponds de maniere concise a la question de l'utilisateur sur la base des donnees fournies.",
  );
}
