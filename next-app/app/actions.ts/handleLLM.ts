"use server";

import type { QueryResult, QueryResultRow } from "pg";
import { askLLMForAnswer, askLLMForSql } from "@/src/lib/llm";
import { createLogger } from "@/src/lib/logger";
import { pool } from "@/src/lib/pool_db";
import { generateAnswerPrompt, generateSQL } from "@/src/lib/prompt";

const logger = createLogger("NL2SQL");

export async function executeNaturalLanguageQuery(
  question: string,
  history: { role: string; content: string }[] = [],
) {
  const requestId = Math.random().toString(36).slice(2, 10);
  const startTime = Date.now();

  logger.info("Starting NL2SQL pipeline", { requestId, question });

  try {
    let fullPrompt: string;

    try {
      fullPrompt = await generateSQL(question, history);
    } catch (error: any) {
      logger.error("Prompt generation failed", {
        requestId,
        error: error.message,
      });
      return { error: "Impossible d'initialiser la recherche." };
    }

    let rawSql = await askLLMForSql(fullPrompt);
    let cleanSql = extractSql(rawSql);

    logger.info("First SQL attempt generated", { requestId, sql: cleanSql });

    const maxRetries = 2;
    let retryCount = 0;
    let finalResult: QueryResult<QueryResultRow> | null = null;

    while (retryCount <= maxRetries) {
      if (cleanSql.toUpperCase().includes("OFF_TOPIC")) {
        logger.info("Query marked as OFF_TOPIC", { requestId });

        const offTopicExplanation = await askLLMForAnswer(`
L'utilisateur a pose la question suivante : "${question}"
Le systeme SQL a determine que c'etait hors sujet (OFF_TOPIC).

### CONTEXTE
Tu es un expert en analyse de donnees.
Les tables disponibles permettent de suivre les clients (crm_customer), leurs abonnements (billing_subscription) et leurs factures (billing_invoice).

### MISSION
- Si la question est vraiment hors sujet (ex: cuisine, sport, blagues), explique-le poliment.
- Si la question est liee au business mais trop vague pour du SQL, essaie d'apporter une reponse analytique utile ou demande une precision.
- Reponds de maniere concise et professionnelle en francais.
`);

        return { answer: offTopicExplanation, sql: cleanSql };
      }

      try {
        const dbStart = Date.now();
        await pool.query(`EXPLAIN ${cleanSql}`);
        finalResult = await pool.query(cleanSql);

        logger.info("SQL execution successful", {
          requestId,
          retryCount,
          durationMs: Date.now() - dbStart,
          rowCount: finalResult.rowCount,
        });
        break;
      } catch (dbError: any) {
        retryCount += 1;

        logger.warn("SQL execution failed, retrying...", {
          requestId,
          retryCount,
          error: dbError.message,
          sql: cleanSql,
        });

        if (retryCount > maxRetries) {
          logger.error("Max retries reached for SQL generation", {
            requestId,
            sql: cleanSql,
          });
          return {
            error:
              "Desole, je n'arrive pas a generer une requete SQL valide apres plusieurs essais.",
          };
        }

        const correctionPrompt = `
LE SQL PRECEDENT A ECHOUE AVEC CETTE ERREUR : ${dbError.message}
SQL FAUTIF : ${cleanSql}

CORRIGE LE SQL EN RESPECTANT LE SCHEMA.
RETOURNE UNIQUEMENT LE CODE SQL CORRIGE.
`;

        rawSql = await askLLMForSql(`${fullPrompt}\n${correctionPrompt}`);
        cleanSql = extractSql(rawSql);
      }
    }

    if (!finalResult) {
      return { error: "Une erreur est survenue lors de l'execution de la requete." };
    }

    const truncatedData = finalResult.rows.slice(0, 30);
    const answerPrompt = generateAnswerPrompt(
      question,
      cleanSql,
      truncatedData,
      history,
    );

    const answerWithChartPrompt = `${answerPrompt}

### FORMAT DE REPONSE OBLIGATOIRE
1. Reponds d'abord avec ton analyse textuelle.
2. Si et seulement si l'utilisateur a explicitement demande un graphique ou une visualisation :
   JSON_START:{"type": "bar|line|pie", "xAxis": "colonne_x", "yAxis": "colonne_y", "label": "titre"}:JSON_END
3. N'ajoute aucun texte apres le bloc JSON.
4. Si aucune visualisation n'est demandee, ne mets jamais ce bloc JSON.
`;

    const rawResponse = await askLLMForAnswer(answerWithChartPrompt);
    const chartMatch = rawResponse.match(
      /JSON_START:?\s*(\{[\s\S]*\})\s*:?JSON_END/,
    );

    let chartConfig;
    let finalAnswer = rawResponse;

    if (chartMatch) {
      try {
        chartConfig = JSON.parse(chartMatch[1]);
        finalAnswer = rawResponse
          .replace(/JSON_START:?\s*\{[\s\S]*\}\s*:?JSON_END/, "")
          .trim();

        logger.info("Chart configuration detected and parsed", {
          requestId,
          type: chartConfig.type,
        });
      } catch (error: any) {
        logger.error("Failed to parse chart JSON", {
          requestId,
          error: error.message,
        });
      }
    }

    logger.info("Pipeline completed successfully", {
      requestId,
      totalDurationMs: Date.now() - startTime,
    });

    return {
      sql: cleanSql,
      data: finalResult.rows,
      rowCount: finalResult.rowCount,
      answer: finalAnswer,
      chartConfig,
    };
  } catch (error: any) {
    logger.error("Critical error in NL2SQL pipeline", {
      requestId,
      error: error.message,
      stack: error.stack,
    });
    return { error: "Une erreur inattendue est survenue." };
  }
}

function extractSql(text: string): string {
  const sqlRegex = /```sql\n?([\s\S]*?)\n?```/i;
  const match = text.match(sqlRegex);
  const clean = match ? match[1].trim() : text.trim();

  return `${clean.replace(/;+$/, "")};`;
}
